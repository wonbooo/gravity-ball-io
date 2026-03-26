import React from 'react';

interface MobileControlsProps {
  onSkillUse: (skill: string) => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ onSkillUse }) => {
  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          .mobile-controls-wrapper {
            display: none !important;
          }
        }
      `}</style>
      <div className="mobile-controls-wrapper fixed bottom-4 left-0 right-0 z-50 px-4">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => onSkillUse('sprint')}
            className="w-20 h-20 rounded-full bg-neon-blue/30 border-3 border-neon-blue text-white font-bold text-lg active:scale-95 transition-all"
            style={{
              boxShadow: '0 0 15px rgba(0, 243, 255, 0.5)',
              minWidth: '80px',
              minHeight: '80px'
            }}
          >
            冲刺
            <span className="block text-xs font-normal text-neon-blue/70 mt-1">Q</span>
          </button>

          <button
            onClick={() => onSkillUse('split')}
            className="w-20 h-20 rounded-full bg-neon-purple/30 border-3 border-neon-purple text-white font-bold text-lg active:scale-95 transition-all"
            style={{
              boxShadow: '0 0 15px rgba(188, 19, 254, 0.5)',
              minWidth: '80px',
              minHeight: '80px'
            }}
          >
            分裂
            <span className="block text-xs font-normal text-neon-purple/70 mt-1">W</span>
          </button>

          <button
            onClick={() => onSkillUse('gravityWave')}
            className="w-20 h-20 rounded-full bg-neon-pink/30 border-3 border-neon-pink text-white font-bold text-lg active:scale-95 transition-all"
            style={{
              boxShadow: '0 0 15px rgba(255, 0, 110, 0.5)',
              minWidth: '80px',
              minHeight: '80px'
            }}
          >
            引力
            <span className="block text-xs font-normal text-neon-pink/70 mt-1">E</span>
          </button>
        </div>

        <div className="text-center mt-3 text-xs text-gray-500">
          点击屏幕移动 • 使用按钮释放技能
        </div>
      </div>
    </>
  );
};
