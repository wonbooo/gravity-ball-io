import type { ScoreRecord } from '../types/game';

const STORAGE_KEY = 'gravity-ball-scores';
const MAX_SCORES = 10;

export class Leaderboard {
  static save(record: ScoreRecord): void {
    const scores = this.getAll();
    scores.push(record);
    scores.sort((a, b) => b.score - a.score);

    // 只保留前10名
    const topScores = scores.slice(0, MAX_SCORES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(topScores));
  }

  static getAll(): ScoreRecord[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  static getTopScores(limit: number = 10): ScoreRecord[] {
    return this.getAll().slice(0, limit);
  }

  static getHighScore(): number {
    const scores = this.getAll();
    return scores.length > 0 ? scores[0].score : 0;
  }

  static clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
