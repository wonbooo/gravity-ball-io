import { useRef, useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import type { GameCanvasRef } from './types/components';
import { Menu } from './components/Menu';
import { HUD } from './components/HUD';
import { GameOver } from './components/GameOver';
import type { GameStatus, GameState } from './types/game';
import type { GameEngine } from './core/GameEngine';

function App() {
  const gameCanvasRef = useRef<GameCanvasRef>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);

  const [gameStatus, setGameStatus] = useState<GameStatus>('menu');
  const [gameState, setGameState] = useState<GameState>({
    status: 'menu',
    score: 0,
    kills: 0,
    survivalTime: 0,
    playerMass: 50,
    leaderboard: [],
  });
  const [playerMass, setPlayerMass] = useState(50);

  const handleStartGame = () => {
    gameCanvasRef.current?.startGame();
  };

  const handleRestart = () => {
    gameCanvasRef.current?.startGame();
  };

  const handleMenu = () => {
    setGameStatus('menu');
  };

  const handleStateUpdate = (state: GameState) => {
    setGameState(state);
    setGameStatus(state.status);

    // 使用实际的玩家质量
    if (state.status === 'playing') {
      setPlayerMass(state.playerMass);
    }
  };

  const handleEngineReady = (engine: GameEngine) => {
    gameEngineRef.current = engine;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a1a]">
      {/* 游戏Canvas - 放在底层，占满整个屏幕 */}
      <GameCanvas
        ref={gameCanvasRef}
        onStateUpdate={handleStateUpdate}
        onReady={handleEngineReady}
      />

      {/* 菜单 - 在上层 */}
      {gameStatus === 'menu' && <Menu onStart={handleStartGame} />}

      {/* HUD */}
      {gameStatus === 'playing' && (
        <HUD
          score={gameState.score}
          kills={gameState.kills}
          survivalTime={gameState.survivalTime}
          mass={playerMass}
        />
      )}

      {/* 游戏结束 */}
      {gameStatus === 'gameover' && (
        <GameOver
          score={gameState.score}
          kills={gameState.kills}
          survivalTime={gameState.survivalTime}
          onRestart={handleRestart}
          onMenu={handleMenu}
        />
      )}
    </div>
  );
}

export default App;
