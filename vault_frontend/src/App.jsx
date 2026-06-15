import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/layout/Navbar';
import ToastContainer from './components/ui/Toast';

// Pages
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResourcesPage from './pages/ResourcesPage';
import ResourceDetailPage from './pages/ResourceDetailPage';
import UploadPage from './pages/UploadPage';
import MyResourcesPage from './pages/MyResourcesPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminResourcesPage from './pages/AdminResourcesPage';
import SettingsPage from './pages/SettingsPage';
import ForumPage from './pages/ForumPage';
import WhiteboardPage from './pages/WhiteboardPage';
import BookmarksPage from './pages/BookmarksPage';
import LeaderboardPage from './pages/LeaderboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-bg">
            <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/resource/:id" element={<ResourceDetailPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/my-resources" element={<MyResourcesPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/resources" element={<AdminResourcesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/forum" element={<ForumPage />} />
              <Route path="/whiteboard" element={<WhiteboardPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ToastContainer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
