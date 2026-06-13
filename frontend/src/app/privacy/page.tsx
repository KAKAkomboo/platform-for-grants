import Link from "next/link";
import styles from "../page.module.css";
import Footer from "../../components/Footer";

export default function PrivacyPage() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <Link href="/" className={styles.logo}>
              <svg width="24" height="24" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="6" fill="#191A23"/>
                <path d="M10 26V10H16.5C18.9853 10 21 12.0147 21 14.5C21 16.9853 18.9853 19 16.5 19H13V26H10ZM13 16H16.5C17.3284 16 18 15.3284 18 14.5C18 13.6716 17.3284 13 16.5 13H13V16Z" fill="#B9FF66"/>
                <circle cx="26" cy="22" r="4" fill="#B9FF66"/>
              </svg>
              <span>GrantHub UA</span>
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.content}>
        <div className="card">
          <h1>Політика конфіденційності🔒</h1>
          <p><strong>Політика конфіденційності: </strong>

GrantHub UA дбає про захист персональних даних користувачів. Ми збираємо лише інформацію, необхідну для роботи сервісу, зокрема ім’я, електронну пошту та налаштування профілю. Дані використовуються для надання рекомендацій, покращення платформи та забезпечення доступу до функцій сервісу. Ми не передаємо особисту інформацію третім особам без згоди користувача.
</p>
          <ul>
            <li>Ми зберігаємо лише необхідні дані для роботи сервісу.</li>
            <li>Не передаємо персональні дані третім особам без згоди.</li>
            <li>Користувачі можуть вимагати видалення своїх даних.</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
