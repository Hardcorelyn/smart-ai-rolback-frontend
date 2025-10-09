import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { toast } from 'react-hot-toast';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must include at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must include at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must include at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must include at least one special character';
    }
    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Password validation
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://rollback.kingscode.dev/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Account created successfully! Please login.');
        navigate('/login');
      } else {
        if (response.status === 400) {
          toast.error(data.error || 'Invalid registration data');
        }else if (response.status === 409) {
          toast.error(data.error.message || 'Registration failed. Please try again.');

        }else {
          toast.error(data?.error || 'Registration failed. Please try again.');
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

      {/* Signup Form */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm p-10 rounded-xl text-white text-center max-w-md w-full">
        <h1 className="text-3xl font-bold">AI Smart Rollback System</h1>
        <p className="text-zinc-300 mb-6">Developer Dashboard</p>

        <h2 className="text-2xl font-semibold mb-6">Create Account</h2>

        <form onSubmit={handleSignup} className="flex flex-col gap-4 text-left">
          <div>
            <label htmlFor="username" className="sr-only">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="w-full p-3 bg-white/90 text-zinc-800 rounded-md border border-zinc-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full p-3 bg-white/90 text-zinc-800 rounded-md border border-zinc-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full p-3 bg-white/90 text-zinc-800 rounded-md border border-zinc-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            <p className="text-xs text-zinc-300 mt-1">
              Must include: 8+ characters, uppercase, lowercase, number, special character
            </p>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="w-full p-3 bg-white/90 text-zinc-800 rounded-md border border-zinc-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-zinc-300 text-sm">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-orange-300 hover:text-orange-200 transition-colors font-semibold"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;