import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../App';

type Mode = 'login' | 'signup';

export default function LoginPage() {
  const { user, signIn, signUp } = useAuthContext();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setSubmitting(true);
    const errMsg = mode === 'login' ? await signIn(email, password) : await signUp(email, password);
    setSubmitting(false);

    if (errMsg) {
      setError(errMsg);
    } else if (mode === 'signup') {
      setError('회원가입이 완료되었습니다. 이메일을 확인하거나 로그인해 주세요.');
      setMode('login');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-tabs">
          <button
            className={`tab-btn${mode === 'login' ? ' active' : ''}`}
            onClick={() => { setMode('login'); setError(null); }}
          >
            로그인
          </button>
          <button
            className={`tab-btn${mode === 'signup' ? ' active' : ''}`}
            onClick={() => { setMode('signup'); setError(null); }}
          >
            회원가입
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            이메일
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 입력"
              required
            />
          </label>
          <label>
            비밀번호
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력 (최소 6자)"
              required
            />
          </label>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-submit-btn" disabled={submitting}>
            {submitting ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'}
          </button>
        </form>
      </div>
    </div>
  );
}
