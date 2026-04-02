import { Link } from 'react-router-dom'

const tiers = [
  {
    name: 'My A.I. Freedom Systems Course',
    price: '$888',
    description: 'Self-paced AI business coaching course',
    features: [
      '10 Business Fundamentals framework',
      'AI implementation guides',
      '24/7 AI coach access',
      'Community support',
    ],
    cta: 'Enroll Now',
    highlight: false,
  },
  {
    name: 'Custom AI System',
    price: 'Custom',
    description: 'Done-for-you AI infrastructure built for your business',
    features: [
      'Full business diagnostic',
      'Custom AI agent or chatbot',
      'Automation workflow design & build',
      'Lead follow-up system',
      'CRM & tool integration',
      'Ongoing support & optimization',
    ],
    cta: 'Book Assessment',
    highlight: true,
  },
]

export default function Pricing() {
  return (
    <div>
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pricing</h1>
          <p className="text-lg text-gray-600">Choose the path that fits where you are right now.</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`border rounded-xl p-8 flex flex-col ${
                tier.highlight ? 'border-blue-600 shadow-lg ring-1 ring-blue-600' : 'border-gray-200'
              }`}
            >
              {tier.highlight && (
                <span className="bg-blue-600 text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full self-start mb-4">Most Popular</span>
              )}
              <h2 className="text-xl font-bold text-gray-900">{tier.name}</h2>
              <div className="mt-4 mb-2">
                <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                {tier.price !== 'Custom' && <span className="text-gray-500 ml-1">one-time</span>}
              </div>
              <p className="text-gray-600 text-sm mb-6">{tier.description}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-600 mt-0.5">&#10003;</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/contact"
                className={`text-center py-3 rounded-lg font-medium transition-colors ${
                  tier.highlight
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Not sure which option is right for you? Talk to Ava using the chat button below — she can help you figure out the best fit.
          </p>
        </div>
      </section>
    </div>
  )
}
