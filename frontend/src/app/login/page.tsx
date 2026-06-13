"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";
import Footer from "../../components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Імітація перевірки облікового запису
    try {
      // Для простоти: якщо email містить @ та пароль не порожній, дозволяємо вхід
      if (email.includes("@") && password.length >= 6) {
        const user = { email, role: "user" };
        localStorage.setItem("currentUser", JSON.stringify(user));
        router.push("/dashboard");
      } else {
        setError("Невірні дані для входу. Спробуйте ще раз.");
        setLoading(false);
      }
    } catch (err) {
      setError("Помилка при вході. Спробуйте ще раз.");
      setLoading(false);
    }
  };

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
            
            {error && <div style={{color: "#d32f2f", marginBottom: 16, padding: 12, background: "#ffebee", borderRadius: 8}}>{error}</div>}

            <form className={styles.form} onSubmit={handleSubmit}>
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

              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? "Завантаження..." : "Увійти в кабінет"}
              </button>
            </form>

            <div className={styles.footerLink}>
              Немає акаунту? <Link href="/register">Створити акаунт</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
