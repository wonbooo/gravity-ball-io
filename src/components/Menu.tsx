import React from 'react';

interface MenuProps {
  onStart: () => void;
}

export const Menu: React.FC<MenuProps> = ({ onStart }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
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
      {/* 背景动画 */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] to-black" />
        <div className="stars">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* 菜单内容 */}
      <div
        className="relative z-10 px-4"
        style={{ textAlign: 'center' }}
      >
        {/* 标题 */}
        <h1 className="text-7xl font-bold mb-4 neon-text text-neon-blue animate-pulse-glow">
          重力球 IO
        </h1>
        <p className="text-xl text-gray-400 mb-12">Gravity Ball IO</p>

        {/* 开始按钮 */}
        <div className="space-y-4 w-full max-w-md mx-auto">
          <button
            onClick={() => onStart()}
            className="w-full px-12 py-6 text-2xl font-bold text-white bg-neon-blue/30 border-3 border-neon-blue rounded-xl hover:bg-neon-blue/50 transition-all duration-300 hover:scale-105 neon-shadow"
            style={{
              boxShadow: '0 0 20px rgba(0, 243, 255, 0.3), 0 0 40px rgba(0, 243, 255, 0.1)',
            }}
          >
            开始游戏
            <span className="block text-sm font-normal text-neon-blue/70 mt-2">
              点击开始，吞噬小球，避开大球！
            </span>
          </button>
        </div>

        {/* 操作说明 */}
        <div className="mt-12 text-left bg-black/30 p-6 rounded-lg border border-neon-blue/30">
          <h2 className="text-xl font-semibold text-neon-blue mb-4">操作说明</h2>
          <div className="space-y-2 text-gray-300">
            <p>🖱️ <span className="text-white font-semibold">移动：</span> 鼠标移动控制方向</p>
            <p>🎯 <span className="text-white font-semibold">目标：</span> 吞噬小球变大，避开大球</p>
            <p>⚡ <span className="text-white font-semibold">技能Q：</span> 加速冲刺（消耗10%质量）</p>
            <p>🌊 <span className="text-white font-semibold">技能W：</span> 分裂身体（消耗50%质量）</p>
            <p>💫 <span className="text-white font-semibold">技能E：</span> 引力波减速（消耗20%质量）</p>
          </div>
        </div>
        </div>

      <style>{`
        .stars {
          position: absolute;
          inset: 0;
        }
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: twinkle 3s infinite;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
