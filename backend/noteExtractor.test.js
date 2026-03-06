import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import 'dotenv/config';
import { cleanJson, extractor } from './noteExtractor.js';

// ---------------------------------------------------------------------------
// cleanJson
// ---------------------------------------------------------------------------

describe('cleanJson', () => {
  it('retorna o texto intocado se já for JSON limpo', () => {
    const input = '{"titulo": "Test", "tags": []}';
    assert.equal(cleanJson(input), input);
  });

  it('remove bloco de código ```json ... ```', () => {
    const input = '```json\n{"titulo": "Test"}\n```';
    assert.equal(cleanJson(input), '{"titulo": "Test"}');
  });

  it('remove bloco de código ``` ... ``` sem linguagem', () => {
    const input = '```\n{"titulo": "Test"}\n```';
    assert.equal(cleanJson(input), '{"titulo": "Test"}');
  });

  it('extrai apenas o bloco { } quando há texto antes/depois', () => {
    const input = 'Aqui está o resultado:\n{"titulo": "Test"}\nFim.';
    assert.equal(cleanJson(input), '{"titulo": "Test"}');
  });

  it('retorna string vazia se receber string vazia', () => {
    assert.equal(cleanJson(''), '');
  });

  it('retorna null se receber null', () => {
    assert.equal(cleanJson(null), null);
  });

  it('remove aspas envolvendo o JSON', () => {
    const input = '"{"titulo": "Test"}"';
    const result = cleanJson(input);
    assert.ok(result.startsWith('{'));
    assert.ok(result.endsWith('}'));
  });
});

// ---------------------------------------------------------------------------
// extractor — validações (sem chamada de rede)
// ---------------------------------------------------------------------------

describe('extractor — validações de entrada', () => {
  it('retorna erro 400 quando url está vazia', async () => {
    const result = await extractor('');
    assert.equal(result.status_code, 400);
    assert.ok(result.Erro.includes('"url"'));
  });

  it('retorna erro 400 quando url não começa com http', async () => {
    const result = await extractor('ftp://exemplo.com');
    assert.equal(result.status_code, 400);
    assert.ok(result.Erro.includes('http'));
  });

  it('retorna erro 400 quando url é apenas texto sem protocolo', async () => {
    const result = await extractor('exemplo.com/noticia');
    assert.equal(result.status_code, 400);
    assert.ok(result.Erro.includes('http'));
  });
});

// ---------------------------------------------------------------------------
// extractor — integração (requer GOOGLE_API_KEY no .env)
// ---------------------------------------------------------------------------

describe('extractor — integração', () => {
  before(() => {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY não definida. Crie um .env com a chave.');
    }
  });

  it('extrai título, resumo, imagem e tags de uma notícia real', async () => {
    const url = 'https://g1.globo.com/economia/noticia/2026/03/05/lucro-da-petrobras.ghtml';
    const result = await extractor(url);

    assert.ok(!result.Erro, `Extração falhou: ${result.Erro}`);
    assert.equal(typeof result.titulo, 'string', 'titulo deve ser string');
    assert.ok(result.titulo.length > 0, 'titulo não deve estar vazio');
    assert.equal(typeof result.resumo, 'string', 'resumo deve ser string');
    assert.ok(Array.isArray(result.tags), 'tags deve ser array');
  });

  it('retorna erro 400 para URL válida mas inacessível', async () => {
    const result = await extractor('https://url-que-nao-existe-abc123.com/noticia');
    assert.equal(result.status_code, 400);
    assert.ok(result.Erro);
  });
});
