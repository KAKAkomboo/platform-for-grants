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
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [grantsLoading, setGrantsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

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
    setUserLoading(false);
    setIsMounted(true);

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
      setGrantsLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    const total = Math.ceil(grants.length / itemsPerPage);
    if (total > 0 && currentPage > total) {
      setCurrentPage(total);
    }
  }, [grants, currentPage]);

  const totalPages = Math.ceil(grants.length / itemsPerPage);
  const indexOfLastGrant = currentPage * itemsPerPage;
  const indexOfFirstGrant = indexOfLastGrant - itemsPerPage;
  const currentGrants = grants.slice(indexOfFirstGrant, indexOfLastGrant);

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
              {isMounted && !userLoading && user ? (
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
                {isMounted && !userLoading && user ? (
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

          <div className={styles.grantsList}>
            {grantsLoading ? (
              <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
                <p>Завантаження грантів...</p>
              </div>
            ) : grants.length === 0 ? (
              <p className={styles.emptyState}>
                Грантів ще не додано. Додайте перший грант!
              </p>
            ) : (
              currentGrants.map((grant) => (
                <div key={grant.id} className={styles.grantCard}>
                  <div className={styles.grantHeader}>
                    <h4><Link href={`/grants/${grant.id}`}>{grant.name}</Link></h4>
                    <div className={styles.grantActions}>
                      {user && (
                        <button
                          onClick={() => toggleFavorite(grant.id as string)}
                          className={favoriteIds.has(grant.id as string) ? styles.favoriteBtnActive : styles.favoriteBtn}
                          title={favoriteIds.has(grant.id as string) ? "Видалити з обраного" : "До обраного"}
                        >
                          {favoriteIds.has(grant.id as string) ? "♥" : "♡"}
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
                  <div className={styles.grantContent}>
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
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!grantsLoading && totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={styles.pageBtn}
              >
                ← Назад
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`${styles.pageBtn} ${currentPage === page ? styles.activePage : ""}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={styles.pageBtn}
              >
                Вперед →
              </button>
            </div>
          )}

          {/* Create Grant Form */}
          {isMounted && !userLoading && user ? (
            <div className={styles.addGrantCard} style={{ marginTop: 40 }}>
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
            <div className={styles.loginPrompt} style={{ marginTop: 40 }}>
              <p>
                Щоб додавати гранти, будь ласка,{" "}
                <Link href="/login">увійдіть</Link> або{" "}
                <Link href="/register">зареєструйтеся</Link>
              </p>
            </div>
          )}
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}