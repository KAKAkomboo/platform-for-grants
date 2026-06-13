import Link from "next/link";
import styles from "../static.module.css";
import HomeFooter from "../../components/HomeFooter";

export default function AboutPage() {
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
          <h1>👥 Наша команда</h1>
          <p>Ми — команда розробників, дизайнерів та дослідників, які працюють над тим, щоб пошук грантів був простим і швидким.</p>
        </div>
      </div>

      <main className={styles.main}>
        <div className="container">
          <div className={styles.card}>
            <h2>Хто ми</h2>
            <p>
              GrantHub UA — це платформа для пошуку грантових можливостей в Україні. Ми агрегуємо інформацію з різних джерел, щоб ти міг знайти потрібний грант швидко та без зусиль.
            </p>
          </div>

          <div className={styles.card}>
            <h2>Учасники</h2>
            <div className={styles.teamGrid}>
              {[
                { name: "Володимир", role: "Product & Backend", img: "https://static.vecteezy.com/system/resources/thumbnails/007/570/850/small/backend-development-line-icon-vector.jpg" },
                { name: "Ангеліна", role: "Design & UX", img: "https://cdn-icons-png.flaticon.com/512/2166/2166796.png" },
                { name: "Руслан", role: "Product & Research", img: "https://cdn-icons-png.flaticon.com/512/3141/3141343.png" },
                { name: "Ярослав", role: "Product & Frontend", img: "https://cdn-icons-png.flaticon.com/512/6943/6943958.png" },
                { name: "Артем", role: "Product & QA", img: "https://cdn-icons-png.flaticon.com/512/3408/3408823.png" },
                { name: "Анастасія", role: "Product Manager", img: "https://cdn-icons-png.flaticon.com/512/5183/5183505.png" },
              ].map((m) => (
                <div key={m.name} className={styles.memberCard}>
                  <img className={styles.memberPhoto} src={m.img} alt={m.name} />
                  <h3>{m.name}</h3>
                  <p>{m.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
