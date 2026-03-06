import { useState } from 'react';
import type { NewsItem } from '../types/news';

interface NewsCardProps {
  news: NewsItem;
  sourceUrl: string;
}

function isBase64Image(str: string): boolean {
  return str.startsWith('data:image/') || /^[A-Za-z0-9+/=]{100,}/.test(str);
}

function getImageSrc(raw: string): string {
  if (!raw) return '';
  if (raw.startsWith('data:image/')) return raw;
  if (isBase64Image(raw)) return `data:image/jpeg;base64,${raw}`;
  return `/image-proxy?url=${encodeURIComponent(raw)}`;
}

function NewsCard({ news, sourceUrl }: NewsCardProps) {
  const [expanded, setExpanded] = useState(false);
  const imageSrc = getImageSrc(news.imagem_principal);
  const isTruncated = news.resumo && news.resumo.length > 100;

  return (
    <>
      <article className="news-card">
        {news.imagem_principal && (
          <div className="news-card-image">
            <img
              src={imageSrc}
              alt={news.titulo}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="news-card-content">
          <h2 className="news-card-title">{news.titulo}</h2>
          <p className="news-card-summary">
            {isTruncated
              ? <>{news.resumo.substring(0, 100)}... <button className="read-more-link" onClick={() => setExpanded(true)}>leia mais</button></>
              : news.resumo}
          </p>
          {news.tags && news.tags.length > 0 && (
            <div className="news-card-tags">
              {news.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="news-card-link"
          >
            Ver notícia original &rarr;
          </a>
        </div>
      </article>

      {expanded && (
        <div className="modal-overlay" onClick={() => setExpanded(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setExpanded(false)}>&times;</button>
            {news.imagem_principal && (
              <div className="modal-card-image">
                <img
                  src={imageSrc}
                  alt={news.titulo}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="modal-card-content">
              <h2 className="modal-card-title">{news.titulo}</h2>
              <p className="modal-card-summary">{news.resumo}</p>
              {news.tags && news.tags.length > 0 && (
                <div className="news-card-tags">
                  {news.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="news-card-link"
              >
                Ver notícia original &rarr;
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NewsCard;
