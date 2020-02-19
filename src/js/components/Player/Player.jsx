import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import PlayerContext from '../../contexts/PlayerContext';

const Player = (props) => {
  const {
    acceleration = 10,
    children,
    color = "#FF0000",
    position: positionProps,
  } = props;

  const positionRef = useRef(null);

  const updatePositionFromKeyState = (keyState) => {  
    const position = positionRef.current;
    const newPosition = { ...position };

    const { w, up, left, a, down, s, right, d } = keyState;

    if (w || up) {
      newPosition.y -= acceleration;
    }
    if (a || left) {
      newPosition.x -= acceleration;
    }
    if (s || down) {
      newPosition.y += acceleration;
    }
    if (d || right) {
      newPosition.x += acceleration;
    }

    if (position.x !== newPosition.x || position.y !== newPosition.y) {
      positionRef.current = newPosition;
    }
  };

  useEffect(function updatePositionFromProps() {
    positionRef.current = positionProps;
  }, [positionProps]);

  const render = (ctx) => {
    const position = positionRef.current;

    ctx.beginPath();
    ctx.rect(position.x, position.y, 50, 50);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  };

  const providerRef = useRef({
    color, render, updatePositionFromKeyState
  });

  useEffect(function setPositionRefOnMount() {
    positionRef.current = positionProps || { x: 20, y: 40 }
  }, []);

  useEffect(function updateProviderRefOnStateChange() {
    providerRef.current = { ...providerRef.current, position: positionRef.current };
  }, [positionRef]);

  return (
    <PlayerContext.Provider value={providerRef.current}>
      {children}
    </PlayerContext.Provider>
  );
};

Player.propTypes = {
  color: PropTypes.string,
  position: PropTypes.objectOf({
    x: PropTypes.number,
    y: PropTypes.number
  }),
  children: PropTypes.element
};

export default Player;