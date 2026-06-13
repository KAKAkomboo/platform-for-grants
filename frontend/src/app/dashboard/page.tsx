"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import Footer from "../../components/Footer";

import { apiCall } from "../../lib/api";

const PROFILE_TYPES = [
  { value: "student", label: "🎓 Студент / Освітній проєкт" },
  { value: "startup", label: "🚀 Стартап / Малий бізнес" },
  { value: "ngo", label: "🤝 Громадська організація (ГО)" },
];

const ALL_CATEGORIES = [
  "Освіта",
  "Стартап",
  "Наука",
  "Громадські ініціативи",
  "Культура",
  "Медицина",
  "Технології",
  "Екологія",
  "Спорт",
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");

  // Profile edit state
  const [nickname, setNickname] = useState("");
  const [avatarColor, setAvatarColor] = useState("primary");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileType, setProfileType] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);

  // Grants state
  const [myGrants, setMyGrants] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [editingGrantId, setEditingGrantId] = useState<any>(null);
  const [editingGrant, setEditingGrant] = useState<any>(null);

  const fetchMyGrants = useCallback(async (userEmail: string) => {
    try {
      const data = await apiCall("/grants");
      const mapped = data
        .filter((g: any) => g.authorEmail === userEmail)
        .map((g: any) => ({
          id: g._id,
          name: g.title,
          age: Array.isArray(g.targetAudience) ? g.targetAudience.join(", ") : g.amount || "",
          link: g.sourceUrl,
          deadline: g.deadline,
          firstName: g.firstName || "Адміністратор",
          lastName: g.lastName || "",
          authorEmail: g.authorEmail || "",
        }));
      setMyGrants(mapped);
    } catch (err) {
      console.error("Помилка завантаження грантів:", err);
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    try {
      const data = await apiCall("/users/favorites");
      const mapped = (data || []).map((g: any) => ({
        id: g._id,
        name: g.title,
        age: Array.isArray(g.targetAudience) ? g.targetAudience.join(", ") : g.amount || "",
        link: g.sourceUrl,
        deadline: g.deadline,
        firstName: g.firstName || "",
        lastName: g.lastName || "",
        authorEmail: g.authorEmail || "",
        categories: g.categories || [],
      }));
      setFavorites(mapped);
    } catch (err) {
      console.error("Помилка завантаження обраних:", err);
    }
  }, []);

  const fetchRecommendations = useCallback(async () => {
    try {
      const data = await apiCall("/grants/recommendations");
      const mapped = (data || []).map((g: any) => ({
        id: g._id,
        name: g.title,
        age: Array.isArray(g.targetAudience) ? g.targetAudience.join(", ") : g.amount || "",
        link: g.sourceUrl,
        deadline: g.deadline,
        firstName: g.firstName || "",
        lastName: g.lastName || "",
        categories: g.categories || [],
      }));
      setRecommendations(mapped);
    } catch (err) {
      console.error("Помилка завантаження рекомендацій:", err);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setNickname(parsedUser.nickname || "");
      setAvatarColor(parsedUser.avatarColor || "primary");
    } else {
      router.push("/login");
      return;
    }

    // Load full profile from API
    apiCall("/users/profile")
      .then((profile: any) => {
        setUser(profile);
        setNickname(profile.nickname || "");
        setAvatarColor(profile.avatarColor || "primary");
        setFirstName(profile.firstName || "");
        setLastName(profile.lastName || "");
        setProfileType(profile.profileType || "");
        setCategories(profile.categories || []);

        return Promise.all([
          fetchMyGrants(profile.email),
          fetchFavorites(),
          fetchRecommendations(),
        ]);
      })
      .catch(() => {
        router.push("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, fetchMyGrants, fetchFavorites, fetchRecommendations]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    router.push("/");
  };

  const saveProfile = async () => {
    try {
      const updatedProfile = await apiCall("/users/profile", {
        method: "PUT",
        body: {
          profileType,
          categories,
          nickname,
          avatarColor,
          firstName,
          lastName,
        },
      });

      setUser(updatedProfile);
      // Keep localStorage in sync for legacy pages
      localStorage.setItem("currentUser", JSON.stringify(updatedProfile));
      setEditMode(false);
    } catch (err) {
      console.error("Помилка при збереженні профілю:", err);
    }
  };

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const addToFavorites = async (grantId: string) => {
    try {
      await apiCall(`/users/favorites/${grantId}`, { method: "POST" });
      await fetchFavorites();
    } catch (err) {
      console.error("Помилка при додаванні до обраного:", err);
    }
  };

  const removeFromFavorites = async (grantId: string) => {
    try {
      await apiCall(`/users/favorites/${grantId}`, { method: "DELETE" });
      await fetchFavorites();
    } catch (err) {
      console.error("Помилка при видаленні з обраного:", err);
    }
  };

  const isFavorite = (grantId: string) => {
    return favorites.some((f) => f.id === grantId);
  };

  const startEditGrant = (grant: any) => {
    setEditingGrantId(grant.id);
    setEditingGrant({ ...grant });
  };

  const saveEditGrant = async () => {
    if (editingGrant) {
      try {
        await apiCall(`/grants/${editingGrantId}`, {
          method: "PUT",
          body: {
            title: editingGrant.name,
            deadline: new Date(editingGrant.deadline),
            targetAudience: [editingGrant.age],
            sourceUrl: editingGrant.link,
            firstName: editingGrant.firstName,
            lastName: editingGrant.lastName,
          },
        });

        await fetchMyGrants(user.email);
        setEditingGrantId(null);
        setEditingGrant(null);
      } catch (err) {
        console.error("Помилка при збереженні гранту:", err);
      }
    }
  };

  const cancelEditGrant = () => {
    setEditingGrantId(null);
    setEditingGrant(null);
  };

  const deleteGrant = async (id: any) => {
    try {
      await apiCall(`/grants/${id}`, { method: "DELETE" });
      await fetchMyGrants(user.email);
    } catch (err) {
      console.error("Помилка видалення гранту:", err);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Завантаження...</div>;
  }

  if (!user) {
    return null;
  }

  const roleLabel =
    PROFILE_TYPES.find((p) => p.value === (user.profileType || profileType))?.label ||
    "Не вказано";

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
              <span className={`${styles.userName} ${styles.desktopOnly}`}>{user.email}</span>
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
            <aside className={styles.sidebar}>
              <div className={styles.profileCard}>
                <div className={`${styles.avatar} ${styles[`avatar-${avatarColor}`]}`}>
                  {(nickname || user.email.charAt(0)).charAt(0).toUpperCase()}
                </div>
                <h2>{nickname || user.email}</h2>
                {nickname && <p className={styles.emailText}>{user.email}</p>}
                <p className={styles.role}>{roleLabel}</p>
              </div>

              <nav className={styles.menu}>
                {[
                  { key: "dashboard", label: "Мій кабінет" },
                  { key: "my-grants", label: "Мої гранти" },
                  { key: "favorites", label: "Обрані" },
                  { key: "recommendations", label: "Рекомендації" },
                  { key: "settings", label: "Налаштування" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveView(key)}
                    className={`${styles.menuItem} ${activeView === key ? styles.active : ""}`}
                  >
                    {label}
                  </button>
                ))}
                <button onClick={() => router.push("/")} className={styles.menuItem}>
                  На головну
                </button>
              </nav>
            </aside>

            <section className={styles.content}>
              {/* === Мій кабінет === */}
              {activeView === "dashboard" && (
                <div className={styles.card}>
                  <h1>Ласкаво просимо, {nickname || user.email.split("@")[0]}!</h1>
                  <p>Ви успішно увійшли до свого кабінету. Тут ви можете переглядати гранти, що відповідають вашому профілю.</p>
                  <ul style={{ marginTop: 16, lineHeight: 2 }}>
                    <li><strong>Email:</strong> {user.email}</li>
                    <li><strong>Ім'я:</strong> {user.firstName} {user.lastName}</li>
                    <li><strong>Тип профілю:</strong> {roleLabel}</li>
                    <li><strong>Категорії:</strong> {(user.categories || []).join(", ") || "не вказано"}</li>
                    <li><strong>Обраних грантів:</strong> {favorites.length}</li>
                    <li><strong>Моїх грантів:</strong> {myGrants.length}</li>
                  </ul>
                </div>
              )}

              {/* === Мої гранти === */}
              {activeView === "my-grants" && (
                <div className={styles.card}>
                  <h1>Мої гранти</h1>
                  {myGrants.length === 0 ? (
                    <p>У вас немає доданих грантів. Перейдіть на головну сторінку, щоб додати перший грант.</p>
                  ) : (
                    <div className={styles.myGrantsList}>
                      {myGrants.map((grant) => (
                        <div key={grant.id} className={styles.myGrantCard}>
                          {editingGrantId === grant.id ? (
                            <div className={styles.editGrantForm}>
                              <div className={styles.formRow}>
                                <input
                                  type="text"
                                  placeholder="Назва гранту"
                                  value={editingGrant.name}
                                  onChange={(e) =>
                                    setEditingGrant({ ...editingGrant, name: e.target.value })
                                  }
                                  className={styles.input}
                                />
                                <input
                                  type="text"
                                  placeholder="Цільова аудиторія"
                                  value={editingGrant.age}
                                  onChange={(e) =>
                                    setEditingGrant({ ...editingGrant, age: e.target.value })
                                  }
                                  className={styles.input}
                                />
                              </div>
                              <input
                                type="url"
                                placeholder="Посилання"
                                value={editingGrant.link}
                                onChange={(e) =>
                                  setEditingGrant({ ...editingGrant, link: e.target.value })
                                }
                                className={styles.input}
                              />
                              <input
                                type="date"
                                value={editingGrant.deadline ? editingGrant.deadline.slice(0, 10) : ""}
                                onChange={(e) =>
                                  setEditingGrant({ ...editingGrant, deadline: e.target.value })
                                }
                                className={styles.input}
                              />
                              <div className={styles.buttonGroup}>
                                <button onClick={saveEditGrant} className="btn btn-primary">
                                  Зберегти
                                </button>
                                <button onClick={cancelEditGrant} className="btn btn-secondary">
                                  Скасувати
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className={styles.grantInfo}>
                                <h3>{grant.name}</h3>
                                <p><strong>Аудиторія:</strong> {grant.age}</p>
                                <p>
                                  <strong>До:</strong>{" "}
                                  {new Date(grant.deadline).toLocaleDateString("uk-UA")}
                                </p>
                                <a href={grant.link} target="_blank" rel="noopener noreferrer">
                                  Посилання →
                                </a>
                              </div>
                              <div className={styles.grantActions}>
                                <button
                                  onClick={() => startEditGrant(grant)}
                                  className={styles.editBtn}
                                >
                                  Редагувати
                                </button>
                                <button
                                  onClick={() => deleteGrant(grant.id)}
                                  className={styles.deleteBtn}
                                >
                                  Видалити
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* === Обрані === */}
              {activeView === "favorites" && (
                <div className={styles.card}>
                  <h1>Обрані гранти</h1>
                  {favorites.length === 0 ? (
                    <p>У вас немає обраних грантів. Додайте гранти у обране з головної сторінки.</p>
                  ) : (
                    <div className={styles.myGrantsList}>
                      {favorites.map((grant) => (
                        <div key={grant.id} className={styles.myGrantCard}>
                          <div className={styles.grantInfo}>
                            <h3>{grant.name}</h3>
                            <p><strong>Аудиторія:</strong> {grant.age}</p>
                            <p>
                              <strong>До:</strong>{" "}
                              {new Date(grant.deadline).toLocaleDateString("uk-UA")}
                            </p>
                            {grant.categories.length > 0 && (
                              <p><strong>Категорії:</strong> {grant.categories.join(", ")}</p>
                            )}
                            <a href={grant.link} target="_blank" rel="noopener noreferrer">
                              Посилання →
                            </a>
                          </div>
                          <div className={styles.grantActions}>
                            <button
                              onClick={() => removeFromFavorites(grant.id)}
                              className={styles.deleteBtn}
                            >
                              Видалити з обраного
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* === Рекомендації === */}
              {activeView === "recommendations" && (
                <div className={styles.card}>
                  <h1>Рекомендовані гранти</h1>
                  <p style={{ marginBottom: 16, color: "#666" }}>
                    Підібрані на основі вашого типу профілю та обраних категорій.
                  </p>
                  {recommendations.length === 0 ? (
                    <p>
                      Рекомендацій поки немає. Оновіть свій профіль (тип та категорії) у
                      Налаштуваннях, щоб система підібрала гранти.
                    </p>
                  ) : (
                    <div className={styles.myGrantsList}>
                      {recommendations.map((grant) => (
                        <div key={grant.id} className={styles.myGrantCard}>
                          <div className={styles.grantInfo}>
                            <h3>{grant.name}</h3>
                            <p><strong>Аудиторія:</strong> {grant.age}</p>
                            <p>
                              <strong>До:</strong>{" "}
                              {new Date(grant.deadline).toLocaleDateString("uk-UA")}
                            </p>
                            {grant.categories.length > 0 && (
                              <p><strong>Категорії:</strong> {grant.categories.join(", ")}</p>
                            )}
                            <a href={grant.link} target="_blank" rel="noopener noreferrer">
                              Посилання →
                            </a>
                          </div>
                          <div className={styles.grantActions}>
                            <button
                              onClick={() =>
                                isFavorite(grant.id)
                                  ? removeFromFavorites(grant.id)
                                  : addToFavorites(grant.id)
                              }
                              className={isFavorite(grant.id) ? styles.deleteBtn : "btn btn-primary"}
                            >
                              {isFavorite(grant.id) ? "Видалити з обраного" : "До обраного"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* === Налаштування === */}
              {activeView === "settings" && (
                <div className={styles.card}>
                  <h1>Налаштування профілю</h1>

                  {!editMode ? (
                    <div>
                      <div className={styles.settingsSection}>
                        <h3>Інформація профілю</h3>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Ім'я:</strong> {user.firstName} {user.lastName}</p>
                        <p><strong>Нік:</strong> {user.nickname || "не встановлено"}</p>
                        <p><strong>Тип профілю:</strong> {roleLabel}</p>
                        <p>
                          <strong>Категорії:</strong>{" "}
                          {(user.categories || []).join(", ") || "не вказано"}
                        </p>
                        <button
                          onClick={() => setEditMode(true)}
                          className="btn btn-primary"
                          style={{ marginTop: 16 }}
                        >
                          Редагувати профіль
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.settingsForm}>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor="firstName">Ім'я</label>
                          <input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Ім'я"
                            className={styles.input}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label htmlFor="lastName">Прізвище</label>
                          <input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Прізвище"
                            className={styles.input}
                          />
                        </div>
                      </div>

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
                        <label>Тип профілю</label>
                        <select
                          value={profileType}
                          onChange={(e) => setProfileType(e.target.value)}
                          className={styles.input}
                        >
                          <option value="">— Оберіть тип —</option>
                          {PROFILE_TYPES.map((p) => (
                            <option key={p.value} value={p.value}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label>Категорії грантів (для рекомендацій)</label>
                        <div className={styles.categoriesList}>
                          {ALL_CATEGORIES.map((cat) => (
                            <label key={cat} className={styles.categoryCheckbox}>
                              <input
                                type="checkbox"
                                checked={categories.includes(cat)}
                                onChange={() => toggleCategory(cat)}
                              />
                              {cat}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label>Колір аватара</label>
                        <div className={styles.colorPicker}>
                          {["primary", "secondary", "accent", "success", "warning"].map(
                            (color) => (
                              <button
                                key={color}
                                onClick={() => setAvatarColor(color)}
                                className={`${styles.colorOption} ${styles[`color-${color}`]} ${
                                  avatarColor === color ? styles.selected : ""
                                }`}
                                title={color}
                              >
                                {avatarColor === color && "✓"}
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      <div className={styles.buttonGroup}>
                        <button onClick={saveProfile} className="btn btn-primary">
                          Зберегти
                        </button>
                        <button
                          onClick={() => {
                            setEditMode(false);
                            setNickname(user.nickname || "");
                            setAvatarColor(user.avatarColor || "primary");
                            setFirstName(user.firstName || "");
                            setLastName(user.lastName || "");
                            setProfileType(user.profileType || "");
                            setCategories(user.categories || []);
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
