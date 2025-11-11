import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import PetSprite from "../components/PetSprite";
import StatusBarPixel from "../components/StatusBarPixel";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <AppLayout
      headerProps={{
        title: "PIXEL PETS",
        subtitle: "✨ Because every pixel deserves a little love. 🐾",
      }}
    >
      <main className="container stack-lg">
        {/* Hero */}
        <section className="panel panel--wide">
          <div className="panel__body stack-md center">
            <PetSprite type="Dragon" size={240} title="Pixel Pet Preview" />

            {/* Decorative demo bars */}
            <div className="demo-bars u-stack-sm" aria-hidden="true">
              <StatusBarPixel label="Fullness" value={86} kind="fullness" />
              <StatusBarPixel label="Happiness" value={72} kind="happiness" />
              <StatusBarPixel label="Energy" value={63} kind="energy" />
            </div>

            {/* CTAs */}
            <div className="cta-row">
              <button className="btn" onClick={() => navigate("/login")}>
                ▶ START / LOG IN
              </button>
              <button
                className="btn btn--secondary"
                onClick={() => navigate("/register")}
              >
                ★ NEW GAME / REGISTER
              </button>
            </div>
          </div>
        </section>

        {/* Feature tease */}
        <section className="panel panel--wide">
          <header className="panel__header">
            <h2 className="panel__title">Features</h2>
          </header>
          <div className="panel__body">
            <ul className="feature-list">
              <li>🕹️ Retro 8-bit UI with crunchy pixels</li>
              <li>🍖 Feed · 🎾 Play · 💤 Rest to boost stats</li>
              <li>📈 Level up and keep your pets happy</li>
              <li>💾 Real backend (Spring Boot + MySQL)</li>
            </ul>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
