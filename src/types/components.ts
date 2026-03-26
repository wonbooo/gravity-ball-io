import type { GameState } from './game';

export interface GameCanvasRef {
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  useSkill: (skillName: string) => void;
  getGameState: () => GameState;
}
