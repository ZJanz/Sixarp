import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';

import KeyboardContext from '../../contexts/KeyboardContext';
import PlayerContext from '../../contexts/PlayerContext';
import EntityContext from '../../contexts/EntityContext';

const Animator = () => {
  const {
    keyState
  } = useContext(KeyboardContext);

  const {
    render: renderPlayer,
    updatePositionFromKeyState
  } = useContext(PlayerContext);

  const {
    render: renderEntities
  } = useContext(EntityContext);

  const [animationFrame, setAnimationFrame] = useState(null);
  const [canvasContext, setCanvasContext] = useState(null);

  const doAnimation = () => {
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

    updatePositionFromKeyState(keyState);
    renderPlayer(ctx);
    renderEntities(ctx);

    setAnimationFrame(requestAnimationFrame(doAnimation));
  };

  useEffect(() => {
    setAnimationFrame(requestAnimationFrame(doAnimation));
  }, [canvasContext]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationFrame);
    }
  }, []);
  
  return (<Canvas ctxCallback={setCanvasContext} />);
};

Animator.propTypes = {
  canvasRef: PropTypes.ref.isRequired
};

export default Animator
