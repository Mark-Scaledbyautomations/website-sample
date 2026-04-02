import { Link } from 'react-router-dom'

const products = [
  {
    slug: 'ai-systems',
    title: 'AI Systems, Bots & Automations',
    description: 'Done-for-you AI infrastructure. We diagnose the specific bottleneck, design the AI system that solves it, and build it.',
    features: [
      'AI sales agents that qualify leads and schedule appointments',
      'Automation workflows connecting CRM, email, calendar, and Slack',
      'Custom AI chatbots trained on your content and products',
      'Lead follow-up sequences that trigger within seconds',
      'Internal knowledge bases for instant team answers',
    ],
    audience: 'Business owners generating $10K-$250K+ per month who are overwhelmed by operational complexity.',
    cta: 'Schedule a Build Assessment',
  },
  {
    slug: 'ai-coaching',
    title: 'AI Business Coaching',
    description: 'AI-delivered coaching built on 29 years of consulting methodology. The flagship product is My A.I. Freedom Coach.',
    features: [
      'My A.I. Freedom Systems Course — $888 entry point',
      'Built on the 10 Business Fundamentals framework',
      'Available 24/7 at a fraction of live consulting cost',
      'Teaches you how to implement AI operationally',
      'Covers finance, time, team, scaling, and more',
    ],
    audience: 'Entrepreneurs who want to understand how to fix what is broken in their business using AI.',
    cta: 'Start Learning',
  },
]

export default function Products() {
  return (
    <div>
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-lg text-gray-600">Two interconnected product lines designed to help you build a business that runs without you.</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          {products.map((product) => (
            <div key={product.slug} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{product.title}</h2>
                <p className="text-gray-600 mb-6">{product.description}</p>

                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">What You Get</h3>
                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-blue-600 mt-0.5">&#10003;</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700"><span className="font-semibold">Who this is for:</span> {product.audience}</p>
                </div>

                <Link to={`/products/${product.slug}`} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block">
                  {product.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
