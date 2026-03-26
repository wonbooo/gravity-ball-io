import React from 'react';

interface GameOverProps {
  score: number;
  kills: number;
  survivalTime: number;
  onRestart: () => void;
  onMenu: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({
  score,
  kills,
  survivalTime,
  onRestart,
  onMenu,
}) => {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="bg-gradient-to-b from-[#1a1a2e] to-[#0a0a1a] border-2 border-neon-pink rounded-2xl p-8 max-w-md w-full neon-border">
        <h1 className="text-5xl font-bold text-center text-neon-pink mb-8 neon-text">
          游戏结束
        </h1>

        {/* 统计信息 */}
        <div className="space-y-4 mb-8">
          <div className="bg-black/30 rounded-lg p-4 border border-neon-blue/30">
            <div className="text-sm text-gray-400 mb-1">最终分数</div>
            <div className="text-3xl font-bold text-neon-blue">
              {score.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/30 rounded-lg p-4 border border-neon-purple/30">
              <div className="text-sm text-gray-400 mb-1">击杀数</div>
              <div className="text-2xl font-bold text-neon-purple">
                {kills}
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-4 border border-neon-green/30">
              <div className="text-sm text-gray-400 mb-1">生存时间</div>
              <div className="text-2xl font-bold text-neon-green">
                {formatTime(survivalTime)}
              </div>
            </div>
          </div>
        </div>

        {/* 按钮 */}
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full px-6 py-3 text-lg font-semibold text-white bg-neon-blue/20 border-2 border-neon-blue rounded-lg hover:bg-neon-blue/30 transition-all duration-200 hover:scale-105"
          >
            再玩一次
          </button>

          <button
            onClick={onMenu}
            className="w-full px-6 py-3 text-lg font-semibold text-gray-300 bg-gray-800/50 border-2 border-gray-600 rounded-lg hover:bg-gray-800/70 transition-all duration-200"
          >
            返回主菜单
          </button>
        </div>
      </div>
    </div>
  );
};
