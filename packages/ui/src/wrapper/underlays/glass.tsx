import React from 'react';
import { alpha } from '@mantine/core';
import { WrapperUnderlayBlur } from './blur';
import classes from './glass.module.css';

export function WrapperUnderlayGlass({
  props,
  children,
}: {
  props?: {
    opacity?: number;
    blur?: number;
    saturate?: number;
    image?: string;
    noiseImage?: string;
  };
  children: React.ReactNode;
}) {
  return (
    <div
      style={
        !props?.image
          ? undefined
          : {
              backgroundImage: `url(${props.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
            }
      }
    >
      <div
        style={
          !props?.opacity
            ? undefined
            : {
                backgroundColor: alpha('var(--mantine-color-body)', props.opacity),
              }
        }
      >
        <WrapperUnderlayBlur props={{ ...props }}>
          <div
            className={classes.noise}
            style={
              !props?.noiseImage || !props.blur
                ? undefined
                : {
                    backgroundImage: `url(${props.noiseImage})`,
                    backgroundAttachment: 'fixed',
                  }
            }
          >
            {children}
          </div>
        </WrapperUnderlayBlur>
      </div>
    </div>
  );
}
