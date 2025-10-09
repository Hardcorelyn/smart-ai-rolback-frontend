import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { toast } from 'react-hot-toast';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://rollback.kingscode.dev/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store the access token (you might want to use localStorage or a more secure method)
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast.success('Login successful!');
        onLogin();
        navigate('/');
      } else {
        // Handle different error cases
        if (response.status === 400 || response.status === 422) {
          toast.error('Invalid email or password');
        } else {
          toast.error((isObject(data?.error)?  data?.error?.message : data?.error) ||  'Login failed. Please try again.');
        }
      }
    } catch (error) {
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isObject = (obj) => (typeof obj === 'object' && obj !== null);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-zinc-800 overflow-hidden">
      {/* Background Image with Orange Overlay */}
      <div className="absolute inset-0 w-full h-full bg-cover bg-center z-0">
        <div className="absolute inset-0 bg-orange-500 opacity-60"></div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm p-10 rounded-xl text-white text-center max-w-md w-full">
        <h1 className="text-3xl font-bold">AI Smart Rollback System</h1>
        <p className="text-zinc-300 mb-6">Developer Dashboard</p>

        <h2 className="text-2xl font-semibold mb-6">Login As Developer</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
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
          </div>
          
          {/* Forgot Password Link */}
          <div className="text-right">
            <Link 
              to="/forgot-password" 
              className="text-sm text-orange-300 hover:text-orange-200 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Signup Link */}
        <div className="mt-6 text-center">
          <p className="text-zinc-300 text-sm">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-orange-300 hover:text-orange-200 transition-colors font-semibold"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;