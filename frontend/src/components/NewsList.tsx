import type { NewsEntry } from '../types/news';
import NewsCard from './NewsCard';

interface NewsListProps {
  items: NewsEntry[];
}

function NewsList({ items }: NewsListProps) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="empty-icon">
          <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V9a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2h-2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p>Nenhuma notícia extraída ainda.</p>
        <span>Cole a URL de uma notícia acima para começar.</span>
      </div>
    );
  }

  return (
    <div className="news-list">
      {items.map((item, index) => (
        <NewsCard key={index} news={item.news} sourceUrl={item.sourceUrl} />
      ))}
    </div>
  );
}

export default NewsList;
