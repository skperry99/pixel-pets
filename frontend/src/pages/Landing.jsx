import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <AppLayout
      headerProps={{
        title: "PIXEL PETS",
        subtitle: "✨ Because every pixel deserves a little love. 🐾",
      }}
    >
      {/* CTAs */}
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1.25rem" }}>
        <button onClick={() => navigate("/login")}>▶ START / LOG IN</button>
        <button onClick={() => navigate("/register")}>★ NEW GAME / REGISTER</button>
      </div>

      {/* Feature tease panel */}
      <section className="panel" style={{ maxWidth: 720 }}>
        <h2>Features</h2>
        <ul style={{ listStyle: "none", marginTop: "0.75rem" }}>
          <li>🕹️ Retro 8-bit UI with crunchy pixels</li>
          <li>🍖 Feed · 🎾 Play · 💤 Rest to boost stats</li>
          <li>📈 Level up and keep your pets happy</li>
          <li>💾 Real backend (Spring Boot + MySQL)</li>
        </ul>
      </section>
    </AppLayout>
  );
}
