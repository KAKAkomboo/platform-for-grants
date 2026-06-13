"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import HomeFooter from "@/components/HomeFooter";

import { apiCall } from "../lib/api";

interface Grant {
  id: string | number;
  name: string;
  age: string;
  link: string;
  deadline: string;
  firstName: string;
  lastName: string;
  authorEmail: string;
}

interface User {
  email: string;
  firstName?: string;
  lastName?: string;
}

interface NewGrant {
  name: string;
  age: string;
  link: string;
  deadline: string;
  firstName: string;
  lastName: string;
}

export default function Home() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const [newGrant, setNewGrant] = useState<NewGrant>({
    name: "",
    age: "",
    link: "",
    deadline: "",
    firstName: "",
    lastName: "",
  });

  const fetchGrants = async () => {
    try {
      const data = await apiCall("/grants");
      const mapped = data.map((g: any) => ({
        id: g._id,
        name: g.title,
        age: g.targetAudience.join(", ") || g.amount || "",
        link: g.sourceUrl,
        deadline: g.deadline,
        firstName: g.firstName || "Адміністратор",
        lastName: g.lastName || "",
        authorEmail: g.authorEmail || "",
      }));
      setGrants(mapped);
    } catch (err) {
      console.error("Помилка завантаження грантів:", err);
    }
  };

  const fetchFavorites = async () => {
    try {
      const data = await apiCall("/users/favorites");
      const ids = new Set<string>((data || []).map((g: any) => g._id as string));
      setFavoriteIds(ids);
    } catch {
      // not logged in or no favorites
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const parsedUser: User | null = storedUser ? JSON.parse(storedUser) : null;
    setUser(parsedUser);

    const init = async () => {
      await fetchGrants();
      if (parsedUser) {
        await fetchFavorites();
      }
      setNewGrant({
        name: "",
        age: "",
        link: "",
        deadline: "",
        firstName: parsedUser?.firstName || "",
        lastName: parsedUser?.lastName || "",
      });
      setLoading(false);
      setIsMounted(true);
    };
    init();
  }, []);

  const addGrant = async () => {
    if (
      newGrant.name.trim() &&
      newGrant.age.trim() &&
      newGrant.link.trim() &&
      newGrant.deadline.trim() &&
      newGrant.firstName.trim() &&
      newGrant.lastName.trim() &&
      user
    ) {
      try {
        const backendPayload = {
          title: newGrant.name,
          description: `Грант від користувача ${newGrant.firstName} ${newGrant.lastName}`,
          organizer: `${newGrant.firstName} ${newGrant.lastName}`,
          deadline: new Date(newGrant.deadline),
          amount: "за запитом",
          categories: ["Загальна"],
          targetAudience: [newGrant.age],
          sourceUrl: newGrant.link,
          authorEmail: user.email,
          firstName: newGrant.firstName,
          lastName: newGrant.lastName,
          status: "active",
        };

        await apiCall("/grants", {
          method: "POST",
          body: backendPayload,
        });

        await fetchGrants();

        setNewGrant({
          name: "",
          age: "",
          link: "",
          deadline: "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
        });
      } catch (err) {
        console.error("Помилка при додаванні гранту:", err);
      }
    }
  };

  const deleteGrant = async (id: string | number) => {
    try {
      await apiCall(`/grants/${id}`, {
        method: "DELETE",
      });
      await fetchGrants();
    } catch (err) {
      console.error("Помилка видалення гранту:", err);
    }
  };

  const toggleFavorite = async (grantId: string) => {
    if (!user) return;
    if (favoriteIds.has(grantId)) {
      try {
        await apiCall(`/users/favorites/${grantId}`, { method: "DELETE" });
        setFavoriteIds((prev) => { const s = new Set(prev); s.delete(grantId); return s; });
      } catch (err) {
        console.error("Помилка видалення з обраного:", err);
      }
    } else {
      try {
        await apiCall(`/users/favorites/${grantId}`, { method: "POST" });
        setFavoriteIds((prev) => new Set(prev).add(grantId));
      } catch (err) {
        console.error("Помилка додавання до обраного:", err);
      }
    }
  };

  if (!isMounted) return null;

  return (
    <div className={styles.wrapper}>
      {/* Header */}
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
                className={styles.logoIcon}
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
            <div className={styles.authButtons}>
              {!loading && user ? (
                <>
                  <span style={{ marginRight: 16, fontWeight: 500 }}>
                    {user.email}
                  </span>
                  <Link href="/dashboard" className="btn btn-primary">
                    Мій кабінет
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn btn-secondary">
                    Вхід
                  </Link>
                  <Link href="/register" className="btn btn-primary">
                    Реєстрація
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.heroLeft}>
              <h1 className={styles.heroTitle}>
                Пошук грантів в Україні став простим
              </h1>
              <p className={styles.heroDescription}>
                Ми автоматично збираємо та структуруємо грантові можливості з
                десятків ресурсів. Знаходьте фінансування для стартапів, освіти
                та громадських ініціатив в один клік.
              </p>
              <div className={styles.heroCta}>
                {!loading && user ? (
                  <Link href="/dashboard" className="btn btn-primary">
                    Переглянути гранти
                  </Link>
                ) : (
                  <Link href="/register" className="btn btn-primary">
                    Створити акаунт
                  </Link>
                )}
              </div>
            </div>
            <div className={styles.heroRight}>
              <div className={styles.heroIllustration}>
                <svg
                  viewBox="0 0 400 350"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.illustrationSvg}
                >
                  <rect
                    x="20"
                    y="20"
                    width="360"
                    height="310"
                    rx="30"
                    fill="#F3F3F3"
                    stroke="#191A23"
                    strokeWidth="2"
                  />
                  <circle
                    cx="200"
                    cy="175"
                    r="100"
                    fill="#B9FF66"
                    stroke="#191A23"
                    strokeWidth="2"
                  />
                  <rect
                    x="150"
                    y="125"
                    width="100"
                    height="100"
                    rx="15"
                    fill="#191A23"
                  />
                  <path
                    d="M175 175H225M200 150V200"
                    stroke="#B9FF66"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <rect
                    x="40"
                    y="260"
                    width="120"
                    height="40"
                    rx="10"
                    fill="#FFFFFF"
                    stroke="#191A23"
                    strokeWidth="2"
                  />
                  <text
                    x="55"
                    y="285"
                    fill="#191A23"
                    fontWeight="bold"
                    fontSize="12"
                    fontFamily="inherit"
                  >
                    #СТАРТАПИ
                  </text>
                  <rect
                    x="240"
                    y="50"
                    width="120"
                    height="40"
                    rx="10"
                    fill="#FFFFFF"
                    stroke="#191A23"
                    strokeWidth="2"
                  />
                  <text
                    x="260"
                    y="75"
                    fill="#191A23"
                    fontWeight="bold"
                    fontSize="12"
                    fontFamily="inherit"
                  >
                    #СТУДЕНТИ
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners / Sources Bar */}
      <section className={styles.partners}>
        <div className="container">
          <div className={styles.partnersInner}>
            <span className={styles.partnerLogo}>Дія.Бізнес</span>
            <span className={styles.partnerLogo}>House of Europe</span>
            <span className={styles.partnerLogo}>Ресурсний центр ГУРТ</span>
            <span className={styles.partnerLogo}>Громадський Простір</span>
            <span className={styles.partnerLogo}>УФС</span>
          </div>
        </div>
      </section>

      {/* Grants Section */}
      <section className={styles.grantsSection}>
        <div className="container">
          <h2>Список грантів</h2>

          {!loading && user ? (
            <div className={styles.addGrantCard}>
              <h3>Додати новий грант</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    placeholder="Назва гранту"
                    value={newGrant.name}
                    onChange={(e) =>
                      setNewGrant({ ...newGrant, name: e.target.value })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    placeholder="Вік"
                    value={newGrant.age}
                    onChange={(e) =>
                      setNewGrant({ ...newGrant, age: e.target.value })
                    }
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <input
                  type="url"
                  placeholder="Посилання на грант"
                  value={newGrant.link}
                  onChange={(e) =>
                    setNewGrant({ ...newGrant, link: e.target.value })
                  }
                  className={styles.input}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>До коли подавати заявку</label>
                  <input
                    type="date"
                    value={newGrant.deadline}
                    onChange={(e) =>
                      setNewGrant({ ...newGrant, deadline: e.target.value })
                    }
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    placeholder="Прізвище"
                    value={newGrant.lastName}
                    onChange={(e) =>
                      setNewGrant({ ...newGrant, lastName: e.target.value })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    placeholder="Ім'я"
                    value={newGrant.firstName}
                    onChange={(e) =>
                      setNewGrant({ ...newGrant, firstName: e.target.value })
                    }
                    className={styles.input}
                  />
                </div>
              </div>
              <button onClick={addGrant} className="btn btn-primary">
                Додати грант
              </button>
            </div>
          ) : (
            <div className={styles.loginPrompt}>
              <p>
                Щоб додавати гранти, будь ласка,{" "}
                <Link href="/login">увійдіть</Link> або{" "}
                <Link href="/register">зареєструйтеся</Link>
              </p>
            </div>
          )}

          <div className={styles.grantsList}>
            {grants.length === 0 ? (
              <p className={styles.emptyState}>
                Грантів ще не додано. Додайте перший грант!
              </p>
            ) : (
              grants.map((grant) => (
                <div key={grant.id} className={styles.grantCard}>
                  <div className={styles.grantContent}>
                    <h4>{grant.name}</h4>
                    <p className={styles.grantAge}>
                      <strong>Вік:</strong> {grant.age}
                    </p>
                    <p className={styles.grantDeadline}>
                      <strong>До:</strong>{" "}
                      {new Date(grant.deadline).toLocaleDateString("uk-UA")}
                    </p>
                    <p className={styles.grantAuthor}>
                      <strong>Автор:</strong> {grant.firstName} {grant.lastName}
                    </p>
                    <a
                      href={grant.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.grantLink}
                    >
                      Перейти до гранту →
                    </a>
                  </div>
                  <div className={styles.grantActions}>
                    {user && (
                      <button
                        onClick={() => toggleFavorite(grant.id as string)}
                        className={favoriteIds.has(grant.id as string) ? styles.deleteBtn : "btn btn-primary"}
                        title={favoriteIds.has(grant.id as string) ? "Видалити з обраного" : "До обраного"}
                      >
                        {favoriteIds.has(grant.id as string) ? "♥ Обрано" : "♡ До обраного"}
                      </button>
                    )}
                    {user && user.email === grant.authorEmail && (
                      <button
                        onClick={() => deleteGrant(grant.id)}
                        className={styles.deleteBtn}
                        title="Видалити грант"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}