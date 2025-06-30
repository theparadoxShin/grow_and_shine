import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Eye, Download, Trash2 } from 'lucide-react';
import { useApp, Document } from '../contexts/AppContext';

export default function DocumentUploader() {
  const { state, dispatch } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const newDocument: Document = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type || 'application/pdf',
          uploadDate: new Date().toISOString(),
          status: 'processing'
        };

        dispatch({ type: 'ADD_DOCUMENT', payload: newDocument });
        dispatch({ 
          type: 'ADD_NOTIFICATION', 
          payload: { message: `Document "${file.name}" en cours de traitement`, type: 'info' } 
        });

        // Simuler le traitement
        setTimeout(() => {
          dispatch({ 
            type: 'UPDATE_DOCUMENT', 
            payload: { id: newDocument.id, updates: { status: 'ready' } }
          });
          dispatch({ 
            type: 'ADD_NOTIFICATION', 
            payload: { message: `Document "${file.name}" prêt à l'utilisation`, type: 'success' } 
          });
        }, 2000 + Math.random() * 3000);
      } else {
        dispatch({ 
          type: 'ADD_NOTIFICATION', 
          payload: { message: 'Seuls les fichiers PDF sont supportés', type: 'error' } 
        });
      }
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'processing':
        return <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'ready':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ready':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes Documents</h1>
        <p className="text-gray-600">Téléchargez et gérez vos documents PDF pour l'analyse IA</p>
      </div>

      {/* Zone de téléchargement */}
      <div
        className={`
          border-2 border-dashed rounded-2xl p-8 text-center transition-all
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Glissez-déposez vos fichiers PDF ici
        </h3>
        <p className="text-gray-600 mb-4">ou cliquez pour sélectionner des fichiers</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all"
        >
          Choisir des fichiers
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        <p className="text-sm text-gray-500 mt-3">Formats supportés: PDF • Taille max: 50MB</p>
      </div>

      {/* Liste des documents */}
      {state.documents.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Documents ({state.documents.length})
          </h2>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            {state.documents.map((document, index) => (
              <div 
                key={document.id}
                className={`p-4 ${index !== state.documents.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{document.name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-500">{formatFileSize(document.size)}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(document.uploadDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>

                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(document.status)} flex items-center gap-2`}>
                    {getStatusIcon(document.status)}
                    {document.status === 'processing' && 'Traitement...'}
                    {document.status === 'ready' && 'Prêt'}
                    {document.status === 'error' && 'Erreur'}
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      disabled={document.status !== 'ready'}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Voir le document"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      disabled={document.status !== 'ready'}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Télécharger"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {state.documents.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document</h3>
          <p className="text-gray-600">Commencez par télécharger votre premier document PDF</p>
        </div>
      )}
    </div>
  );
}