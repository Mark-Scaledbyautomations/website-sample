import { useState } from 'react'

const faqs = [
  {
    q: 'What exactly do you build?',
    a: 'We build custom AI systems tailored to your business. This includes AI sales agents that answer calls and qualify leads, automation workflows that connect your tools, custom chatbots trained on your content, and lead follow-up sequences. Every system is built for your specific workflow.',
  },
  {
    q: 'How fast do your AI agents respond to leads?',
    a: 'Our AI agents respond to new leads within 60 seconds during business hours. This speed is critical — studies show that responding within the first minute dramatically increases conversion rates.',
  },
  {
    q: 'Can the AI really handle my customers?',
    a: 'The AI handles the parts of the conversation that do not require human judgment — qualifying leads, answering common questions, and scheduling appointments. The moment a conversation needs a human, it routes to one. Your customers will not feel the difference at the qualification stage; they will feel the speed.',
  },
  {
    q: 'What is the My A.I. Freedom Systems Course?',
    a: 'The My A.I. Freedom Systems Course is an $888 course that teaches business owners how to use AI to implement the 10 Business Fundamentals in their own businesses. It is built on 29 years of consulting methodology and gives you access to an AI coach available at any hour.',
  },
  {
    q: 'How long does it take to build a custom AI system?',
    a: 'The timeline depends on the complexity of your needs. A standard AI sales agent or chatbot can be built in 2-4 weeks. More complex automation workflows may take 4-8 weeks. The first step is a 30-minute build assessment where we map exactly what the system looks like for your setup.',
  },
  {
    q: 'What if I tried automation before and it did not work?',
    a: 'Most automation failures happen because the system was built without understanding the actual workflow. Our build assessment is specifically designed to prevent this — we diagnose the real bottleneck before building anything.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. Any system we build is set up with your security and privacy in mind. You stay in control of your data. We connect to tools you already own or approve, and everything is configured the way you want it.',
  },
  {
    q: 'How do I get started?',
    a: 'The easiest way is to book a free 30-minute build assessment. We will map out exactly what the system looks like for your specific business, what it costs, and what your timeline is. You can also chat with Ava, our AI assistant, using the chat button in the bottom right.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600">Have a question? Find answers below or chat with Ava.</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                <span className="text-gray-400 text-xl shrink-0">{openIndex === i ? '\u2212' : '+'}</span>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
