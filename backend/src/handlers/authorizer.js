const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {
    principalId
  };

  if (effect && resource) {
    const policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    };
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};

module.exports = {
  handler: async (event) => {
    try {
      const token = event.authorizationToken;

      if (!token) {
        throw new Error('No token provided');
      }

      // Extraire le token du header "Bearer TOKEN"
      const tokenParts = token.split(' ');
      if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        throw new Error('Invalid token format');
      }

      const jwtToken = tokenParts[1];

      // Vérifier et décoder le token
      const decoded = jwt.verify(jwtToken, JWT_SECRET);

      if (!decoded.userId) {
        throw new Error('Invalid token payload');
      }

      // Générer la policy d'autorisation
      const policy = generatePolicy(decoded.userId, 'Allow', event.methodArn);
      
      // Ajouter le userId au context pour les autres fonctions
      policy.context = {
        userId: decoded.userId
      };

      return policy;

    } catch (error) {
      console.error('Authorization error:', error);
      throw new Error('Unauthorized');
    }
  }
};