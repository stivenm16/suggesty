import { OpenAIStream, StreamingTextResponse } from 'ai'
import type { NextApiResponse } from 'next'
import OpenAI from 'openai'

export async function POST(req: any, res: NextApiResponse) {
  const body = await req.json()
  const openai = new OpenAI({
    baseURL: 'http://localhost:11434/v1',
    apiKey: 'ollama',
  })
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: body.message }],
    model: 'llama3',
    stream: true,
  })

  console.log(chatCompletion, 'chatCompletion')
  const stream = OpenAIStream(chatCompletion)

  return new StreamingTextResponse(stream)
}
