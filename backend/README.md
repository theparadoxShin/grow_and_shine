# SynthAI-Strategist Backend

Backend serverless pour la plateforme SynthAI-Strategist utilisant AWS Lambda, DynamoDB, S3 et autres services AWS.

## Architecture

### Services AWS utilisés
- **API Gateway** : Routes REST pour l'API
- **Lambda Functions** : Logique métier serverless
- **DynamoDB** : Base de données NoSQL
- **S3** : Stockage des documents et médias
- **Cognito** : Authentification (simulée avec JWT)
- **Comprehend** : Analyse des sentiments
- **EventBridge** : Planification des publications
- **SES** : Notifications par email

### Structure des données

#### Tables DynamoDB

**Users**
```json
{
  "userId": "uuid",
  "email": "string",
  "name": "string",
  "password": "hashed_string",
  "plan": "starter|professional|enterprise",
  "company": "string",
  "role": "string",
  "avatar": "url",
  "createdAt": "iso_date",
  "updatedAt": "iso_date"
}
```

**SocialAccounts**
```json
{
  "userId": "uuid",
  "accountId": "uuid",
  "platform": "facebook|linkedin|twitter|instagram|youtube|tiktok",
  "username": "string",
  "displayName": "string",
  "avatar": "url",
  "accessToken": "encrypted_token",
  "refreshToken": "encrypted_token",
  "followers": "number",
  "engagement": "number",
  "status": "connected|disconnected",
  "connectedAt": "iso_date",
  "lastSync": "iso_date"
}
```

**Posts**
```json
{
  "postId": "uuid",
  "userId": "uuid",
  "title": "string",
  "prompt": "string",
  "content": "string",
  "platform": "string",
  "documentId": "uuid",
  "wordCount": "number",
  "characterCount": "number",
  "status": "draft|scheduled|published|failed",
  "scheduledAt": "iso_date",
  "publishedAt": "iso_date",
  "socialPostId": "string",
  "createdAt": "iso_date"
}
```

**Comments**
```json
{
  "commentId": "uuid",
  "postId": "string",
  "platform": "string",
  "userId": "uuid",
  "text": "string",
  "sentiment": "POSITIVE|NEUTRAL|NEGATIVE",
  "sentimentScore": "number",
  "createdAt": "iso_date"
}
```

**Documents**
```json
{
  "docId": "uuid",
  "userId": "uuid",
  "filename": "string",
  "originalName": "string",
  "s3Key": "string",
  "size": "number",
  "contentType": "string",
  "extractedText": "string",
  "wordCount": "number",
  "status": "processing|ready|error",
  "error": "string",
  "processedAt": "iso_date",
  "createdAt": "iso_date"
}
```

## Fonctions Lambda

### Authentication (`auth-handler`)
- `POST /auth/login` : Connexion utilisateur
- `POST /auth/register` : Inscription utilisateur

### Upload (`upload-handler`)
- `GET /upload-url` : Génère une URL présignée S3

### Documents (`process-document`, `get-user-documents`)
- Traitement automatique des PDFs uploadés
- `GET /user/documents` : Liste des documents utilisateur

### Social Media (`social-*`)
- `POST /social/connect` : Connecte un compte social
- `GET /social/accounts` : Liste des comptes connectés
- `GET /social/sentiment` : Analyse des sentiments

### Content Generation (`generate-content`)
- `POST /content/generate` : Génère du contenu avec OpenAI

### Publishing (`schedule-post`, `publish-post`)
- `POST /content/schedule` : Programme une publication
- `POST /content/publish` : Publie immédiatement

### Analytics (`get-analytics`)
- `GET /analytics/dashboard` : Métriques du tableau de bord

## Installation et Déploiement

### Prérequis
- Node.js 18+
- AWS CLI configuré
- Serverless Framework

### Installation
```bash
cd backend
npm install
```

### Configuration
Créer les paramètres SSM :
```bash
aws ssm put-parameter --name "/synthai/dev/jwt-secret" --value "your-jwt-secret" --type "SecureString"
aws ssm put-parameter --name "/synthai/dev/openai-api-key" --value "your-openai-key" --type "SecureString"
```

### Déploiement
```bash
# Développement
npm run deploy:dev

# Production
npm run deploy:prod
```

### Test local
```bash
npm run local
```

## Sécurité

### Authentification
- JWT tokens avec expiration 7 jours
- Mots de passe hashés avec bcrypt
- Authorizer Lambda pour protéger les routes

### Autorisation
- Filtrage par userId sur toutes les requêtes
- Isolation des données par utilisateur
- Validation des permissions sur les ressources

### Données sensibles
- Tokens sociaux chiffrés
- Paramètres sensibles dans SSM
- CORS configuré pour le frontend

## Monitoring et Logs

### CloudWatch
- Logs automatiques pour toutes les fonctions
- Métriques de performance
- Alertes sur les erreurs

### Debugging
```bash
# Voir les logs en temps réel
serverless logs -f functionName -t
```

## Limitations et Améliorations

### Actuellement simulé
- APIs des réseaux sociaux (mock data)
- OAuth flow complet
- Analyse d'images/vidéos
- Notifications push

### Améliorations futures
- Cache Redis pour les performances
- Queue SQS pour le traitement asynchrone
- CDN CloudFront pour les médias
- Backup automatique DynamoDB
- Tests automatisés complets

## Support

Pour toute question technique, consulter la documentation AWS ou créer une issue dans le repository.