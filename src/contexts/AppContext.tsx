import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  company?: string;
  role?: string;
  language?: string;
}

export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  status: 'processing' | 'ready' | 'error' | 'low_confidence';
  confidence?: number;
  pageCount?: number;
  hasTable?: boolean;
  hasForm?: boolean;
}

export interface GeneratedContent {
  id: string;
  title: string;
  prompt: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: string;
  wordCount: number;
  platform?: string;
  mode?: 'text' | 'text-image' | 'image' | 'video';
  style?: string;
  videoStyle?: string;
  videoDuration?: number;
  scheduled?: boolean;
  scheduledDate?: string;
  published?: boolean;
}

export interface SocialAccount {
  id: string;
  platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'tiktok';
  username: string;
  displayName: string;
  avatar: string;
  connected: boolean;
  followers: number;
  engagement: number;
  lastSync: string;
}

export interface SentimentData {
  platform: string;
  positive: number;
  neutral: number;
  negative: number;
  total: number;
  trend: 'up' | 'down' | 'stable';
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  currentView: 'dashboard' | 'documents' | 'generate' | 'comments' | 'history' | 'profile' | 'social-config';
  language: string;
  documents: Document[];
  generatedContent: GeneratedContent[];
  socialAccounts: SocialAccount[];
  sentimentData: SentimentData[];
  isLoading: boolean;
  notifications: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;
}

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_VIEW'; payload: AppState['currentView'] }
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'UPDATE_DOCUMENT'; payload: { id: string; updates: Partial<Document> } }
  | { type: 'ADD_GENERATED_CONTENT'; payload: GeneratedContent }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CONNECT_SOCIAL_ACCOUNT'; payload: SocialAccount }
  | { type: 'DISCONNECT_SOCIAL_ACCOUNT'; payload: string }
  | { type: 'UPDATE_SENTIMENT_DATA'; payload: SentimentData[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: { message: string; type: 'success' | 'error' | 'info' } }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  currentView: 'dashboard',
  language: 'en', // Default to English
  documents: [],
  generatedContent: [],
  socialAccounts: [],
  sentimentData: [],
  isLoading: false,
  notifications: []
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: { ...action.payload, language: action.payload.language || state.language },
        isAuthenticated: true
      };
    case 'LOGOUT':
      localStorage.removeItem('growshine-user');
      localStorage.removeItem('growshine-language');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        currentView: 'dashboard'
      };
    case 'SET_VIEW':
      return {
        ...state,
        currentView: action.payload
      };
    case 'SET_LANGUAGE':
      localStorage.setItem('growshine-language', action.payload);
      return {
        ...state,
        language: action.payload,
        user: state.user ? { ...state.user, language: action.payload } : null
      };
    case 'ADD_DOCUMENT':
      return {
        ...state,
        documents: [...state.documents, action.payload]
      };
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(doc =>
          doc.id === action.payload.id ? { ...doc, ...action.payload.updates } : doc
        )
      };
    case 'ADD_GENERATED_CONTENT':
      return {
        ...state,
        generatedContent: [action.payload, ...state.generatedContent]
      };
    case 'UPDATE_USER':
      const updatedUser = state.user ? { ...state.user, ...action.payload } : null;
      if (updatedUser) {
        localStorage.setItem('growshine-user', JSON.stringify(updatedUser));
      }
      return {
        ...state,
        user: updatedUser
      };
    case 'CONNECT_SOCIAL_ACCOUNT':
      return {
        ...state,
        socialAccounts: [...state.socialAccounts.filter(acc => acc.platform !== action.payload.platform), action.payload]
      };
    case 'DISCONNECT_SOCIAL_ACCOUNT':
      return {
        ...state,
        socialAccounts: state.socialAccounts.filter(acc => acc.id !== action.payload)
      };
    case 'UPDATE_SENTIMENT_DATA':
      return {
        ...state,
        sentimentData: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'ADD_NOTIFICATION':
      const newNotification = {
        id: Date.now().toString(),
        ...action.payload
      };
      return {
        ...state,
        notifications: [...state.notifications, newNotification]
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Load saved language
    const savedLanguage = localStorage.getItem('growshine-language');
    if (savedLanguage) {
      dispatch({ type: 'SET_LANGUAGE', payload: savedLanguage });
    }

    // Load saved user
    const savedUser = localStorage.getItem('growshine-user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      dispatch({ type: 'LOGIN', payload: user });
      
      // Load mock social accounts and sentiment data
      const mockSocialAccounts: SocialAccount[] = [
        {
          id: '1',
          platform: 'facebook',
          username: 'growshine.official',
          displayName: 'Grow&Shine',
          avatar: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=40&h=40&fit=crop&crop=face',
          connected: true,
          followers: 12500,
          engagement: 4.2,
          lastSync: new Date().toISOString()
        },
        {
          id: '2',
          platform: 'linkedin',
          username: 'grow-and-shine',
          displayName: 'Grow&Shine',
          avatar: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=40&h=40&fit=crop&crop=face',
          connected: true,
          followers: 8300,
          engagement: 6.8,
          lastSync: new Date().toISOString()
        },
        {
          id: '3',
          platform: 'twitter',
          username: '@growandshine_ai',
          displayName: 'Grow&Shine',
          avatar: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=40&h=40&fit=crop&crop=face',
          connected: true,
          followers: 5600,
          engagement: 3.1,
          lastSync: new Date().toISOString()
        }
      ];

      const mockSentimentData: SentimentData[] = [
        { platform: 'facebook', positive: 68, neutral: 25, negative: 7, total: 234, trend: 'up' },
        { platform: 'linkedin', positive: 82, neutral: 15, negative: 3, total: 156, trend: 'up' },
        { platform: 'twitter', positive: 45, neutral: 35, negative: 20, total: 189, trend: 'down' },
        { platform: 'instagram', positive: 75, neutral: 20, negative: 5, total: 98, trend: 'stable' }
      ];

      setTimeout(() => {
        mockSocialAccounts.forEach(account => {
          dispatch({ type: 'CONNECT_SOCIAL_ACCOUNT', payload: account });
        });
        dispatch({ type: 'UPDATE_SENTIMENT_DATA', payload: mockSentimentData });
      }, 1000);
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}