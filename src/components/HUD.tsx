import React from 'react';

interface HUDProps {
  score: number;
  kills: number;
  survivalTime: number;
  mass: number;
}

export const HUD: React.FC<HUDProps> = ({ score, kills, survivalTime, mass }) => {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* 顶部HUD */}
      <div className="fixed top-0 left-0 right-0 p-6 pointer-events-none z-40">
        <div className="flex justify-between items-center max-w-6xl mx-auto gap-4">
          {/* 左侧：玩家信息卡片 */}
          <div className="flex-1 flex gap-3">
            {/* 质量卡片 */}
            <div className="flex-1 bg-gradient-to-br from-neon-blue/10 to-neon-blue/5 backdrop-blur-md border-2 border-neon-blue/60 rounded-xl p-4 shadow-lg shadow-neon-blue/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-neon-blue/70 font-semibold mb-1 tracking-wider">质量</div>
                  <div className="text-3xl font-bold text-white neon-text" style={{ textShadow: '0 0 10px #00f3ff, 0 0 20px #00f3ff' }}>
                    {Math.floor(mass)}
                  </div>
                </div>
                <div className="text-4xl">🔮</div>
              </div>
            </div>

            {/* 分数卡片 */}
            <div className="flex-1 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 backdrop-blur-md border-2 border-yellow-400/60 rounded-xl p-4 shadow-lg shadow-yellow-400/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-yellow-400/70 font-semibold mb-1 tracking-wider">分数</div>
                  <div className="text-3xl font-bold text-white neon-text" style={{ textShadow: '0 0 10px #fbbf24, 0 0 20px #fbbf24' }}>
                    {score.toLocaleString()}
                  </div>
                </div>
                <div className="text-4xl">⭐</div>
              </div>
            </div>

            {/* 击杀卡片 */}
            <div className="flex-1 bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-md border-2 border-red-400/60 rounded-xl p-4 shadow-lg shadow-red-400/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-red-400/70 font-semibold mb-1 tracking-wider">击杀</div>
                  <div className="text-3xl font-bold text-white neon-text" style={{ textShadow: '0 0 10px #f87171, 0 0 20px #f87171' }}>
                    {kills}
                  </div>
                </div>
                <div className="text-4xl">⚔️</div>
              </div>
            </div>
          </div>

          {/* 右侧：生存时间 */}
          <div className="bg-gradient-to-br from-neon-purple/10 to-neon-purple/5 backdrop-blur-md border-2 border-neon-purple/60 rounded-xl p-4 shadow-lg shadow-neon-purple/20 min-w-[140px]">
            <div className="text-center">
              <div className="text-xs text-neon-purple/70 font-semibold mb-2 tracking-wider">生存时间</div>
              <div className="text-4xl font-bold text-white neon-text" style={{ textShadow: '0 0 15px #bc13fe, 0 0 30px #bc13fe' }}>
                {formatTime(survivalTime)}
              </div>
              <div className="text-2xl mt-1">⏱️</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
