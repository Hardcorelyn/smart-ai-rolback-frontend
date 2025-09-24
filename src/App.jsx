import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Login from './pages/Login';

// A component to protect routes that require authentication
const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
      <Route 
        path="/*"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                {/* Redirect any other nested paths to the dashboard */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;