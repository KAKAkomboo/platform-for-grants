import Link from "next/link";
import styles from "../page.module.css";
import Footer from "../../components/Footer";

export default function AboutPage() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <Link href="/" className={styles.logo}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="36" height="36" rx="6" fill="#191A23" />
                <path
                  d="M10 26V10H16.5C18.9853 10 21 12.0147 21 14.5C21 16.9853 18.9853 19 16.5 19H13V26H10ZM13 16H16.5C17.3284 16 18 15.3284 18 14.5C18 13.6716 17.3284 13 16.5 13H13V16Z"
                  fill="#B9FF66"
                />
                <circle cx="26" cy="22" r="4" fill="#B9FF66" />
              </svg>
              <span>GrantHub UA</span>
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.content}>
        <div className="card">
          <h1>Команда</h1>
          <p>
            Ми - команда розробників, дизайнерів та дослідників, які працюють над тим, щоб пошук грантів був простим і швидким.
          </p>

          <div className={styles.teamGrid}>
            <div className={styles.memberCard}>
              <h3>Володимир</h3>
              <p>Product & Backend</p>
              <img className={styles.memberPhoto} src="https://static.vecteezy.com/system/resources/thumbnails/007/570/850/small/backend-development-line-icon-vector.jpg" alt="" />
            </div>
            <div className={styles.memberCard}>
              <h3>Ангеліна</h3>
              <p>Design & UX</p>
              <img className={styles.memberPhoto} src="https://cdn-icons-png.flaticon.com/512/2166/2166796.png" alt="" />
            </div>
            <div className={styles.memberCard}>
              <h3>Руслан</h3>
              <p>Product & Research</p>
              <img className={styles.memberPhoto} src="https://cdn-icons-png.flaticon.com/512/3141/3141343.png" alt="" />
            </div>
            <div className={styles.memberCard}>
              <h3>Ярослав</h3>
              <p>Product & Frontend</p>
              <img className={styles.memberPhoto} src="https://cdn-icons-png.flaticon.com/512/6943/6943958.png" alt="" />
            </div>
            <div className={styles.memberCard}>
              <h3>Артем</h3>
              <p>Product & QA</p>
              <img className={styles.memberPhoto} src="https://cdn-icons-png.flaticon.com/512/3408/3408823.png" alt="" />
            </div>
            <div className={styles.memberCard}>
              <h3>Анастасія</h3>
              <p>Product & Manager</p>
              <img className={styles.memberPhoto} src="https://cdn-icons-png.flaticon.com/512/5183/5183505.png" alt="" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
