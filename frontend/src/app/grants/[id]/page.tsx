"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import HomeFooter from "@/components/HomeFooter";
import { apiCall } from "@/lib/api";

interface GrantDetail {
  _id: string;
  title: string;
  description: string;
  organizer: string;
  deadline: string;
  amount: string;
  categories: string[];
  targetAudience: string[];
  sourceUrl: string;
  viewsCount: number;
  firstName?: string;
  lastName?: string;
  authorEmail?: string;
}

export default function GrantDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [grant, setGrant] = useState<GrantDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrant = async () => {
      try {
        const data = await apiCall(`/grants/${id}`);
        setGrant(data);
      } catch (err: any) {
        console.error("Помилка завантаження гранту:", err);
        setError(err.message || "Не вдалося завантажити деталі гранту");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGrant();
    }
  }, [id]);

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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className="container">
          <Link href="/" className={styles.backBtn}>
            ← Повернутися до списку грантів
          </Link>

          {loading ? (
            <div className={styles.loaderContainer}>
              <div className={styles.spinner}></div>
              <p>Завантаження деталей гранту...</p>
            </div>
          ) : error ? (
            <div className={styles.errorState}>
              <p>{error}</p>
            </div>
          ) : grant ? (
            <div className={styles.detailsCard}>
              <h1 className={styles.title}>{grant.title}</h1>
              
              <div className={styles.meta}>
                {grant.categories?.map((cat, idx) => (
                  <span key={idx} className={styles.badge}>#{cat}</span>
                ))}
                {grant.targetAudience?.map((aud, idx) => (
                  <span key={idx} className={styles.badge}>👨‍👩‍👧 {aud}</span>
                ))}
              </div>

              <div className={styles.section}>
                <h3>Про грант</h3>
                <div className={styles.description}>
                  <p>{grant.description || "Опис відсутній."}</p>
                </div>
              </div>

              <div className={styles.section}>
                <h3>Деталі</h3>
                <p><strong>Організатор:</strong> {grant.organizer || "Не вказано"}</p>
                <p><strong>Дедлайн:</strong> {grant.deadline ? new Date(grant.deadline).toLocaleDateString("uk-UA") : "Не вказано"}</p>
                <p><strong>Сума:</strong> {grant.amount || "За запитом"}</p>
                <p><strong>Переглядів:</strong> {grant.viewsCount || 0}</p>
                {(grant.firstName || grant.lastName) && (
                  <p><strong>Автор публікації:</strong> {grant.firstName} {grant.lastName}</p>
                )}
              </div>

              <div className={styles.footer}>
                {grant.sourceUrl && (
                  <a
                    href={grant.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn btn-primary ${styles.sourceLink}`}
                  >
                    Перейти до джерела ↗
                  </a>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
