import { useState } from "react";
import "./UserPage.css";

export default function UserPage() {
  const [mode, setMode] = useState("signup");

  return (
    <div className="user-page">
      <header className="header">
        <h1 className="logo">Lenz</h1>
      </header>

      <main className="main-container">
        {/* Left */}
        <section className="intro-section">
          <div className="badge">✦ AI 커리어 코치</div>

          <h2 className="title">
            취준생의
            <br />
            <span>자기 의심</span>을
            <br />
            없앤다면
          </h2>

          <p className="description">
            이력서를 입력하면 AI가 강점을 진단하고,
            <br />
            어울리는 직무를 추천하고, 부족한 점을 채울 수 있는 방향까지
            <br />
            한번에 알려드려요.
          </p>
        </section>

        {/* Right */}
        <section className="card-section">
          <div className="card">
            <div className="tabs">
              <button
                className={mode === "signup" ? "active" : ""}
                onClick={() => setMode("signup")}
              >
                회원가입
              </button>

              <button
                className={mode === "login" ? "active" : ""}
                onClick={() => setMode("login")}
              >
                로그인
              </button>
            </div>

            {mode === "signup" ? <SignupForm /> : <LoginForm />}

            <div className="divider">
              <div></div>
              <span>또는</span>
              <div></div>
            </div>

            <button className="guest-btn">
              비회원으로 1회 무료 분석하기
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function SignupForm() {
  return (
    <>
      <h3 className="form-title">
        취준의 방향을
        <br />
        찾아드릴게요
      </h3>

      <p className="form-subtitle">
        학교, 학년, 관심 직무를 입력하면 AI 분석이 시작돼요.
      </p>

      <div className="row">
        <Input label="이름" placeholder="홍길동" />
        <Input label="이메일" placeholder="name@email.com" />
      </div>

      <Input label="비밀번호" placeholder="8자 이상" type="password" />

      <div className="row">
        <Input label="학교" placeholder="OO대학교" />
        <Input label="학년" placeholder="선택" />
      </div>

      <Input label="관심 직무" placeholder="관심 직무 입력" />

      <button className="submit-btn">Lenz 시작하기 →</button>
    </>
  );
}

function LoginForm() {
  return (
    <>
      <h3 className="form-title">
        취준의 방향을
        <br />
        찾아드릴게요
      </h3>

      <p className="form-subtitle">
        이메일과 비밀번호로 로그인하세요.
      </p>

      <Input label="이메일" placeholder="name@email.com" />
      <Input label="비밀번호" placeholder="비밀번호 입력" type="password" />

      <button className="submit-btn">로그인</button>
    </>
  );
}

function Input({ label, placeholder, type = "text" }) {
  return (
    <div className="input-group">
      <label>{label}</label>

      <input type={type} placeholder={placeholder} />
    </div>
  );
}