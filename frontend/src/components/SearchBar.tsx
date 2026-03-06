import { useState } from 'react';

interface SearchBarProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

function SearchBar({ onSubmit, isLoading }: SearchBarProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
      setUrl('');
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 17a7 7 0 100-14 7 7 0 000 14zM21 21l-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Cole a URL da notícia aqui..."
          required
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !url.trim()}>
          {isLoading ? (
            <span className="spinner" />
          ) : (
            'Extrair'
          )}
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
