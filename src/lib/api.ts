const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const API_KEY = import.meta.env.VITE_CONNECTION_API_KEY

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatResponse {
  message: string
  conversation_id: string
  products: { id: string; name: string }[]
  bot_name: string
  welcome_message?: string
}

export async function sendChat(
  messages: ChatMessage[],
  conversationId?: string,
): Promise<ChatResponse> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/public-chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      messages,
      conversation_id: conversationId,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Chat request failed')
  }

  return res.json()
}

export async function textToSpeech(text: string): Promise<Blob> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/tts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ text }),
  })

  if (!res.ok) {
    throw new Error('TTS request failed')
  }

  return res.blob()
}

interface ContactFormData {
  name: string
  email: string
  company_name?: string
  interest?: string
  message?: string
}

export async function submitContactForm(data: ContactFormData): Promise<{ lead_id: string }> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/save-lead`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      company_name: data.company_name || undefined,
      source: 'website',
      notes: [
        data.interest ? `Interest: ${data.interest}` : '',
        data.message || '',
      ].filter(Boolean).join('\n') || undefined,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Failed to submit form')
  }

  return res.json()
}

export type { ChatMessage, ChatResponse, ContactFormData }
