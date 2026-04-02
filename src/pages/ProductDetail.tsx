import { useParams, Link } from 'react-router-dom'

const productData: Record<string, {
  title: string
  tagline: string
  description: string
  features: { title: string; desc: string }[]
  cta: string
  ctaLink: string
}> = {
  'ai-systems': {
    title: 'AI Systems, Bots & Automations',
    tagline: 'Done-for-you AI infrastructure that works while you sleep.',
    description: 'A business owner comes to us because they are spending too much time on tasks that do not require a human, losing leads because no one is following up fast enough, or paying staff to do repetitive work that a well-built system could handle in seconds. We diagnose the specific bottleneck, design the AI system that solves it, and build it.',
    features: [
      { title: 'AI Sales Agents', desc: 'Qualify leads, answer inbound calls, and schedule appointments without human involvement. Responds within 60 seconds.' },
      { title: 'Automation Workflows', desc: 'Connect your existing tools — CRM, email, calendar, Slack — into a single operating system that runs itself.' },
      { title: 'Custom AI Chatbots', desc: 'Trained on your own content, policies, and products. Answers customer questions accurately, 24/7.' },
      { title: 'Lead Follow-Up Sequences', desc: 'Trigger follow-ups within seconds of a new inquiry, not hours or days. Never lose a lead to slow response again.' },
      { title: 'Internal Knowledge Bases', desc: 'Let your team get answers instantly without asking the same questions repeatedly.' },
    ],
    cta: 'Schedule Your Build Assessment',
    ctaLink: '/contact',
  },
  'ai-coaching': {
    title: 'AI Business Coaching',
    tagline: '29 years of consulting methodology, delivered by AI at any hour.',
    description: 'The flagship product is CoachTinaMarieAI — an AI coaching system built on thousands of hours of coaching transcripts and the 10 Business Fundamentals framework. The entry point is the AI Freedom Engine, which teaches business owners how to use AI to implement the fundamentals in their own businesses — not theoretically, but operationally.',
    features: [
      { title: 'AI Freedom Engine', desc: 'The entry-level course at $888. Learn how to use AI to fix the core things that make or break a business.' },
      { title: '10 Business Fundamentals', desc: 'A proven diagnostic framework covering principles, finance, time, management, team, optimization, scaling, skills, mindset, and leadership.' },
      { title: '24/7 AI Coach', desc: 'Access business coaching at any hour, for a fraction of what a live consultant charges.' },
      { title: 'Operational, Not Theoretical', desc: 'Every lesson connects directly to what you can implement in your business this week.' },
    ],
    cta: 'Enroll in AI Freedom Engine',
    ctaLink: '/contact',
  },
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const product = productData[slug ?? '']

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
        <Link to="/products" className="text-blue-600 hover:underline">Back to Products</Link>
      </div>
    )
  }

  return (
    <div>
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Link to="/products" className="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; All Products</Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
          <p className="text-lg text-gray-600">{product.tagline}</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-600 mb-12 text-lg leading-relaxed">{product.description}</p>

          <div className="space-y-6">
            {product.features.map((feature, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to={product.ctaLink} className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
              {product.cta}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
