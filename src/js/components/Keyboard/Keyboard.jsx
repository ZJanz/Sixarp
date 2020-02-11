import React, { useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import KeyboardContext from '../../contexts/KeyboardContext';

const Keyboard = (props) => {

  const {
    children
  } = props;

  const keybinds = ['w', 'a', 's', 'd', 'left', 'right', 'up', 'down'];

  const initialKeyState = keybinds.reduce((obj, key) => {
    obj[key] = false;
    return obj;
  });

  const [keyState, setKeyState] = useState(initialKeyState);

  const appKeyDownEventHandler = (key, e) => {
    setKeyState({ ...keyState, [key]: true });
  };

  const appKeyUpEventHandler = (key, e) => {
    setKeyState({ ...keyState, [key]: false });
  };

  return (<KeyboardEventHandler
    handleKeys={keybinds}
    handleKeyEvent='keydown'
    onKeyEvent={appKeyDownEventHandler}
  >
    <KeyboardEventHandler
      handleKeys={keybinds}
      handleKeyEvent='keyup'
      onKeyEvent={appKeyUpEventHandler}
    >
      <KeyboardContext.Provider keyState={keyState}>
        {children}
      </KeyboardContext.Provider>
    </KeyboardEventHandler>
  </KeyboardEventHandler>);
};

export default Keyboard;