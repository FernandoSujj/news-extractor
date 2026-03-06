export interface NewsItem {
  titulo: string;
  resumo: string;
  imagem_principal: string;
  tags: string[];
}

export interface NewsEntry {
  news: NewsItem;
  sourceUrl: string;
}
