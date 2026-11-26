import { defineConfig, loadEnv } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'

interface NodeLikeReq {
  method?: string
  on: (event: string, listener: (chunk?: unknown) => void) => void
}

interface NodeLikeRes {
  statusCode: number
  setHeader: (name: string, value: string) => void
  end: (chunk?: string) => void
}

type GlobalFetch = (
  input: string,
  init?: { method?: string; headers?: Record<string, string>; body?: string },
) => Promise<{ ok: boolean; status: number; json: () => Promise<unknown> }>

/**
 * サーバー側プロキシ：.env に GEMINI_API_KEY が設定されている場合のみ
 * APIキーをブラウザへ露出せずに Gemini JSON Mode (Structured Outputs) を呼び出す。
 * 未設定時は 503 を返し、フロントエンド側のローカル構造化JSONフォールバックへ切り替える。
 */
function geminiProxyPlugin(apiKey: string | undefined): Plugin {
  return {
    name: 'gemini-json-proxy',
    configureServer(server) {
      server.middlewares.use('/api/ai-json', (rawReq, rawRes) => {
        const req = rawReq as unknown as NodeLikeReq
        const res = rawRes as unknown as NodeLikeRes

        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method Not Allowed' }))
          return
        }

        if (!apiKey) {
          res.statusCode = 503
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'GEMINI_API_KEY_NOT_CONFIGURED' }))
          return
        }

        const chunks: string[] = []
        req.on('data', (chunk) => {
          chunks.push(String(chunk ?? ''))
        })
        req.on('end', async () => {
          try {
            const body = JSON.parse(chunks.join('')) as { prompt?: string }
            if (!body.prompt) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Missing prompt' }))
              return
            }

            const fetchFn = (globalThis as unknown as { fetch?: GlobalFetch }).fetch
            if (!fetchFn) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'Fetch unavailable' }))
              return
            }

            const geminiRes = await fetchFn(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ role: 'user', parts: [{ text: body.prompt }] }],
                  generationConfig: {
                    responseMimeType: 'application/json',
                    temperature: 0.5,
                  },
                }),
              },
            )

            if (!geminiRes.ok) {
              res.statusCode = 502
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: `Gemini API error: ${geminiRes.status}` }))
              return
            }

            const data = (await geminiRes.json()) as {
              candidates?: { content?: { parts?: { text?: string }[] } }[]
            }
            const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text
            if (!jsonText) {
              res.statusCode = 502
              res.end(JSON.stringify({ error: 'Empty response from Gemini' }))
              return
            }

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(jsonText)
          } catch {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Proxy failure' }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
    plugins: [react(), geminiProxyPlugin(env.GEMINI_API_KEY)],
  }
})
