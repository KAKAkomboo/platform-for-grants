import Link from "next/link";
import styles from "./login.module.css";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <svg width="24" height="24" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="6" fill="#191A23"/>
            <path d="M10 26V10H16.5C18.9853 10 21 12.0147 21 14.5C21 16.9853 18.9853 19 16.5 19H13V26H10ZM13 16H16.5C17.3284 16 18 15.3284 18 14.5C18 13.6716 17.3284 13 16.5 13H13V16Z" fill="#B9FF66"/>
            <circle cx="26" cy="22" r="4" fill="#B9FF66"/>
          </svg>
          <span>GrantHub UA</span>
        </Link>
      </header>

      <main className={styles.main}>
        <div className="card-positivus card-white">
          <div className={styles.formWrapper}>
            <div className={styles.formHeader}>
              <span className="highlight-badge">Вхід</span>
              <h2>Авторизація користувача</h2>
            </div>
            
            <form className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email адреса</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="name@example.com" 
                  required 
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password">Пароль</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  className={styles.input}
                />
              </div>

              <button type="submit" className="btn btn-primary">Увійти в кабінет</button>
            </form>

            <div className={styles.footerLink}>
              Немає акаунту? <Link href="/register">Створити акаунт</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
