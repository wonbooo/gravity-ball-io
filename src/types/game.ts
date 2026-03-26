// 游戏基础类型定义

export type GameStatus = 'menu' | 'playing' | 'paused' | 'gameover';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type SkillType = 'sprint' | 'split' | 'gravityWave';
export type AIState = 'idle' | 'chasing' | 'fleeing';

export interface Vector2D {
  x: number;
  y: number;
}

export interface BallConfig {
  id: string;
  x: number;
  y: number;
  mass: number;
  color: string;
  isPlayer: boolean;
}

export interface Ball extends BallConfig {
  vx: number;
  vy: number;
  radius: number;
  skills: {
    sprint: SkillState;
    split: SkillState;
    gravityWave: SkillState;
  };
  state?: AIState;
  target?: Vector2D;
}

export interface SkillState {
  cooldown: number;
  lastUsed: number;
  cost: number;
  active: boolean;
}

export interface Food {
  id: string;
  x: number;
  y: number;
  value: number;
  color: string;
  pulsePhase: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface GravityWave {
  ownerId: string;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  strength: number;
}

export interface GameState {
  status: GameStatus;
  score: number;
  kills: number;
  survivalTime: number;
  playerMass: number; // 添加玩家实际质量
  leaderboard: ScoreRecord[];
}

export interface ScoreRecord {
  score: number;
  survivalTime: number;
  kills: number;
  date: string;
  difficulty: Difficulty;
}

export interface GameConfig {
  width: number;
  height: number;
  worldWidth: number;
  worldHeight: number;
}

export const SKILL_CONFIG = {
  sprint: {
    cooldown: 5000,
    cost: 0.1,
    duration: 1000,
    speedMultiplier: 2,
  },
  split: {
    cooldown: 10000,
    cost: 0.5,
    splitCount: 2,
    mergeTime: 15000,
  },
  gravityWave: {
    cooldown: 8000,
    cost: 0.2,
    radius: 200,
    duration: 2000,
    slowFactor: 0.5,
  },
};

export const NEON_COLORS = [
  '#00f3ff', // neon blue
  '#bc13fe', // neon purple
  '#ff006e', // neon pink
  '#00ff9f', // neon green
  '#fffa00', // neon yellow
];
