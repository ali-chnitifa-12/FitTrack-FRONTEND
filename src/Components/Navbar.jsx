import { useContext, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";

const appLinks = [
  { to: "/dashboard", label: "dashboard" },
  { to: "/nutrition", label: "nutrition" },
  { to: "/workouts", label: "workouts" },
  { to: "/coach", label: "coach" },
  { to: "/subscription", label: "subscription" },
];

const publicLinks = [
  { to: "/about", label: "about" },
  { to: "/contact", label: "contact" },
];

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { t } = useTranslation();
  const { key } = useLocation();
  const [openFor, setOpenFor] = useState(null);
  const isOpen = openFor === key;
  const links = user ? appLinks : publicLinks;

  return (
    <header className="fit-header">
      <div className="fit-nav fit-container">
        <Link to="/" className="fit-brand">
          <img src="/icon-192.png" width="36" height="36" alt="" />
          <span>FitTrack</span>
        </Link>
        <button
          type="button"
          className="fit-menu-toggle"
          aria-expanded={isOpen}
          aria-controls="fit-navigation"
          onClick={() => setOpenFor(isOpen ? null : key)}
        >
          {isOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
          {isOpen ? t("nav.close") : t("nav.menu")}
        </button>
        <nav
          id="fit-navigation"
          aria-label={t("nav.main")}
          className={isOpen ? "fit-nav-body is-open" : "fit-nav-body"}
          onKeyDown={(event) => {
            if (event.key === "Escape" && isOpen) {
              setOpenFor(null);
              event.currentTarget.previousElementSibling?.focus();
            }
          }}
        >
          <div className="fit-nav-links">
            {links.map(({ to, label }) => (
              <NavLink key={to} to={to}>{t("nav." + label)}</NavLink>
            ))}
            {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}
          </div>
          <div className="fit-nav-actions">
            <LanguageSwitcher />
            {user ? (
              <button className="fit-button fit-button-secondary" type="button" onClick={() => { setOpenFor(null); logout(); }}>
                {t("nav.logout")}
              </button>
            ) : (
              <Link className="fit-button fit-button-secondary" to="/login">{t("nav.login")}</Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
