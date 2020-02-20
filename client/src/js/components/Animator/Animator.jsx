import React, { useEffect, useState, useContext, useRef } from 'react';

import KeyboardContext from '../../contexts/KeyboardContext';
import PlayerContext from '../../contexts/PlayerContext';
import EntityContext from '../../contexts/EntityContext';

const Animator = (props) => {
  const {
    canvasContext
  } = props;

  const keyboardContext = useContext(KeyboardContext);

  const playerContext = useContext(PlayerContext);

  const entityContext = useContext(EntityContext);

  const [ctx, setCanvasContext] = useState(canvasContext);

  const animationFrame = useRef(null);

  const doAnimation = () => {
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

    playerContext.updatePositionFromKeyState(keyboardContext);
    playerContext.render(ctx);
    entityContext.render(ctx);

    animationFrame.current = requestAnimationFrame(doAnimation);
  };

  useEffect(function updateCtxOnPropChange() {
    if(canvasContext) {
      setCanvasContext(canvasContext);
    }
  }, [canvasContext]);

  useEffect(function updateAnimationFrameOnStateChange() {
    if(!ctx) return;
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    animationFrame.current = requestAnimationFrame(doAnimation);
  }, [ctx, keyboardContext, playerContext, entityContext]);

  useEffect(function cancelFrameOnUnmount() {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return <div></div>;
};

export default Animator
