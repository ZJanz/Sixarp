import React from 'react';

import ConfigProvider from '../ConfigProvider';
import EntityManager from '../Entity';
import Animator from '../Animator';
import Keyboard from '../Keyboard';
import Player from '../Player';

class App extends React.Component {
  render() {
    return (
      <div className="container">
        <ConfigProvider>
          <Keyboard>
            <EntityManager>
              <Player>
                <Animator />
              </Player>
            </EntityManager>
          </Keyboard>
        </ConfigProvider>
      </div>
    );
  }
};

export default App;