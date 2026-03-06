import { GoogleGenerativeAI } from '@google/generative-ai';

export function cleanJson(text) {
  if (!text) return text;

  // Remove fenced code blocks and language tags
  text = text.replace(/```(?:json)?\n?/g, '');
  text = text.replace(/```/g, '');

  // Strip leading/trailing quotes and whitespace
  text = text.trim().replace(/^["']|["']$/g, '');

  // Extract the first {...} block if present
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    return text.slice(start, end + 1);
  }
  return text;
}

function buildGloboHeaders() {
  return {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Referer': 'https://g1.globo.com/',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
  };
}

export async function extractor(url) {
  try {
    if (!url) {
      return { status_code: 400, Erro: 'Parâmetro "url" ausente.' };
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return {
        status_code: 400,
        Erro: 'URL inválida. Deve começar com http:// ou https://',
      };
    }

    const fetchHeaders = url.includes('g1.globo.com') ? buildGloboHeaders() : {};

    const pageResponse = await fetch(url, { headers: fetchHeaders });
    if (!pageResponse.ok) {
      throw new Error(`HTTP ${pageResponse.status}`);
    }
    const rawHtml = await pageResponse.text();
    const html = rawHtml
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .trim();

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `
      Extraia do HTML abaixo:
      - titulo
      - resumo
      - imagem principal
      - tags

      Retorne apenas JSON válido.

      HTML:
      ${html}
    `;

    const aiResponse = await model.generateContent(prompt);
    const raw = aiResponse.response.text();

    const cleaned = cleanJson(raw);

    let imageUrl = null;
    if (raw.includes('"imagem_principal":')) {
      imageUrl = raw
        .split('"imagem_principal":')[1]
        .split(',')[0]
        .trim()
        .replace(/^"|"$/g, '');
    }

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch {
      return {
        status_code: 500,
        Erro: 'Resposta do modelo não contém JSON válido.',
        raw,
      };
    }

    if (imageUrl) {
      try {
        const imgResponse = await fetch(imageUrl);
        if (!imgResponse.ok) throw new Error('Image fetch failed');
        const imgBuffer = await imgResponse.arrayBuffer();
        result.imagem_principal = Buffer.from(imgBuffer).toString('base64');
      } catch {
        result.imagem_principal = null;
      }
    }

    return result;
  } catch {
    return { status_code: 400, Erro: 'Falha na extração de dados.' };
  }
}
