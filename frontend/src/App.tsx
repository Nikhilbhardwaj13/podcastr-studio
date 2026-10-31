import { FormEvent, useEffect, useState } from "react";

type Health = { status: string; service: string };
type User = { id: string; email: string; displayName: string };
type AuthResponse = { token: string; user: User };

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json()) as T & { detail?: string; message?: string };
  if (!response.ok) {
    throw new Error(data.detail ?? data.message ?? "Request failed");
  }
  return data;
}

function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showAuth, setShowAuth] = useState(false);
  const [authError, setAuthError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/health")
      .then((response) => {
        if (!response.ok) throw new Error("API unavailable");
        return response.json() as Promise<Health>;
      })
      .then(setHealth)
      .catch(() => setHealth(null));

    const token = localStorage.getItem("podcastr_token");
    if (token) {
      fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          if (!response.ok) throw new Error("Session expired");
          return response.json() as Promise<User>;
        })
        .then(setUser)
        .catch(() => localStorage.removeItem("podcastr_token"));
    }
  }, []);

  const handleAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setAuthError("");
    const form = new FormData(event.currentTarget);
    try {
      const path = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = {
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
        ...(authMode === "register" ? { displayName: String(form.get("displayName") ?? "") } : {}),
      };
      const result = await postJson<AuthResponse>(path, payload);
      localStorage.setItem("podcastr_token", result.token);
      setUser(result.user);
      setShowAuth(false);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Unable to authenticate");
    } finally {
      setBusy(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("podcastr_token");
    setUser(null);
  };

  return (
    <main className="app-shell">
      <nav className="topbar">
        <a className="brand" href="/">
          <span className="brand-mark">◉</span>
          Podcastr <span>Studio</span>
        </a>
        <div className="nav-actions">
          <a href="#discover">Discover</a>
          {user ? (
            <button className="button button-small" onClick={logout}>Sign out</button>
          ) : (
            <button className="button button-small" onClick={() => setShowAuth(true)}>Sign in</button>
          )}
        </div>
      </nav>

      <section className="hero">
        <p className="eyebrow">Your ideas, in every voice</p>
        <h1>Make podcasts people <em>want</em> to finish.</h1>
        <p className="hero-copy">
          Shape a story with Gemini, turn it into a natural multi-voice episode,
          and publish it from one calm, focused workspace.
        </p>
        <div className="hero-actions">
          <button className="button" onClick={() => user ? document.getElementById("create")?.scrollIntoView() : setShowAuth(true)}>
            {user ? "Start creating" : "Join the studio"} <span>→</span>
          </button>
          <a href="#discover" className="text-link">Explore episodes</a>
        </div>
      </section>

      <section className="feature-grid" id="discover">
        <article className="feature-card feature-primary">
          <div className="card-icon">✦</div>
          <p className="eyebrow">AI co-pilot</p>
          <h2>From rough idea to ready-to-record.</h2>
          <p>Draft an outline, refine the tone, and prepare chapters with Gemini.</p>
        </article>
        <article className="feature-card">
          <div className="card-icon green">◌</div>
          <p className="eyebrow">Many voices</p>
          <h2>Conversations that sound alive.</h2>
          <p>Compose episodes with distinct hosts and guest voices.</p>
        </article>
        <article className="feature-card">
          <div className="card-icon purple">▧</div>
          <p className="eyebrow">Creator dashboard</p>
          <h2>Know what resonates.</h2>
          <p>Track listens, favorites, and the episodes your audience returns to.</p>
        </article>
      </section>

      <section className="workspace-card" id="create">
        <div>
          <p className="eyebrow">Workspace status</p>
          <h2>{user ? `Welcome, ${user.displayName}.` : "The studio is ready for its first episode."}</h2>
          <p className="muted">
            Next up: authentication, podcast persistence, and the creation flow.
          </p>
        </div>
        <span className={health ? "status status-online" : "status"}>
          <span /> {health ? "API connected" : "Start API to connect"}
        </span>
      </section>

      {showAuth && (
        <div className="modal-backdrop" onClick={() => setShowAuth(false)}>
          <section className="auth-card" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAuth(false)} aria-label="Close">×</button>
            <p className="eyebrow">{authMode === "login" ? "Welcome back" : "Start creating"}</p>
            <h2>{authMode === "login" ? "Sign in to your studio." : "Create your creator account."}</h2>
            <form onSubmit={handleAuth}>
              {authMode === "register" && <input name="displayName" placeholder="Display name" minLength={2} maxLength={80} required />}
              <input name="email" type="email" placeholder="Email address" required />
              <input name="password" type="password" placeholder="Password (8+ characters)" minLength={8} required />
              {authError && <p className="form-error">{authError}</p>}
              <button className="button form-submit" disabled={busy}>{busy ? "Working..." : authMode === "login" ? "Sign in" : "Create account"}</button>
            </form>
            <button className="switch-auth" onClick={() => { setAuthMode(authMode === "login" ? "register" : "login"); setAuthError(""); }}>
              {authMode === "login" ? "Need an account? Create one" : "Already have an account? Sign in"}
            </button>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;
