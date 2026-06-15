import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import { ToastProvider } from './context/toastContext';
import Navbar from './components/layout/navbar';
import ToastContainer from './components/ui/toast';

// Pages
import Dashboard from './pages/dashboard';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import ResourcesPage from './pages/resourcesPage';
import ResourceDetailPage from './pages/resourceDetailPage';
import UploadPage from './pages/uploadPage';
import MyResourcesPage from './pages/myResourcesPage';
import AdminDashboard from './pages/adminDashboard';
import AdminUsersPage from './pages/adminUsersPage';
import AdminResourcesPage from './pages/adminResourcesPage';
import SettingsPage from './pages/settingsPage';
import ForumPage from './pages/forumPage';
import WhiteboardPage from './pages/whiteboardPage';
import BookmarksPage from './pages/bookmarksPage';
import LeaderboardPage from './pages/leaderboardPage';

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
