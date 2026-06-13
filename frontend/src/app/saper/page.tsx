"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./saper.module.css";
import HomeFooter from "../../components/HomeFooter";

type CellType = {
  r: number;
  c: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

type Difficulty = "easy" | "medium" | "hard";

const CONFIG = {
  easy: { rows: 8, cols: 8, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};

export default function SaperPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [grid, setGrid] = useState<CellType[][]>([]);
  const [gameState, setGameState] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [minesLeft, setMinesLeft] = useState(CONFIG.easy.mines);
  const [timer, setTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [mobileMode, setMobileMode] = useState<"dig" | "flag">("dig"); // for mobile touch convenience

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Audio Context on user interaction
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  // Play Sound Effects synthetically using Web Audio API
  const playSound = (type: "click" | "flag" | "win" | "explode") => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;

    if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "flag") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.setValueAtTime(500, now + 0.05);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === "win") {
      const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.1, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0, now + idx * 0.1 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.15);
      });
    } else if (type === "explode") {
      // Create noise buffer for explosion sound
      const bufferSize = ctx.sampleRate * 0.5; // 0.5 seconds
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(10, now + 0.4);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.5);
    }
  };

  // Generate board
  const createEmptyBoard = (rCount: number, cCount: number) => {
    const board: CellType[][] = [];
    for (let r = 0; r < rCount; r++) {
      const row: CellType[] = [];
      for (let c = 0; c < cCount; c++) {
        row.push({
          r,
          c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        });
      }
      board.push(row);
    }
    return board;
  };

  const initGame = () => {
    const { rows, cols, mines } = CONFIG[difficulty];
    const newBoard = createEmptyBoard(rows, cols);
    setGrid(newBoard);
    setGameState("idle");
    setMinesLeft(mines);
    setTimer(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Plant mines on first click to guarantee safe first tap
  const plantMines = (firstRow: number, firstCol: number, currentBoard: CellType[][]) => {
    const { rows, cols, mines } = CONFIG[difficulty];
    let minesPlanted = 0;

    while (minesPlanted < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);

      // Do not plant on the first click cell or its neighbors
      const isTooClose = Math.abs(r - firstRow) <= 1 && Math.abs(c - firstCol) <= 1;

      if (!currentBoard[r][c].isMine && !isTooClose) {
        currentBoard[r][c].isMine = true;
        minesPlanted++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!currentBoard[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                if (currentBoard[nr][nc].isMine) count++;
              }
            }
          }
          currentBoard[r][c].neighborMines = count;
        }
      }
    }
  };

  // Run timer when game starts
  useEffect(() => {
    if (gameState === "playing") {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Restart when difficulty changes
  useEffect(() => {
    initGame();
  }, [difficulty]);

  // Handle cell clicks
  const revealCell = (r: number, c: number) => {
    if (gameState === "lost" || gameState === "won") return;

    let tempBoard = JSON.parse(JSON.stringify(grid)) as CellType[][];
    let currentGameState = gameState;

    // First click behavior
    if (currentGameState === "idle") {
      plantMines(r, c, tempBoard);
      currentGameState = "playing";
      setGameState("playing");
      initAudio();
    }

    if (tempBoard[r][c].isRevealed || tempBoard[r][c].isFlagged) return;

    playSound("click");

    // Clicked mine
    if (tempBoard[r][c].isMine) {
      tempBoard[r][c].isRevealed = true;
      tempBoard[r][c].isMine = true;
      // Reveal all mines
      const { rows, cols } = CONFIG[difficulty];
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (tempBoard[i][j].isMine) {
            tempBoard[i][j].isRevealed = true;
          }
        }
      }
      // Highlight the exact mine that exploded
      tempBoard[r][c].neighborMines = -9; // custom marker for exploded mine

      setGrid(tempBoard);
      setGameState("lost");
      playSound("explode");
      return;
    }

    // Recursive reveal for empty fields
    const floodFill = (row: number, col: number) => {
      const queue: [number, number][] = [[row, col]];
      tempBoard[row][col].isRevealed = true;

      const { rows, cols } = CONFIG[difficulty];

      while (queue.length > 0) {
        const [currR, currC] = queue.shift()!;

        if (tempBoard[currR][currC].neighborMines === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = currR + dr;
              const nc = currC + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                const target = tempBoard[nr][nc];
                if (!target.isRevealed && !target.isMine && !target.isFlagged) {
                  target.isRevealed = true;
                  queue.push([nr, nc]);
                }
              }
            }
          }
        }
      }
    };

    floodFill(r, c);

    // Check Win condition
    const { rows, cols, mines } = CONFIG[difficulty];
    let unrevealedCount = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!tempBoard[i][j].isRevealed) {
          unrevealedCount++;
        }
      }
    }

    if (unrevealedCount === mines) {
      // Win!
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (tempBoard[i][j].isMine) {
            tempBoard[i][j].isFlagged = true;
          }
        }
      }
      setMinesLeft(0);
      setGrid(tempBoard);
      setGameState("won");
      playSound("win");
    } else {
      setGrid(tempBoard);
    }
  };

  // Flag action
  const toggleFlag = (e: React.MouseEvent | null, r: number, c: number) => {
    if (e) e.preventDefault();
    if (gameState === "lost" || gameState === "won" || gameState === "idle") return;

    if (grid[r][c].isRevealed) return;

    const tempBoard = [...grid];
    const isFlagged = !tempBoard[r][c].isFlagged;
    tempBoard[r][c].isFlagged = isFlagged;

    playSound("flag");
    setMinesLeft((prev) => prev + (isFlagged ? -1 : 1));
    setGrid(tempBoard);
  };

  // Left click switch behavior for mobile Mode
  const handleCellClick = (r: number, c: number) => {
    if (mobileMode === "flag") {
      toggleFlag(null, r, c);
    } else {
      revealCell(r, c);
    }
  };

  // Emoji Face react
  const getFaceEmoji = () => {
    if (gameState === "won") return "😎";
    if (gameState === "lost") return "😵";
    return "🙂";
  };

  return (
    <div className={styles.wrapper}>
      {/* Header */}
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

      {/* Main Game Screen */}
      <main className={styles.main}>
        <div className="container" style={{ display: "flex", justifyContent: "center" }}>
          <div className={styles.gameContainer}>
            <div className={styles.titleSection}>
              <h1>💣 Сапер (Minesweeper)</h1>
              <p>Знайди всі приховані міни, використовуючи числа на відкритих клітинках.</p>
            </div>

            {/* Game difficulty control toolbar */}
            <div className={styles.controls}>
              {(["easy", "medium", "hard"] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`${styles.difficultyBtn} ${difficulty === level ? styles.active : ""}`}
                >
                  {level === "easy" && "Легко (8x8)"}
                  {level === "medium" && "Середній (16x16)"}
                  {level === "hard" && "Важко (16x30)"}
                </button>
              ))}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={styles.soundToggle}
                title={isMuted ? "Увімкнути звук" : "Вимкнути звук"}
              >
                {isMuted ? "🔇" : "🔊"}
              </button>
            </div>

            {/* Mobile tap mode switcher */}
            <div className={styles.controls} style={{ marginTop: -8 }}>
              <button
                onClick={() => setMobileMode("dig")}
                className={`${styles.difficultyBtn} ${mobileMode === "dig" ? styles.active : ""}`}
                style={{ padding: "8px 14px", fontSize: "0.85rem" }}
              >
                ⛏️ Копати
              </button>
              <button
                onClick={() => setMobileMode("flag")}
                className={`${styles.difficultyBtn} ${mobileMode === "flag" ? styles.active : ""}`}
                style={{ padding: "8px 14px", fontSize: "0.85rem" }}
              >
                🚩 Прапорець
              </button>
            </div>

            {/* Game Board */}
            <div className={styles.boardFrame}>
              <div className={styles.statusBar}>
                <div className={styles.stat}>
                  <span>💣</span>
                  <span>{String(minesLeft).padStart(3, "0")}</span>
                </div>
                <button className={styles.faceBtn} onClick={initGame} title="Почати заново">
                  {getFaceEmoji()}
                </button>
                <div className={styles.stat}>
                  <span>⏱️</span>
                  <span>{String(timer).padStart(3, "0")}</span>
                </div>
              </div>

              <div className={styles.gridWrapper}>
                <div
                  className={styles.grid}
                  style={{
                    gridTemplateColumns: `repeat(${CONFIG[difficulty].cols}, 1fr)`,
                  }}
                >
                  {grid.map((row, rIdx) =>
                    row.map((cell, cIdx) => {
                      let cellClass = styles.cell;
                      let content = "";

                      if (cell.isRevealed) {
                        cellClass += ` ${styles.revealed}`;
                        if (cell.isMine) {
                          if (cell.neighborMines === -9) {
                            cellClass += ` ${styles.mineExploded}`;
                          } else {
                            cellClass += ` ${styles.mine}`;
                          }
                          content = "💣";
                        } else if (cell.neighborMines > 0) {
                          cellClass += ` ${styles[`num${cell.neighborMines}`]}`;
                          content = String(cell.neighborMines);
                        }
                      } else if (cell.isFlagged) {
                        cellClass += ` ${styles.flagged}`;
                        content = "🚩";
                      }

                      return (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          className={cellClass}
                          onClick={() => handleCellClick(cell.r, cell.c)}
                          onContextMenu={(e) => toggleFlag(e, cell.r, cell.c)}
                        >
                          {content}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Game Over Message Overlay */}
            {gameState === "won" && (
              <div className={`${styles.overlay} ${styles.won}`}>
                <h2>🎉 Вітаємо, переможцю!</h2>
                <p>Ти розгадав усе поле за {timer} секунд!</p>
                <button onClick={initGame}>Зіграти ще раз</button>
              </div>
            )}

            {gameState === "lost" && (
              <div className={`${styles.overlay} ${styles.lost}`}>
                <h2>💥 Бум! Гра закінчена!</h2>
                <p>Не хвилюйся, кожен сапер колись помиляється.</p>
                <button onClick={initGame}>Спробувати знову</button>
              </div>
            )}

            {/* Quick rules instructions */}
            <div className={styles.rulesSection}>
              <h3>ℹ️ Як грати:</h3>
              <ul>
                <li>Натисни на клітинку, щоб відкрити її. Перший хід завжди безпечний!</li>
                <li>Цифра показує, скільки мін приховано на 8 сусідніх клітинках.</li>
                <li>Правий клік (або режим 🚩 на мобільному) ставить прапорець на міну.</li>
                <li>Клікай на смайлик 🙂 зверху, щоб перезапустити гру в будь-який момент.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
