const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const dynamodb = require('../utils/dynamodb');
const { success, error } = require('../utils/response');

const USERS_TABLE = process.env.USERS_TABLE;
const JWT_SECRET = process.env.JWT_SECRET;

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  company: Joi.string().optional(),
  role: Joi.string().optional()
});

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

const login = async (event) => {
  try {
    const { error: validationError, value } = loginSchema.validate(JSON.parse(event.body));
    
    if (validationError) {
      return error('Données invalides', 400, validationError.details);
    }

    const { email, password } = value;

    // Rechercher l'utilisateur par email
    const users = await dynamodb.query(
      USERS_TABLE,
      'email = :email',
      { ':email': email },
      'EmailIndex'
    );

    if (!users || users.length === 0) {
      return error('Email ou mot de passe incorrect', 401);
    }

    const user = users[0];

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return error('Email ou mot de passe incorrect', 401);
    }

    // Générer le token JWT
    const token = generateToken(user.userId);

    // Retourner les données utilisateur (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = user;

    return success({
      user: userWithoutPassword,
      token
    });

  } catch (err) {
    console.error('Login error:', err);
    return error('Erreur interne du serveur', 500);
  }
};

const register = async (event) => {
  try {
    const { error: validationError, value } = registerSchema.validate(JSON.parse(event.body));
    
    if (validationError) {
      return error('Données invalides', 400, validationError.details);
    }

    const { name, email, password, company, role } = value;

    // Vérifier si l'utilisateur existe déjà
    const existingUsers = await dynamodb.query(
      USERS_TABLE,
      'email = :email',
      { ':email': email },
      'EmailIndex'
    );

    if (existingUsers && existingUsers.length > 0) {
      return error('Un compte avec cet email existe déjà', 409);
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const userId = uuidv4();
    const user = {
      userId,
      name,
      email,
      password: hashedPassword,
      company: company || null,
      role: role || null,
      plan: 'starter',
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await dynamodb.put(USERS_TABLE, user);

    // Générer le token JWT
    const token = generateToken(userId);

    // Retourner les données utilisateur (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = user;

    return success({
      user: userWithoutPassword,
      token
    }, 201);

  } catch (err) {
    console.error('Register error:', err);
    return error('Erreur interne du serveur', 500);
  }
};

module.exports = {
  handler: async (event) => {
    const { httpMethod, path } = event;

    if (httpMethod === 'OPTIONS') {
      return success({});
    }

    try {
      if (path === '/auth/login' && httpMethod === 'POST') {
        return await login(event);
      }
      
      if (path === '/auth/register' && httpMethod === 'POST') {
        return await register(event);
      }

      return error('Route non trouvée', 404);
    } catch (err) {
      console.error('Auth handler error:', err);
      return error('Erreur interne du serveur', 500);
    }
  }
};