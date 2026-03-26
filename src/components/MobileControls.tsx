import React from 'react';

interface MobileControlsProps {
  onSkillUse: (skill: string) => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ onSkillUse }) => {
  return (
    <div
      className="fixed bottom-4 left-0 right-0 z-50"
      style={{ display: 'block' }}
    >
      <style>{`
        @media (min-width: 768px) {
          .mobile-controls-container {
            display: none !important;
          }
        }
      `}</style>
      <div className="mobile-controls-container flex justify-center gap-4 px-4">
        <button
          onClick={() => onSkillUse('sprint')}
          className="flex-1 max-w-[100px] aspect-square rounded-full bg-neon-blue/20 border-2 border-neon-blue text-white font-bold text-lg active:scale-95 transition-all neon-border"
        >
          冲刺
          <span className="block text-xs font-normal text-gray-400">Q</span>
        </button>

        <button
          onClick={() => onSkillUse('split')}
          className="flex-1 max-w-[100px] aspect-square rounded-full bg-neon-purple/20 border-2 border-neon-purple text-white font-bold text-lg active:scale-95 transition-all neon-border"
        >
          分裂
          <span className="block text-xs font-normal text-gray-400">W</span>
        </button>

        <button
          onClick={() => onSkillUse('gravityWave')}
          className="flex-1 max-w-[100px] aspect-square rounded-full bg-neon-pink/20 border-2 border-neon-pink text-white font-bold text-lg active:scale-95 transition-all neon-border"
        >
          引力
          <span className="block text-xs font-normal text-gray-400">E</span>
        </button>
      </div>

      <div className="text-center mt-2 text-xs text-gray-500">
        点击屏幕移动 • 使用按钮释放技能
      </div>
    </div>
  );
};
