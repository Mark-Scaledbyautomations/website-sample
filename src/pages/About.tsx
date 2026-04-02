import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div>
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About MyAiFreedomSystems</h1>
          <p className="text-lg text-gray-600">Selling AI Systems, Bots, Automations & AI Business Coaching</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            AI is the most powerful tool we have ever had to help business owners stop running their businesses blind. What used to take hours of one-on-one consulting, an AI agent can now deliver to thousands of business owners who could never afford traditional consulting.
          </p>
          <p className="text-gray-600 mb-6">
            That is not replacement. That is multiplication.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">The 10 Business Fundamentals</h2>
          <p className="text-gray-600 mb-6">Every client problem maps to one or more weak fundamentals. Our products are the tools that fix them.</p>

          <div className="grid gap-3">
            {[
              { num: 1, name: 'Principles and Priorities', desc: 'Start by defining what matters most' },
              { num: 2, name: 'Simple Finance Systems', desc: 'What comes in greater than what goes out' },
              { num: 3, name: 'Simple Time Mastery', desc: 'Making the most out of the hours you have' },
              { num: 4, name: 'Business + Project Management', desc: 'Organization makes traction easier' },
              { num: 5, name: 'Your Dream Team', desc: 'Who, when, where, and how to hire' },
              { num: 6, name: 'Optimize Optimize Optimize', desc: 'Iterative improvement and testing' },
              { num: 7, name: 'Scaling Your Business', desc: 'Learn how to grow without imploding' },
              { num: 8, name: 'Sharpen Your Saw', desc: 'Always be improving your best skill' },
              { num: 9, name: 'Mind Your Heart', desc: 'Timeless wisdom to fortify yourself' },
              { num: 10, name: 'Lead Boldly', desc: 'Own your calling' },
            ].map((f) => (
              <div key={f.num} className="flex items-start gap-4 p-4 rounded-lg border border-gray-200">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0">{f.num}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{f.name}</h3>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/products" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              See How We Help
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
