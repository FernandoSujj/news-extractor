import { useState } from 'react';
import type { NewsItem } from '../types/news';
import NewsCard from './NewsCard';

const PLACEHOLDER = `{
  "titulo": "Exemplo de notícia",
  "resumo": "Cole aqui o JSON retornado pela IA...",
  "imagem_principal": "https://exemplo.com/imagem.jpg",
  "tags": ["tag1", "tag2"]
}`;

function isNewsItem(obj: unknown): obj is NewsItem {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'titulo' in obj &&
    typeof (obj as NewsItem).titulo === 'string'
  );
}

function JsonTest() {
  const [json, setJson] = useState('');
  const [parsed, setParsed] = useState<NewsItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = () => {
    setError(null);
    setParsed(null);

    if (!json.trim()) {
      setError('Cole um JSON no campo acima.');
      return;
    }

    try {
      const data: unknown = JSON.parse(json.trim());

      if (isNewsItem(data)) {
        setParsed(data);
      } else {
        setError('JSON inválido: deve conter ao menos "titulo".');
      }
    } catch {
      setError('Erro ao fazer parse do JSON. Verifique a formatação.');
    }
  };

  const handleClear = () => {
    setJson('');
    setParsed(null);
    setError(null);
  };

  return (
    <div className="json-test">
      <h2 className="json-test-title">Teste com JSON</h2>
      <p className="json-test-subtitle">
        Cole o JSON retornado pela IA para visualizar o card renderizado.
        Imagens em base64 são convertidas automaticamente.
      </p>

      <textarea
        className="json-test-input"
        value={json}
        onChange={(e) => setJson(e.target.value)}
        placeholder={PLACEHOLDER}
        rows={10}
      />

      <div className="json-test-actions">
        <button className="json-test-btn json-test-btn-primary" onClick={handleProcess}>
          Processar JSON
        </button>
        <button className="json-test-btn json-test-btn-secondary" onClick={handleClear}>
          Limpar
        </button>
      </div>

      {error && (
        <div className="error-banner" style={{ marginTop: '1rem' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {parsed && (
        <div className="json-test-result">
          <h3 className="json-test-result-title">Resultado:</h3>
          <div className="json-test-card-wrapper">
            <NewsCard news={parsed} sourceUrl="#" />
          </div>
        </div>
      )}
    </div>
  );
}

export default JsonTest;
