import React, { useEffect, useState, useContext, useRef } from 'react';

import KeyboardContext from '../../contexts/KeyboardContext';
import PlayerContext from '../../contexts/PlayerContext';
import EntityContext from '../../contexts/EntityContext';

import Canvas from '../Canvas';

const Animator = () => {
  const keyboardContext = useContext(KeyboardContext);

  const playerContext = useContext(PlayerContext);

  const entityContext = useContext(EntityContext);

  const animationFrame = useRef(null);
  const canvasContext = useRef(null);

  const doAnimation = () => {
    const ctx = canvasContext.current;

    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

    playerContext.updatePositionFromKeyState(keyboardContext.keyState);
    playerContext.renderPlayer(ctx);
    entityContext.renderEntities(ctx);

    animationFrame.current = requestAnimationFrame(doAnimation);
  };

  useEffect(() => {
    animationFrame.current = requestAnimationFrame(doAnimation);
  }, [canvasContext]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationFrame.current);
    }
  }, []);
  
  console.log(keyboardContext, playerContext, entityContext);

  return (<Canvas ctxCallback={(ctx) => { canvasContext.current = ctx }} />);
};

export default Animator
