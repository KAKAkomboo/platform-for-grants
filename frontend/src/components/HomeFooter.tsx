import Link from "next/link";
import styles from "../app/page.module.css";

export default function HomeFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerInner}>
          <div className={styles.footerInfo}>
            <Link href="/" className={styles.logo}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="6" fill="#B9FF66"/>
                <path d="M10 26V10H16.5C18.9853 10 21 12.0147 21 14.5C21 16.9853 18.9853 19 16.5 19H13V26H10ZM13 16H16.5C17.3284 16 18 15.3284 18 14.5C18 13.6716 17.3284 13 16.5 13H13V16Z" fill="#191A23"/>
                <circle cx="26" cy="22" r="4" fill="#191A23"/>
              </svg>
              <span className={styles.footerLogoText}>GrantHub UA</span>
            </Link>
            <p className={styles.footerDesc}>
              Автоматичний агрегатор грантових можливостей в Україні. Зручний інструмент для студентів, стартаперів та некомерційного сектору.
            </p>
          </div>

          <div className={styles.footerLinks}>
            <div>
              <h4>Про нас</h4>
              <ul>
                <li><Link href="/about">Команда</Link></li>
                <li><Link href="/contact">Контакти</Link></li>
                <li><Link href="/privacy">Політика конфіденційності</Link></li>
              </ul>
            </div>
            <div>
              <h4>Ресурси</h4>
              <ul>
                <li><Link href="/guide">Керівництво</Link></li>
                <li><Link href="/saper">🎮 Грати в Сапера</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© {year} GrantHub UA. Всі права захищено.</p>
        </div>
      </div>
    </footer>
  );
}
