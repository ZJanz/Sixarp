import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import PlayerContext from '../../contexts/PlayerContext';

const Player = (props) => {
  const {
    acceleration = 2,
    children,
    color = "#FF0000",
    position: positionProps,
  } = props;

  const [position, setPosition] = useState(positionProps || { x: 20, y: 40 });

  const updatePositionFromKeyState = (keyState) => {  
    const newPosition = { ...position };

    const { w, up, left, a, down, s, right, d } = keyState;

    if (w || up) {
      newPosition.y += acceleration;
    }
    if (a || left) {
      newPosition.x -= acceleration;
    }
    if (s || down) {
      newPosition.y -= acceleration;
    }
    if (d || right) {
      newPosition.x += acceleration;
    }

    setPosition(newPosition);
  };

  useEffect(function updatePositionFromProps() {
    setPosition(position);
  }, [positionProps]);

  const render = (ctx) => {
    ctx.beginPath();
    ctx.rect(newPosition.x, newPosition.y, 50, 50);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  };

  return (
    <PlayerContext.Provider 
      color={color}
      render={render}
      updatePositionFromKeyState={updatePositionFromKeyState}>
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