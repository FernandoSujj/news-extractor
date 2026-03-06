import { useState } from 'react';
import SearchBar from './components/SearchBar';
import NewsList from './components/NewsList';
import ThemeToggle from './components/ThemeToggle';
import type { NewsItem, NewsEntry } from './types/news';
import './App.css';

function isNewsItem(obj: unknown): obj is NewsItem {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'titulo' in obj &&
    typeof (obj as NewsItem).titulo === 'string' &&
    'imagem_principal' in obj
  );
}

function App() {
  const [newsItems, setNewsItems] = useState<NewsEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async (url: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`Erro no servidor: ${response.status}`);
      }

      const data = await response.json();
      const result = data.result;

      if (isNewsItem(result)) {
        setNewsItems((prev) => [{ news: result, sourceUrl: url }, ...prev]);
      } else {
        const errorMsg =
          (result as { Erro?: string }).Erro || 'Resposta inesperada do servidor.';
        setError(errorMsg);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-row">
          <h1>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="header-icon">
              <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V9a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2h-2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            News Extractor
          </h1>
          <ThemeToggle />
        </div>
        <p className="app-subtitle">
          Extraia informações estruturadas de qualquer notícia usando IA
        </p>
      </header>

      <main className="app-main">
        <SearchBar onSubmit={handleExtract} isLoading={isLoading} />

        {error && (
          <div className="error-banner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="error-close">&times;</button>
          </div>
        )}

        <NewsList items={newsItems} />
      </main>

      <footer className="app-footer">
        <p>Powered by Gemini AI</p>
      </footer>
    </div>
  );
}

export default App;
