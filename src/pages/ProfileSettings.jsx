import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const API_BASE = 'https://rollback.kingscode.dev/api/v1';

const getAccessToken = () => localStorage.getItem('accessToken') || '';

const ProfileSettings = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Fetch user details on mount
  useEffect(() => {
    
    fetchUser();
  }, []);


  const fetchUser = async () => {
      setIsFetching(true);
      try {
        const res = await fetch(`${API_BASE}/users/me`, {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`
          }
        });
        const data = await res.json();
        if (res.ok && data) {
          setUser(data.user);
          setUsername(data?.user?.username || '');
        } else {
          toast.error(data?.error || 'Failed to fetch user profile.');
        }
      } catch {
        toast.error('A network error occurred.');
      } finally {
        setIsFetching(false);
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !username.trim()) {
      toast.error('Username cannot be empty.');
      return;
    }

    if (username === user.username) {
        toast('Username is already the same.', { icon: 'ℹ️' });
        return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify({ username })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Username updated successfully!');
         fetchUser();
        
      } else {
        toast.error(data?.error || 'Failed to update username.');
      }
    } catch {
      toast.error('A network error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <div className="text-white text-lg">Loading Profile...</div>
      </div>
    );
  }

  return (
    <div className="flex items-cente p-4">
      <div className="p-8 rounded-xl max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-slate-800">Update Username</h1>
        <form
          onSubmit={handleSubmit}
          className="flex items-stretch gap-2"
        >
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="flex-grow p-3 text-slate-800 bg-white rounded-md border border-zinc-600 focus:ring-2 focus:ring-orange-500 focus:outline-none transition"
            placeholder="Enter new username"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-orange-600 text-white font-bold rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;