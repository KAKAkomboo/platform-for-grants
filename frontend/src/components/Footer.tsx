import styles from "../app/register/register.module.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.siteFooter}>
      <div className={styles.footerInner}>
        <p>© {year} GrantHub UA. Всі права захищено.</p>
        <small>Політика конфіденційності • Умови використання</small>
      </div>
    </footer>
  );
}
