import React from 'react';

export default React.createContext({
  color: '',
  position: { x: 20, y: 40 },
  acceleration: 2,
  updatePositionFromKeyState: () => {}
});