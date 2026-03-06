import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import JsonTest from '../components/JsonTest';
import '../App.css';

function TestPage() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-row">
          <h1>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="header-icon">
              <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V9a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2h-2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            News Extractor — Teste
          </h1>
          <ThemeToggle />
        </div>
        <p className="app-subtitle">
          <Link to="/" className="back-link">&larr; Voltar para a página principal</Link>
        </p>
      </header>

      <main className="app-main">
        <JsonTest />
      </main>

      <footer className="app-footer">
        <p>Powered by Gemini AI</p>
      </footer>
    </div>
  );
}

export default TestPage;
