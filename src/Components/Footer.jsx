import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="fit-footer">
      <div className="fit-container fit-footer-content">
        <Link to="/" className="fit-brand">FitTrack</Link>
        <nav aria-label={t("nav.footer")}>
          <Link to="/about">{t("nav.about")}</Link>
          <Link to="/contact">{t("nav.contact")}</Link>
          <Link to="/privacy">{t("nav.privacy")}</Link>
          <Link to="/terms">{t("nav.terms")}</Link>
        </nav>
      </div>
    </footer>
  );
}
