import Link from "next/link";
import styles from "../static.module.css";
import HomeFooter from "../../components/HomeFooter";

export default function GuidePage() {
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
          <h1>📖 Керівництво</h1>
          <p>Швидкий старт: створіть акаунт, заповніть свій профіль та налаштуйте фільтри, щоб не пропустити жодної можливості.</p>
        </div>
      </div>

      <main className={styles.main}>
        <div className="container">
          <div className={styles.card}>
            <h2>Як це працює</h2>
            <p>Процес взаємодії з нашою платформою максимально простий та автоматизований:</p>
            
            <div className={styles.stepsList}>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>1</div>
                <div className={styles.stepContent}>
                  <h3>Реєстрація</h3>
                  <p>Вкажіть вашу електронну пошту, придумайте надійний пароль та виберіть вашу основну роль (студент, стартап чи громадська організація).</p>
                </div>
              </div>
              
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>2</div>
                <div className={styles.stepContent}>
                  <h3>Налаштування профілю</h3>
                  <p>Вкажіть категорії грантів, які вас цікавлять, і додайте ключові теги для точнішого підбору рекомендацій.</p>
                </div>
              </div>
              
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>3</div>
                <div className={styles.stepContent}>
                  <h3>Пошук та відстеження</h3>
                  <p>Шукайте гранти за тегами, аудиторією або ключовими словами. Зберігайте цікаві гранти у закладинки та переходьте до першоджерел.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
