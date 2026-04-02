import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Stop Running Your Business Blind.<br />
            <span className="text-blue-600">Let AI Do the Heavy Lifting.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We build AI systems, bots, and automations that handle your leads, follow-ups, and operations — so you can focus on growing your business, not drowning in admin work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
              Explore Our Solutions
            </Link>
            <Link to="/contact" className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors">
              Book a Free Assessment
            </Link>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">What We Do</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Two product lines designed to help business owners stop trading time for outcomes.</p>

          <div className="grid md:grid-cols-2 gap-8">
            <Link to="/products/ai-systems" className="group border border-gray-200 rounded-xl p-8 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="text-3xl mb-4">&#9881;</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">AI Systems, Bots & Automations</h3>
              <p className="text-gray-600 mb-4">Done-for-you AI infrastructure. We diagnose your bottleneck, design the system, and build it. AI sales agents, automation workflows, custom chatbots, and lead follow-up sequences.</p>
              <span className="text-blue-600 font-medium text-sm">Learn more &rarr;</span>
            </Link>

            <Link to="/products/ai-coaching" className="group border border-gray-200 rounded-xl p-8 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="text-3xl mb-4">&#127891;</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">AI Business Coaching</h3>
              <p className="text-gray-600 mb-4">AI-delivered coaching built on 29 years of consulting methodology. Learn how to use AI to fix what is broken in your business with our My A.I. Freedom Systems Course.</p>
              <span className="text-blue-600 font-medium text-sm">Learn more &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-600 py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          <div>
            <div className="text-3xl font-bold">29</div>
            <div className="text-blue-200 text-sm mt-1">Years Experience</div>
          </div>
          <div>
            <div className="text-3xl font-bold">10</div>
            <div className="text-blue-200 text-sm mt-1">Business Fundamentals</div>
          </div>
          <div>
            <div className="text-3xl font-bold">60s</div>
            <div className="text-blue-200 text-sm mt-1">Lead Response Time</div>
          </div>
          <div>
            <div className="text-3xl font-bold">24/7</div>
            <div className="text-blue-200 text-sm mt-1">AI Availability</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Build a Business That Runs Without You?</h2>
          <p className="text-gray-600 mb-8">Schedule a free 30-minute build assessment. We will map exactly what the system looks like for your business.</p>
          <Link to="/contact" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
            Schedule Your Assessment
          </Link>
        </div>
      </section>
    </div>
  )
}
