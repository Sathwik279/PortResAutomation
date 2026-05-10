import { loginWithGoogle } from "../firebase";

export default function LoginPage() {
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      alert(`Login failed: ${err.message}`);
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-icon">✨</div>
          <h1>Portfolio Automation</h1>
          <p>Create, manage, and deploy your professional portfolios in seconds.</p>
        </div>
        
        <button type="button" className="google-login-button" onClick={handleLogin}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          <span>Sign in with Google</span>
        </button>
        
        <div className="login-footer">
          <p>Secure authentication powered by Firebase</p>
        </div>
      </div>
    </main>
  );
}
