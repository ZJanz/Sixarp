import React from 'react';

import Animator from '../Animator';
import Entity from '../Entity';
import Keyboard from '../Keyboard';
import Player from '../Player';

const App = () => {

  return (
    <div className="container">
      <ConfigProvider>
        <Keyboard>
          <Entities>
            <Player>
              <Animator />
            </Player>
          </Entities>
        </Keyboard>
      </ConfigProvider>
    </div>
  );
};

export default App;