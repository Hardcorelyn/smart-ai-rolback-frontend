import { useNavigate } from 'react-router';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, you'd perform authentication here
    onLogin();
    navigate('/');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-zinc-800 overflow-hidden">
      {/* Background Image with Orange Overlay */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
        style={{ backgroundImage: 'url(https://i.imgur.com/gYAVhPD.png)' }}
      >
        <div className="absolute inset-0 bg-orange-500 opacity-60"></div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm p-10 rounded-xl text-white text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <img src="https://i.imgur.com/3Z6O5p6.png" alt="Logo" className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-bold">AI Smart Rollback System</h1>
        <p className="text-zinc-300 mb-6">Developer Dashboard</p>

        <h2 className="text-2xl font-semibold mb-6">Login As Developer</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
          <div>
            <label htmlFor="username" className="sr-only">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              className="w-full p-3 bg-white/90 text-zinc-800 rounded-md border border-zinc-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="w-full p-3 bg-white/90 text-zinc-800 rounded-md border border-zinc-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;