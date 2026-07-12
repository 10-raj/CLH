import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using the CleanHike Nepal website (www.cleanhikenepal.com), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website.

These terms apply to all visitors, users, and others who access or use our website and services.`,
  },
  {
    title: '2. Website Usage',
    content: `You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others. You must not:

- Attempt to gain unauthorized access to any part of our website or systems
- Use automated tools (bots, scrapers) to extract data without permission
- Upload or transmit any harmful, offensive, or misleading content
- Interfere with the security or functionality of the website
- Impersonate any person or entity

We reserve the right to terminate access to users who violate these terms.`,
  },
  {
    title: '3. Donations',
    content: `CleanHike Nepal is a volunteer-driven environmental initiative. Donations made through our website are voluntary contributions to support our conservation and eco-tourism activities.

All donations are non-refundable unless there is a documented error in processing. Donations are used exclusively for the purposes stated on our website: trail cleanups, environmental campaigns, volunteer coordination, and community outreach.

We do not guarantee any specific outcome or benefit in exchange for a donation. Donation receipts are available upon request for amounts that qualify under local regulations.

If you believe a donation was made in error, please contact us at acharyaraj2005@gmail.com within 7 days.`,
  },
  {
    title: '4. Volunteer Participation',
    content: `By registering to participate in a CleanHike Nepal event, hike, or cleanup, you acknowledge:

- Participation is entirely voluntary
- Outdoor activities carry inherent physical risks
- You are responsible for your own health, fitness, and safety during activities
- CleanHike Nepal volunteers, organizers, and affiliated parties are not liable for personal injury, illness, or property loss during events
- You will follow all instructions from event organizers and respect the natural environment
- You consent to photographs or videos taken during events being used for non-commercial promotional purposes (you may opt out by notifying us in advance)`,
  },
  {
    title: '5. Intellectual Property',
    content: `All content on this website — including text, images, logos, design, and code — is the property of CleanHike Nepal or its respective owners and is protected under applicable intellectual property laws.

You may not copy, reproduce, distribute, or create derivative works from our content without prior written permission. Limited personal, non-commercial use is permitted with attribution.

User-submitted content (messages, reviews) remains the property of the submitter, but by submitting you grant CleanHike Nepal a non-exclusive licence to use and display it.`,
  },
  {
    title: '6. Disclaimer of Liability',
    content: `CleanHike Nepal provides this website and its content "as is" without warranties of any kind, expressed or implied. We do not warrant that:

- The website will be uninterrupted, error-free, or secure
- Information on the website is complete, accurate, or up-to-date
- The website is free of viruses or other harmful components

To the fullest extent permitted by law, CleanHike Nepal and its volunteers, directors, and affiliates shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the website or participation in our activities.`,
  },
  {
    title: '7. Content Accuracy',
    content: `We strive to keep all information on our website accurate and up-to-date, including hike dates, locations, and event details. However, information may change at short notice due to weather, safety concerns, or logistical factors.

Always verify critical information (hike dates, meeting points, etc.) directly with our team before making plans. We are not responsible for decisions made based on outdated information on the website.`,
  },
  {
    title: '8. Third-Party Links',
    content: `Our website may contain links to third-party websites or resources. These links are provided for convenience only. CleanHike Nepal does not endorse, control, or assume responsibility for any third-party content, products, or services.

Accessing third-party sites is at your own risk and subject to their respective terms and privacy policies.`,
  },
  {
    title: '9. Governing Law',
    content: `These Terms and Conditions are governed by the laws of Nepal. Any disputes arising from these terms or your use of the website shall be subject to the exclusive jurisdiction of the courts of Kathmandu, Nepal.`,
  },
  {
    title: '10. Modifications to Terms',
    content: `CleanHike Nepal reserves the right to update or modify these Terms and Conditions at any time. Changes will be posted on this page with an updated date. Continued use of the website after changes constitutes your acceptance of the new terms.`,
  },
  {
    title: '11. Contact Information',
    content: `For questions, concerns, or requests relating to these Terms and Conditions, please contact us:

Email: acharyaraj2005@gmail.com
Phone: +977 98767262762
Address: Dakshinkali, Kathmandu, Nepal`,
  },
];

export function TermsPage() {
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
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Terms &amp; Conditions</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: January 2025</p>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-12 mt-6 p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            Please read these Terms and Conditions carefully before using the CleanHike Nepal website. These terms govern your access to and use of our website, services, and events.
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
                <div className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
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
