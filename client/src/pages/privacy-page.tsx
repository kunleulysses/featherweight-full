import { Helmet } from 'react-helmet';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Privacy Policy - Featherweight.world</title>
        <meta name="description" content="Privacy Policy for Featherweight.world - AI-powered journaling companion with Flappy the Pelican" />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 mb-8 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold backdrop-blur-sm border border-blue-200 dark:border-blue-800">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Privacy & Security
              </div>
              <h1 className="font-quicksand font-bold text-5xl md:text-6xl lg:text-7xl text-slate-900 dark:text-white mb-8 leading-tight">
                Privacy Policy
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
                Your privacy and data security are fundamental to our service. Here's how we protect and handle your information.
              </p>
            </div>

            {/* Content with enhanced readability */}
            <div className="bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-12 lg:p-16 space-y-16">
                
                <section className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="font-quicksand font-bold text-3xl text-slate-900 dark:text-white">Information We Collect</h2>
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                    At Featherweight.world, we collect information you provide directly to us, such as when you create an account, 
                    engage with our AI companion Flappy, or communicate with us. This may include your name, email address, 
                    phone number (if provided), and the content of your conversations and journal entries.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="font-quicksand font-bold text-3xl text-slate-900 dark:text-white">How We Use Your Information</h2>
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                    We use the information we collect to provide, maintain, and improve our services, including:
                  </p>
                  <ul className="space-y-4 text-lg text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span>Providing personalized AI conversations and journaling experiences</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span>Sending you daily inspirational content and wellness tips</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span>Processing your account registration and managing your subscription</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span>Responding to your comments, questions, and requests for customer service</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span>Sending you technical notices, updates, security alerts, and administrative messages</span>
                    </li>
                  </ul>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4a1 1 0 011-1h3zm-1 2v1h-1V5h1zM11 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3zm2 2v-1h1v1h-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="font-quicksand font-bold text-3xl text-slate-900 dark:text-white">SMS/Text Messaging Privacy</h2>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-8 mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-amber-800 dark:text-amber-200 text-lg mb-2">
                          Important Privacy Notice
                        </p>
                        <p className="text-amber-700 dark:text-amber-300 leading-relaxed">
                          No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. 
                          All the above categories exclude text messaging originator opt-in data and consent; this information will not 
                          be shared with any third parties.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                    When you provide your phone number and consent to receive SMS messages, we use this information solely to:
                  </p>
                  <ul className="space-y-4 text-lg text-slate-700 dark:text-slate-300 mb-6">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span>Send you AI chat conversations and wellness tips via SMS</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span>Provide account updates and service notifications</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span>Respond to your SMS messages to our service</span>
                    </li>
                  </ul>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                    You can opt out of SMS messages at any time by replying STOP to any message. Standard message and data rates may apply.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                    </div>
                    <h2 className="font-quicksand font-bold text-3xl text-slate-900 dark:text-white">Information Sharing</h2>
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                    We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy. 
                    We may share your information in the following circumstances:
                  </p>
                  <ul className="space-y-4 text-lg text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span>With your consent or at your direction</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span>With service providers who assist us in operating our website and services</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span>To comply with legal obligations or protect our rights</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span>In connection with a business transaction, such as a merger or sale of assets</span>
                    </li>
                  </ul>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="font-quicksand font-bold text-3xl text-slate-900 dark:text-white">Data Security</h2>
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                    We implement appropriate technical and organizational measures to protect your personal information against 
                    unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the 
                    internet or electronic storage is completely secure.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="font-quicksand font-bold text-3xl text-slate-900 dark:text-white">Your Rights</h2>
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                    You have the right to access, update, or delete your personal information. You can also opt out of certain 
                    communications from us. To exercise these rights, please contact us at privacy@featherweight.world.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="font-quicksand font-bold text-3xl text-slate-900 dark:text-white">Contact Us</h2>
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                    If you have any questions about this Privacy Policy, please contact us at:
                  </p>
                  <div className="space-y-3 text-lg text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-slate-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <span>Email: privacy@featherweight.world</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-slate-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>Website: featherweight.world/support</span>
                    </div>
                  </div>
                </section>

                <section className="pt-8 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                </section>
              </div>
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
}