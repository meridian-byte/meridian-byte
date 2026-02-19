import { useState } from 'react';

export function useContextMenu(params?: { menuWidth?: number }) {
  const [opened, setOpened] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setCoords({ x: e.clientX, y: e.clientY });
    setOpened(true);
  };

  const close = () => setOpened(false);

  const menuWidth = params?.menuWidth || 220;

  return {
    opened,
    setOpened,
    close,
    menuWidth,
    targetProps: {
      onContextMenu: handleContextMenu,
      style: { cursor: 'context-menu' },
    },
    anchor: (
      <div
        style={{
          position: 'fixed',
          top: coords?.y,
          left: coords?.x,
          width: menuWidth,
          height: 0,
        }}
      />
    ),
  };
}
