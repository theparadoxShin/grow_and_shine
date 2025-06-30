const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const dynamodb = require('../utils/dynamodb');
const { success, error } = require('../utils/response');

const textract = new AWS.Textract();
const s3 = new AWS.S3();

const DOCUMENTS_TABLE = process.env.DOCUMENTS_TABLE;
const TEXTRACT_RESULTS_TABLE = process.env.TEXTRACT_RESULTS_TABLE;
const S3_BUCKET = process.env.S3_BUCKET;

const processDocument = async (event) => {
  try {
    console.log('Processing document with Textract:', JSON.stringify(event, null, 2));

    for (const record of event.Records) {
      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

      console.log(`Processing file: ${key} from bucket: ${bucket}`);

      // Extraire userId du chemin
      const pathParts = key.split('/');
      if (pathParts.length < 3 || pathParts[0] !== 'documents') {
        console.error('Invalid file path structure:', key);
        continue;
      }

      const userId = pathParts[1];
      const filename = pathParts[2];

      try {
        // Analyser le document avec Textract
        const textractResult = await analyzeDocumentWithTextract(bucket, key);
        
        // Extraire le texte et la structure
        const extractedData = extractTextAndStructure(textractResult);
        
        // Calculer le score de confiance
        const confidenceScore = calculateConfidenceScore(textractResult);

        // Créer l'entrée dans DynamoDB pour les résultats Textract
        const textractId = uuidv4();
        const textractRecord = {
          textractId,
          docId: filename.split('-')[0], // Extraire l'ID du document
          userId,
          extractedText: extractedData.text,
          structure: extractedData.structure,
          confidence: confidenceScore,
          wordCount: extractedData.text.split(/\s+/).length,
          pageCount: extractedData.pageCount,
          hasTable: extractedData.hasTable,
          hasForm: extractedData.hasForm,
          processedAt: new Date().toISOString()
        };

        await dynamodb.put(TEXTRACT_RESULTS_TABLE, textractRecord);

        // Mettre à jour le document principal
        const docId = filename.split('-')[0];
        const document = {
          docId,
          userId,
          filename: filename.split('-').slice(1).join('-'),
          originalName: filename,
          s3Key: key,
          extractedText: extractedData.text,
          textractId,
          confidence: confidenceScore,
          wordCount: extractedData.text.split(/\s+/).length,
          pageCount: extractedData.pageCount,
          status: confidenceScore >= 85 ? 'ready' : 'low_confidence',
          processedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };

        await dynamodb.put(DOCUMENTS_TABLE, document);

        // Alertes si confiance faible
        if (confidenceScore < 85) {
          console.warn(`Low confidence OCR for document ${docId}: ${confidenceScore}%`);
          // En production, envoyer notification SES
        }

        console.log(`Document processed successfully: ${docId} (confidence: ${confidenceScore}%)`);

      } catch (processError) {
        console.error(`Error processing document ${key}:`, processError);
        
        // Marquer le document comme en erreur
        const docId = uuidv4();
        const errorDocument = {
          docId,
          userId,
          filename: filename.split('-').slice(1).join('-'),
          s3Key: key,
          status: 'error',
          error: processError.message,
          confidence: 0,
          processedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };

        await dynamodb.put(DOCUMENTS_TABLE, errorDocument);
      }
    }

    return { statusCode: 200, body: 'Documents processed with Textract' };

  } catch (error) {
    console.error('Textract processing error:', error);
    throw error;
  }
};

const analyzeDocumentWithTextract = async (bucket, key) => {
  const params = {
    Document: {
      S3Object: {
        Bucket: bucket,
        Name: key
      }
    },
    FeatureTypes: ['TABLES', 'FORMS', 'LAYOUT']
  };

  // Pour les documents multi-pages, utiliser startDocumentAnalysis
  if (key.toLowerCase().includes('multi') || key.toLowerCase().includes('long')) {
    return await startAsyncAnalysis(params);
  }

  // Pour les documents simples, analyse synchrone
  return await textract.analyzeDocument(params).promise();
};

const startAsyncAnalysis = async (params) => {
  const startParams = {
    ...params,
    JobTag: `textract-job-${Date.now()}`
  };

  const startResult = await textract.startDocumentAnalysis(startParams).promise();
  const jobId = startResult.JobId;

  // Attendre la completion (en production, utiliser SQS/SNS)
  let jobStatus = 'IN_PROGRESS';
  let attempts = 0;
  const maxAttempts = 30;

  while (jobStatus === 'IN_PROGRESS' && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const statusResult = await textract.getDocumentAnalysis({ JobId: jobId }).promise();
    jobStatus = statusResult.JobStatus;
    
    if (jobStatus === 'SUCCEEDED') {
      return statusResult;
    }
    
    attempts++;
  }

  throw new Error(`Textract job timeout or failed: ${jobStatus}`);
};

