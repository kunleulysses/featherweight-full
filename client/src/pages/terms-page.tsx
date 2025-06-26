import { Helmet } from 'react-helmet';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Terms of Service - Featherweight.world</title>
        <meta name="description" content="Terms of Service for Featherweight.world - AI-powered journaling companion with Flappy the Pelican" />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 mb-8 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold backdrop-blur-sm border border-purple-200 dark:border-purple-800">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11c0 1.1.9 2 2 2h3.5l1.5-8 1.5 8H15c1.1 0 2-.9 2-2V7l-7-5z" clipRule="evenodd" />
                </svg>
                Terms & Conditions
              </div>
              <h1 className="font-quicksand font-bold text-5xl md:text-6xl lg:text-7xl text-slate-900 dark:text-white mb-8 leading-tight">
                Terms of Service
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
                Our terms of service outline your rights and responsibilities when using Featherweight.world.
              </p>
            </div>

            {/* Content with enhanced readability */}
            <div className="bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-12 lg:p-16 space-y-16">
                
                <section className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="font-quicksand font-bold text-3xl text-slate-900 dark:text-white">Acceptance of Terms</h2>
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                    By accessing and using Featherweight.world, you accept and agree to be bound by the terms and 
                    provision of this agreement. These Terms of Service govern your use of our AI-powered journaling 
                    companion service featuring Flappy the Pelican.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="font-quicksand font-bold text-3xl text-slate-900 dark:text-white">User Accounts</h2>
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                    To access certain features of our service, you must register for an account. You agree to:
                  </p>
                  <ul className="space-y-4 text-lg text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span>Provide accurate and complete information during registration</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span>Maintain the security of your password and account</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span>Notify us immediately of any unauthorized use of your account</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span>Accept responsibility for all activities under your account</span>
                    </li>
                  </ul>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="font-quicksand font-bold text-3xl text-slate-900 dark:text-white">Acceptable Use</h2>
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                    You agree not to use our service to:
                  </p>
                  <ul className="space-y-4 text-lg text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span>Violate any applicable laws or regulations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span>Impersonate others or provide false information</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span>Transmit harmful, offensive, or inappropriate content</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span>Interfere with or disrupt our service or servers</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span>Attempt to gain unauthorized access to our systems</span>
                    </li>
                  </ul>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                      </svg>
                    </div>
                    <h2 className="font-quicksand font-bold text-3xl text-slate-900 dark:text-white">Premium Subscription</h2>
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                    Our premium subscription service includes additional features such as SMS messaging capabilities. 
                    Subscription fees are billed according to your chosen plan and are non-refundable except as 
                    required by law.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="font-quicksand font-bold text-3xl text-slate-900 dark:text-white">Intellectual Property</h2>
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                    The service and its original content, features, and functionality are owned by Featherweight.world 
                    and are protected by international copyright, trademark, and other intellectual property laws.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="font-quicksand font-bold text-3xl text-slate-900 dark:text-white">Limitation of Liability</h2>
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                    Our service is provided "as is" without warranties of any kind. We shall not be liable for any 
                    indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v5a2 2 0 01-2-2V5zM6 9a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V9zM8 11a1 1 0 011-1h6a1 1 0 110 2H9a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="font-quicksand font-bold text-3xl text-slate-900 dark:text-white">Termination</h2>
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                    We may terminate or suspend your account and access to the service immediately, without prior notice, 
                    for conduct that we believe violates these Terms of Service or is harmful to other users or our business.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="font-quicksand font-bold text-3xl text-slate-900 dark:text-white">Contact Information</h2>
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                    If you have any questions about these Terms of Service, please contact us at:
                  </p>
                  <div className="space-y-3 text-lg text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-slate-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <span>Email: support@featherweight.world</span>
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