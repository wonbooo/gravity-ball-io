import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { GameEngine } from '../core/GameEngine';
import type { GameCanvasRef } from '../types/components';
import type { GameState } from '../types/game';

interface GameCanvasProps {
  onStateUpdate?: (state: GameState) => void;
  onReady?: (engine: GameEngine) => void;
}

export const GameCanvas = forwardRef<GameCanvasRef, GameCanvasProps>(
  ({ onStateUpdate, onReady }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameEngineRef = useRef<GameEngine | null>(null);
    const inputTargetRef = useRef({ x: 0, y: 0 });

    // 使用ref存储回调，避免依赖变化
    const onStateUpdateRef = useRef(onStateUpdate);
    const onReadyRef = useRef(onReady);

    useEffect(() => {
      onStateUpdateRef.current = onStateUpdate;
      onReadyRef.current = onReady;
    }, [onStateUpdate, onReady]);

    useEffect(() => {
      if (!canvasRef.current) return;

      // 初始化游戏引擎
      const engine = new GameEngine(canvasRef.current);
      gameEngineRef.current = engine;

      // 设置状态更新回调
      engine.onStateUpdate((state) => {
        if (onStateUpdateRef.current) {
          onStateUpdateRef.current(state);
        }
      });

      // 通知父组件引擎已就绪
      if (onReadyRef.current) {
        onReadyRef.current(engine);
      }

      // 监听窗口大小变化
      const handleResize = () => {
        engine.resize();
      };
      window.addEventListener('resize', handleResize);

      // 清理
      return () => {
        window.removeEventListener('resize', handleResize);
        engine.destroy();
      };
    }, []); // 空依赖数组，只在挂载时运行一次

    // 处理鼠标移动
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        inputTargetRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
        if (gameEngineRef.current) {
          gameEngineRef.current.inputTarget = inputTargetRef.current;
        }
      };

      canvas.addEventListener('mousemove', handleMouseMove);
      return () => canvas.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // 处理键盘输入
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!gameEngineRef.current) return;

        switch (e.key.toLowerCase()) {
          case 'q':
            gameEngineRef.current.useSkill('sprint');
            break;
          case 'w':
            gameEngineRef.current.useSkill('split');
            break;
          case 'e':
            gameEngineRef.current.useSkill('gravityWave');
            break;
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      startGame: () => {
        gameEngineRef.current?.start();
      },
      pauseGame: () => {
        gameEngineRef.current?.pause();
      },
      resumeGame: () => {
        gameEngineRef.current?.resume();
      },
      useSkill: (skillName: string) => {
        gameEngineRef.current?.useSkill(skillName);
      },
      getGameState: () => {
        if (!gameEngineRef.current) {
          return {
            status: 'menu',
            score: 0,
            kills: 0,
            survivalTime: 0,
            playerMass: 50,
            leaderboard: [],
          };
        }
        return gameEngineRef.current.gameState;
      },
    }));

    return (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ touchAction: 'none', display: 'block' }}
      />
    );
  }
);

GameCanvas.displayName = 'GameCanvas';
