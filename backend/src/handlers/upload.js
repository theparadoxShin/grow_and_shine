const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { success, error } = require('../utils/response');

const s3 = new AWS.S3();
const S3_BUCKET = process.env.S3_BUCKET;

const generatePresignedUrl = async (event) => {
  try {
    const userId = event.requestContext.authorizer.userId;
    const { filename, contentType } = event.queryStringParameters || {};

    if (!filename || !contentType) {
      return error('Paramètres manquants: filename et contentType requis', 400);
    }

    // Vérifier le type de fichier
    if (contentType !== 'application/pdf') {
      return error('Seuls les fichiers PDF sont autorisés', 400);
    }

    const fileId = uuidv4();
    const key = `documents/${userId}/${fileId}-${filename}`;

    const params = {
      Bucket: S3_BUCKET,
      Key: key,
      ContentType: contentType,
      Expires: 300, // 5 minutes
      Metadata: {
        userId: userId,
        originalName: filename
      }
    };

    const uploadUrl = s3.getSignedUrl('putObject', params);

    return success({
      uploadUrl,
      key,
      fileId
    });

  } catch (err) {
    console.error('Upload URL generation error:', err);
    return error('Erreur lors de la génération de l\'URL de téléchargement', 500);
  }
};

module.exports = {
  handler: async (event) => {
    const { httpMethod } = event;

    if (httpMethod === 'OPTIONS') {
      return success({});
    }

    if (httpMethod === 'GET') {
      return await generatePresignedUrl(event);
    }

    return error('Méthode non autorisée', 405);
  }
};