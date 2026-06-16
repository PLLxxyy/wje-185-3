import React from 'react';

interface ControlsHintProps {
  cruiseMode: boolean;
}

const ControlsHint: React.FC<ControlsHintProps> = ({ cruiseMode }) => {
  if (cruiseMode) {
    return (
      <div className="controls-hint">
        <span>巡航模式</span> - 自动沿预设路线游览 | 点击画面可切换回手动控制
      </div>
    );
  }

  return (
    <div className="controls-hint">
      <span>WASD / 方向键</span> 移动 | <span>Space</span> 上浮 |{' '}
      <span>Shift</span> 下潜 | <span>鼠标</span> 视角 | 靠近生物查看详情 | 点击物体查看介绍
    </div>
  );
};

export default ControlsHint;
