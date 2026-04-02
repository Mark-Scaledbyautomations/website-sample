import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">My A.I. Freedom Systems</h3>
            <p className="text-sm text-gray-600">AI systems, bots, automations, and business coaching to help entrepreneurs build businesses that run without them.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/products" className="text-sm text-gray-600 hover:text-blue-600">Products</Link>
              <Link to="/pricing" className="text-sm text-gray-600 hover:text-blue-600">Pricing</Link>
              <Link to="/faq" className="text-sm text-gray-600 hover:text-blue-600">FAQ</Link>
              <Link to="/contact" className="text-sm text-gray-600 hover:text-blue-600">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Get In Touch</h4>
            <p className="text-sm text-gray-600 mb-2">Ready to automate your business?</p>
            <Link to="/contact" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Schedule a Call
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">My A.I. Freedom Systems | Profit Drivers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
