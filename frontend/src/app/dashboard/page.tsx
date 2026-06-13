"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import Footer from "../../components/Footer";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
  const [nickname, setNickname] = useState("");
  const [avatarColor, setAvatarColor] = useState("primary");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // Імітація завантаження даних користувача з localStorage
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setNickname(parsedUser.nickname || "");
      setAvatarColor(parsedUser.avatarColor || "primary");
    } else {
      // Якщо користувач не авторизований, перенаправляємо на вхід
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/");
  };

  const saveProfile = () => {
    const updatedUser = { ...user, nickname, avatarColor };
    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setEditMode(false);
  };

  const handleMenuClick = (view: string) => {
    setActiveView(view);
  };

  if (loading) {
    return <div className={styles.loading}>Завантаження...</div>;
  }

  if (!user) {
    return null;
  }

  const roleLabels: Record<string, string> = {
    student: "🎓 Студент / Освітній проєкт",
    startup: "🚀 Стартап / Малий бізнес",
    ngo: "🤝 Громадська організація (ГО)",
  };

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
            <div className={styles.userActions}>
              <span className={styles.userName}>{user.email}</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Вихід
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className="container">
          <div className={styles.grid}>
            {/*側欄: інформація користувача */}
            <aside className={styles.sidebar}>
              <div className={styles.profileCard}>
                <div
                  className={`${styles.avatar} ${styles[`avatar-${avatarColor}`]}`}
                >
                  {(nickname || user.email.charAt(0)).charAt(0).toUpperCase()}
                </div>
                <h2>{nickname || user.email}</h2>
                <p className={styles.role}>
                  {roleLabels[user.role] || user.role}
                </p>
              </div>

              <nav className={styles.menu}>
                <button
                  onClick={() => handleMenuClick("dashboard")}
                  className={`${styles.menuItem} ${
                    activeView === "dashboard" ? styles.active : ""
                  }`}
                >
                  Мій кабінет
                </button>
                <button
                  onClick={() => handleMenuClick("favorites")}
                  className={`${styles.menuItem} ${
                    activeView === "favorites" ? styles.active : ""
                  }`}
                >
                  Мої гранти
                </button>
                <button
                  onClick={() => handleMenuClick("settings")}
                  className={`${styles.menuItem} ${
                    activeView === "settings" ? styles.active : ""
                  }`}
                >
                  Налаштування
                </button>
                <button
                  onClick={() => router.push("/")}
                  className={styles.menuItem}
                >
                  На головну
                </button>
              </nav>
            </aside>

            {/* Основний вміст */}
            <section className={styles.content}>
              {activeView === "dashboard" && (
                <div className={styles.card}>
                  <h1>Ласкаво просимо, {nickname || user.email.split("@")[0]}!</h1>
                  <p>
                    Ви успішно увійшли до свого кабінету. Тут ви можете
                    переглядати гранти, які відповідають вашому профілю.
                  </p>
                </div>
              )}

              {activeView === "favorites" && (
                <div className={styles.card}>
                  <h1>Мої гранти</h1>
                  <p>
                    У вас немає грантів. Приступіть до пошуку та
                    додавайте цікаві вам гранти до вашої колекції.
                  </p>
                </div>
              )}

              {activeView === "settings" && (
                <div className={styles.card}>
                  <h1>Налаштування профілю</h1>

                  {!editMode ? (
                    <div>
                      <div className={styles.settingsSection}>
                        <h3>Інформація профілю</h3>
                        <p>
                          <strong>Email:</strong> {user.email}
                        </p>
                        <p>
                          <strong>Нік:</strong> {nickname || "не встановлено"}
                        </p>
                        <p>
                          <strong>Роль:</strong> {roleLabels[user.role]}
                        </p>
                        <button
                          onClick={() => setEditMode(true)}
                          className="btn btn-primary"
                          style={{ marginTop: "16px" }}
                        >
                          Редагувати профіль
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.settingsForm}>
                      <div className={styles.formGroup}>
                        <label htmlFor="nickname">Нік (ім'я профілю)</label>
                        <input
                          id="nickname"
                          type="text"
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value)}
                          placeholder="Введіть ваш нік"
                          className={styles.input}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Вибір кольору аватара</label>
                        <div className={styles.colorPicker}>
                          {[
                            "primary",
                            "secondary",
                            "accent",
                            "success",
                            "warning",
                          ].map((color) => (
                            <button
                              key={color}
                              onClick={() => setAvatarColor(color)}
                              className={`${styles.colorOption} ${
                                styles[`color-${color}`]
                              } ${avatarColor === color ? styles.selected : ""}`}
                              title={color}
                            >
                              {avatarColor === color && "✓"}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className={styles.avatarPreview}>
                        <div className={styles.previewLabel}>Превью аватара:</div>
                        <div
                          className={`${styles.avatarBig} ${
                            styles[`avatar-${avatarColor}`]
                          }`}
                        >
                          {(nickname || user.email.charAt(0))
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      </div>

                      <div className={styles.buttonGroup}>
                        <button
                          onClick={saveProfile}
                          className="btn btn-primary"
                        >
                          Зберегти
                        </button>
                        <button
                          onClick={() => {
                            setEditMode(false);
                            setNickname(user.nickname || "");
                            setAvatarColor(user.avatarColor || "primary");
                          }}
                          className="btn btn-secondary"
                        >
                          Скасувати
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
