import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://rollback.kingscode.dev/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsEmailSent(true);
        toast.success('Password reset instructions sent to your email!');
      } else {
        if (response.status === 400) {
          toast.error('Invalid email address');
        } else if (response.status === 404) {
          toast.error('Email not found in our system');
        } else {
          toast.error(data.message || 'Failed to send reset email. Please try again.');
        }
      }
    } catch (error) {
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-zinc-800 overflow-hidden">
      {/* Background Image with Orange Overlay */}
      <div className="absolute inset-0 w-full h-full bg-cover bg-center z-0">
        <div className="absolute inset-0 bg-orange-500 opacity-60"></div>
      </div>

      {/* Forgot Password Form */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm p-10 rounded-xl text-white text-center max-w-md w-full">
        <h1 className="text-3xl font-bold">AI Smart Rollback System</h1>
        <p className="text-zinc-300 mb-6">Developer Dashboard</p>

        <h2 className="text-2xl font-semibold mb-6">Reset Password</h2>

        {!isEmailSent ? (
          <>
            <p className="text-zinc-300 mb-6 text-sm">
              Enter your email address and we'll send you instructions to reset your password.
            </p>

            <form onSubmit={handleForgotPassword} className="flex flex-col gap-4 text-left">
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full p-3 bg-white/90 text-zinc-800 rounded-md border border-zinc-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Reset Instructions'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <p className="text-zinc-300 text-sm">
                Reset instructions have been sent to <strong>{email}</strong>. 
                Please check your email and follow the instructions to reset your password.
              </p>
            </div>
          </div>
        )}

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <Link 
            to="/login" 
            className="text-orange-300 hover:text-orange-200 transition-colors text-sm"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;