const extractTextAndStructure = (textractResult) => {
  const blocks = textractResult.Blocks || [];
  let text = '';
  let structure = {
    pages: [],
    tables: [],
    forms: [],
    lines: []
  };
  let pageCount = 0;
  let hasTable = false;
  let hasForm = false;

  blocks.forEach(block => {
    switch (block.BlockType) {
      case 'PAGE':
        pageCount++;
        structure.pages.push({
          pageNumber: pageCount,
          geometry: block.Geometry,
          confidence: block.Confidence
        });
        break;

      case 'LINE':
        if (block.Text) {
          text += block.Text + '\n';
          structure.lines.push({
            text: block.Text,
            confidence: block.Confidence,
            geometry: block.Geometry
          });
        }
        break;

      case 'TABLE':
        hasTable = true;
        structure.tables.push({
          confidence: block.Confidence,
          geometry: block.Geometry,
          rowCount: block.RowCount || 0,
          columnCount: block.ColumnCount || 0
        });
        break;

      case 'KEY_VALUE_SET':
        hasForm = true;
        if (block.EntityTypes && block.EntityTypes.includes('KEY')) {
          structure.forms.push({
            type: 'key',
            text: block.Text,
            confidence: block.Confidence
          });
        }
        break;
    }
  });

  return {
    text: text.trim(),
    structure,
    pageCount,
    hasTable,
    hasForm
  };
};

const calculateConfidenceScore = (textractResult) => {
  const blocks = textractResult.Blocks || [];
  const textBlocks = blocks.filter(block => 
    block.BlockType === 'LINE' && block.Confidence !== undefined
  );

  if (textBlocks.length === 0) return 0;

  const totalConfidence = textBlocks.reduce((sum, block) => sum + block.Confidence, 0);
  return Math.round(totalConfidence / textBlocks.length);
};

const getDocumentAnalysis = async (event) => {
  try {
    const userId = event.requestContext.authorizer.userId;
    const { docId } = event.pathParameters;

    // Récupérer les résultats Textract
    const textractResults = await dynamodb.scan(
      TEXTRACT_RESULTS_TABLE,
      'docId = :docId AND userId = :userId',
      { ':docId': docId, ':userId': userId }
    );

    if (!textractResults || textractResults.length === 0) {
      return error('Analyse non trouvée', 404);
    }

    const result = textractResults[0];

    return success({
      analysis: {
        confidence: result.confidence,
        wordCount: result.wordCount,
        pageCount: result.pageCount,
        hasTable: result.hasTable,
        hasForm: result.hasForm,
        structure: result.structure,
        extractedText: result.extractedText.substring(0, 1000) + '...' // Preview
      },
      recommendations: generateRecommendations(result)
    });

  } catch (err) {
    console.error('Get document analysis error:', err);
    return error('Erreur lors de la récupération de l\'analyse', 500);
  }
};

const generateRecommendations = (textractResult) => {
  const recommendations = [];

  if (textractResult.confidence < 85) {
    recommendations.push({
      type: 'warning',
      message: 'Qualité OCR faible - vérifiez le document original',
      action: 'Télécharger une version de meilleure qualité'
    });
  }

  if (textractResult.hasTable) {
    recommendations.push({
      type: 'info',
      message: 'Tableaux détectés - données structurées disponibles',
      action: 'Utiliser pour générer du contenu avec données'
    });
  }

  if (textractResult.hasForm) {
    recommendations.push({
      type: 'info',
      message: 'Formulaires détectés - informations clés extraites',
      action: 'Analyser les champs pour personnalisation'
    });
  }

  if (textractResult.wordCount > 5000) {
    recommendations.push({
      type: 'tip',
      message: 'Document volumineux - segmentation recommandée',
      action: 'Diviser en sections pour génération ciblée'
    });
  }

  return recommendations;
};

module.exports = {
  processDocument,
  getDocumentAnalysis,
  handler: async (event) => {
    // Gérer les événements S3
    if (event.Records) {
      return await processDocument(event);
    }

    const { httpMethod, path } = event;

    if (httpMethod === 'OPTIONS') {
      return success({});
    }

    if (httpMethod === 'GET' && path.includes('/documents/') && path.includes('/analysis')) {
      return await getDocumentAnalysis(event);
    }

    return error('Route non trouvée', 404);
  }
};