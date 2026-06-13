import Link from "next/link";
import styles from "../static.module.css";
import HomeFooter from "../../components/HomeFooter";

export default function PrivacyPage() {
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
          <h1>🔒 Політика конфіденційності</h1>
          <p>Ми з повагою ставимося до ваших персональних даних та робимо все необхідне для їх безпеки.</p>
        </div>
      </div>

      <main className={styles.main}>
        <div className="container">
          <div className={styles.card}>
            <h2>Основні положення</h2>
            <p>
              GrantHub UA дбає про захист персональних даних користувачів. Ми збираємо лише інформацію, необхідну для роботи сервісу, зокрема ім’я, електронну пошту та налаштування профілю. Дані використовуються для надання рекомендацій, покращення платформи та забезпечення доступу до функцій сервісу. Ми не передаємо особисту інформацію третім особам без вашої згоди.
            </p>
            
            <div className={styles.policyList}>
              <div className={styles.policyItem}>
                <span className={styles.icon}>✅</span>
                <p>Ми зберігаємо лише ті дані, які дійсно необхідні для повноцінної роботи сервісу.</p>
              </div>
              <div className={styles.policyItem}>
                <span className={styles.icon}>🛡️</span>
                <p>Ваші персональні дані надійно захищені та не передаються третім особам без згоди.</p>
              </div>
              <div className={styles.policyItem}>
                <span className={styles.icon}>🗑️</span>
                <p>Ви в будь-який момент можете вимагати видалення своїх персональних даних з нашої бази.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
