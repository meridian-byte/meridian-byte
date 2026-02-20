import React from 'react';

export default function Blur({
  props,
  children,
}: {
  props?: {
    blur?: number;
    saturate?: number;
  };
  children: React.ReactNode;
}) {
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          backdropFilter: `blur(${props?.blur == 0 ? 0 : props?.blur || 64}px) saturate(${props?.blur == 0 && !props.saturate ? 100 : props?.saturate || 200}%)`,
          WebkitBackdropFilter: `blur(${props?.blur == 0 ? 0 : props?.blur || 64}px) saturate(${props?.blur == 0 && !props.saturate ? 100 : props?.saturate || 200}%)`,
        }}
      ></div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}
