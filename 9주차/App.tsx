import { createContext, useContext } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import { useMembers, UseMembersReturn } from './hooks/useMembers';
import { useAuth, UseAuthReturn } from './hooks/useAuth';
import ListPage from './pages/ListPage';
import DetailPage from './pages/DetailPage';
import LoginPage from './pages/LoginPage';

export const MembersContext = createContext<UseMembersReturn | null>(null);
export const AuthContext = createContext<UseAuthReturn | null>(null);

export function useAuthContext(): UseAuthReturn {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthContext not provided');
  return ctx;
}

function Header() {
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="site-header">
      <Link to="/" className="site-title">
        멋사 아기 사자
      </Link>
      <div className="site-header-right">
        {user ? (
          <>
            <span className="user-email">{user.email}</span>
            <button className="logout-btn" onClick={handleSignOut}>
              로그아웃
            </button>
          </>
        ) : (
          <Link to="/login" className="login-link">
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}

function App() {
  const authState = useAuth();
  const membersState = useMembers();

  return (
    <AuthContext.Provider value={authState}>
      <MembersContext.Provider value={membersState}>
        <Header />
        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/lions/:id" element={<DetailPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MembersContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
