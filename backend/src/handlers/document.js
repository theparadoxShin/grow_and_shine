const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const pdfParse = require('pdf-parse');
const dynamodb = require('../utils/dynamodb');
const { success, error } = require('../utils/response');

const s3 = new AWS.S3();
const DOCUMENTS_TABLE = process.env.DOCUMENTS_TABLE;
const S3_BUCKET = process.env.S3_BUCKET;

const processDocument = async (event) => {
  try {
    console.log('Processing document event:', JSON.stringify(event, null, 2));

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
        // Télécharger le fichier depuis S3
        const s3Object = await s3.getObject({
          Bucket: bucket,
          Key: key
        }).promise();

        // Extraire le texte du PDF
        const pdfData = await pdfParse(s3Object.Body);
        const extractedText = pdfData.text;

        // Créer l'entrée dans DynamoDB
        const docId = uuidv4();
        const document = {
          docId,
          userId,
          filename: filename.split('-').slice(1).join('-'), // Enlever l'UUID du nom
          originalName: s3Object.Metadata?.originalname || filename,
          s3Key: key,
          size: s3Object.ContentLength,
          contentType: s3Object.ContentType,
          extractedText,
          wordCount: extractedText.split(/\s+/).length,
          status: 'ready',
          processedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };

        await dynamodb.put(DOCUMENTS_TABLE, document);

        console.log(`Document processed successfully: ${docId}`);

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
          processedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };

        await dynamodb.put(DOCUMENTS_TABLE, errorDocument);
      }
    }

    return { statusCode: 200, body: 'Documents processed' };

  } catch (error) {
    console.error('Document processing error:', error);
    throw error;
  }
};

const getUserDocuments = async (event) => {
  try {
    const userId = event.requestContext.authorizer.userId;

    const documents = await dynamodb.query(
      DOCUMENTS_TABLE,
      'userId = :userId',
      { ':userId': userId },
      'UserDocumentsIndex'
    );

    // Trier par date de création (plus récent en premier)
    const sortedDocuments = documents.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    return success(sortedDocuments);

  } catch (err) {
    console.error('Get user documents error:', err);
    return error('Erreur lors de la récupération des documents', 500);
  }
};

module.exports = {
  processDocument,
  getUserDocuments: async (event) => {
    const { httpMethod } = event;

    if (httpMethod === 'OPTIONS') {
      return success({});
    }

    if (httpMethod === 'GET') {
      return await getUserDocuments(event);
    }

    return error('Méthode non autorisée', 405);
  }
};