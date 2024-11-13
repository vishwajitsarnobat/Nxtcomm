// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, Users, Building2 } from 'lucide-react';

const UserHomepage = React.lazy(() => import('./components/UserHomepage/UserHomepage'));
const EmployeeHomepage = React.lazy(() => import('./components/EmployeeHomepage/EmployeeHomepage'));
const AdminHomepage = React.lazy(() => import('./components/AdminHomepage/AdminHomepage'));

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <Link
                  to="/"
                  className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                >
                  <Home className="w-4 h-4 mr-2" />
                  User Home
                </Link>
                <Link
                  to="/employee"
                  className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Employee Home
                </Link>
                <Link
                  to="/admin"
                  className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Admin Home
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <React.Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-600">Loading...</div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<UserHomepage />} />
              <Route path="/employee" element={<EmployeeHomepage />} />
              <Route path="/admin" element={<AdminHomepage />} />
            </Routes>
          </React.Suspense>
        </main>
      </div>
    </Router>
  );
};

export default App;