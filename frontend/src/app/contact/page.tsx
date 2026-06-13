import Link from "next/link";
import styles from "../static.module.css";
import HomeFooter from "../../components/HomeFooter";

export default function ContactPage() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <Link href="/" className={styles.logo}>
              <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="6" fill="#191A23" />
                <path d="M10 26V10H16.5C18.9853 10 21 12.0147 21 14.5C21 16.9853 18.9853 19 16.5 19H13V26H10ZM13 16H16.5C17.3284 16 18 15.3284 18 14.5C18 13.6716 17.3284 13 16.5 13H13V16Z" fill="#B9FF66" />
                <circle cx="26" cy="22" r="4" fill="#B9FF66" />
              </svg>
              <span>GrantHub UA</span>
            </Link>
            <Link href="/" className={styles.backLink}>← Назад</Link>
          </div>
        </div>
      </header>

      <div className={styles.hero}>
        <div className="container">
          <h1>📞 Контакти</h1>
          <p>Маєте запитання, пропозиції чи відгуки? Зв'яжіться з нашою командою підтримки.</p>
        </div>
      </div>

      <main className={styles.main}>
        <div className="container">
          <div className={styles.card}>
            <h2>Зворотний зв'язок</h2>
            <p>Ми завжди відкриті до нових ідей та пропозицій щодо покращення платформи.</p>
            
            <div className={styles.contactGrid}>
              <div className={styles.contactItem}>
                <span className={styles.label}>Email: ✉️</span>
                <a href="mailto:hello@granthub.ua">hello@granthub.ua</a>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.label}>Телефон: 📞</span>
                <a href="tel:+380442111111">+38 (044) 211-11-11</a>
              </div>
            </div>
            
            <p style={{ marginTop: 24, fontSize: "0.9rem", color: "#666", textAlign: "center" }}>
              Час відповіді на запити: від 1 до 3 робочих днів.
            </p>
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
