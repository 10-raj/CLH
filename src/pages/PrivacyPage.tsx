import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

const sections = [
  {
    title: '1. Information We Collect',
    content: `When you interact with CleanHike Nepal, we may collect the following types of information:

Contact Information: When you fill out our contact form, we collect your name, email address, and optionally your phone number and message details. This information is used solely to respond to your inquiry.

Volunteer & Partner Information: If you express interest in volunteering or partnering with us, we may collect additional details such as your area of interest, organization name, and how you heard about us.

Donation Information: When you donate, we collect your name, email address, and payment reference details (transaction IDs, payment screenshots) to acknowledge your contribution and maintain our records. We do not store full payment card numbers.

Usage Data: We may collect non-personally identifiable information about how you use our website, such as pages visited, time spent, and browser type, through standard analytics tools.`,
  },
  {
    title: '2. Contact Forms & Communications',
    content: `Any information you submit through our contact form is stored securely in our database and used only to process and respond to your inquiry. We do not sell, rent, or share your contact information with third parties without your consent.

By submitting a message, you agree to receive a response to your inquiry via the email address you provided. You will not be added to any marketing list without explicit consent.`,
  },
  {
    title: '3. Donation Information & Financial Data',
    content: `CleanHike Nepal accepts donations through various local payment methods (eSewa, Khalti, Bank Transfer, etc.). When you donate, you may share payment screenshots or transaction references with us for verification.

We do not process or store credit/debit card numbers directly. Donation records including your name, amount, and verification status are retained for legal and accountability purposes as required by nonprofit regulations in Nepal.

All donation records are kept confidential and are only accessible to authorized administrators.`,
  },
  {
    title: '4. Cookies & Tracking Technologies',
    content: `Our website may use cookies — small text files stored on your device — to remember your preferences (such as dark/light mode) and improve your experience.

We use standard browser storage (localStorage) for theme preferences and session data. We do not use cross-site tracking cookies or serve behavioral advertising.

You may disable cookies in your browser settings, though this may affect certain functionality of the website.`,
  },
  {
    title: '5. Third-Party Services',
    content: `Our website may link to or embed content from third-party services including:

Supabase: We use Supabase as our backend database and authentication provider. Your submitted data is stored on Supabase's infrastructure. Supabase complies with GDPR and other privacy frameworks.

Pexels & Image CDNs: Some images on our site are served from external image providers. These providers may set their own cookies.

Google Maps: Our contact page may embed Google Maps for location display. Google's privacy policy governs any data collected through their services.

YouTube / Video CDNs: Featured videos may be hosted on external platforms. Those platforms' terms apply.`,
  },
  {
    title: '6. Your Rights & Data Access',
    content: `You have the right to:

- Request access to the personal data we hold about you
- Request correction of inaccurate data
- Request deletion of your data (subject to legal retention obligations)
- Withdraw consent for communications at any time

To exercise any of these rights, please contact us at acharyaraj2005@gmail.com. We will respond within 14 business days.`,
  },
  {
    title: '7. Data Security',
    content: `We take the security of your information seriously. We implement the following measures:

- All data transmissions are encrypted via HTTPS/TLS
- Database access is restricted with row-level security policies
- Admin access requires authenticated credentials
- We regularly review our security practices

However, no method of internet transmission is 100% secure. We cannot guarantee absolute security but commit to prompt notification and remediation in the event of a breach.`,
  },
  {
    title: '8. Children\'s Privacy',
    content: `CleanHike Nepal's website is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.`,
  },
  {
    title: '9. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. When we do, we will update the "Last Updated" date at the top of this page. We encourage you to review this policy periodically. Continued use of the website after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: '10. Contact Us',
    content: `If you have any questions about this Privacy Policy or how we handle your data, please reach out to us:

Email: acharyaraj2005@gmail.com
Phone: +977 98767262762
Address: Dakshinkali, Kathmandu, Nepal`,
  },
];

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: January 2025</p>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-12 mt-6 p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            CleanHike Nepal ("we", "our", or "us") is committed to protecting your privacy. This policy explains what information we collect, how we use it, and what rights you have regarding your personal data. By using our website, you agree to the practices described herein.
          </p>

          <div className="space-y-8">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
              >
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{section.title}</h2>
                <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line text-sm">
                  {section.content.split('\n').map((line, j) => (
                    line.startsWith('-') ? (
                      <p key={j} className="flex items-start gap-2 my-1">
                        <span className="text-emerald-500 font-bold mt-0.5">•</span>
                        <span>{line.slice(1).trim()}</span>
                      </p>
                    ) : line.trim() === '' ? (
                      <div key={j} className="h-2" />
                    ) : (
                      <p key={j} className="mb-2">{line}</p>
                    )
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
