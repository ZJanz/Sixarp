import React, { useState } from 'react';
import keycode from 'keycode';

import KeyboardContext from '../../contexts/KeyboardContext';

const Keyboard = (props) => {

  const {
    children
  } = props;

  const keybinds = ['w', 'a', 's', 'd', 'left', 'right', 'up', 'down'];

  const initialKeyState = keybinds.reduce((obj, key) => {
    obj[key] = false;
    return obj;
  }, {});

  const [keyState, setKeyState] = useState(initialKeyState);

  const appKeyDownEventHandler = ({ keyCode }) => {
    const keyValue = keycode(keyCode);
    if (keybinds.includes(keyValue)) {
      setKeyState({ ...keyState, [keyValue]: true });
    }
  };

  const appKeyUpEventHandler = ({ keyCode }) => {
    const keyValue = keycode(keyCode);
    if (keybinds.includes(keyValue)) {
      setKeyState({ ...keyState, [keyValue]: false });
    }
  };

  return (
    <div
      onKeyDown={appKeyDownEventHandler}
      onKeyUp={appKeyUpEventHandler}
      tabIndex="0"
    >
      <KeyboardContext.Provider value={keyState}>
        {children}
      </KeyboardContext.Provider>
    </div>
  );
};


export default Keyboard;