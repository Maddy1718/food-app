import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import DeliveryLayout from "../layouts/DeliveryLayout";
import "./Profile.css";

export default function Profile() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const palette = {
    page: isDark ? "linear-gradient(135deg, #020617 0%, #0f172a 100%)" : "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
    text: isDark ? "#eff6ff" : "#0f172a",
    muted: isDark ? "#cbd5e1" : "#475569",
  };

  return (
    <DeliveryLayout className="profile-page">
      <div className="delivery-page__header">
        <div>
          <p className="delivery-page__eyebrow">Partner Profile</p>
          <h1 className="delivery-page__title">Profile</h1>
          <p className="delivery-page__subtitle">Manage your delivery profile in a polished, partner-focused workspace.</p>
        </div>
      </div>

      <article className="profile-card">
        <p className="profile-card__eyebrow">Delivery partner</p>
        <h2 className="profile-card__title">Welcome, partner</h2>
        <p className="profile-card__copy">Your profile view is ready for the next design pass. Current business logic remains untouched.</p>
      </article>
    </DeliveryLayout>
  );
}

const card = (isDark) => ({
  background: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.96)",
  borderRadius: 24,
  padding: "18px",
  border: `1px solid ${isDark ? "rgba(148,163,184,0.14)" : "rgba(15,23,42,0.08)"}`,
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.16)",
  backdropFilter: "blur(18px)",
});