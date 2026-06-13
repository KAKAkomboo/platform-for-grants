import Link from "next/link";
import styles from "./register.module.css";

export default function RegisterPage() {
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
              <span className="highlight-badge">Реєстрація</span>
              <h2>Створення облікового запису</h2>
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
                <label htmlFor="role">Хто ви?</label>
                <select id="role" name="role" required className={styles.select}>
                  <option value="student">🎓 Студент / Освітній проєкт</option>
                  <option value="startup">🚀 Стартап / Малий бізнес</option>
                  <option value="ngo">🤝 Громадська організація (ГО)</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password">Пароль</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="Мінімум 6 символів" 
                  required 
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword">Підтвердіть пароль</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  placeholder="••••••••" 
                  required 
                  className={styles.input}
                />
              </div>

              <button type="submit" className="btn btn-primary">Зареєструватися</button>
            </form>

            <div className={styles.footerLink}>
              Вже є акаунт? <Link href="/login">Увійти</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
