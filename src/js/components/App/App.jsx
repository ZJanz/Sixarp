import React from 'react';

import ConfigProvider from '../ConfigProvider';
import EntityManager from '../Entity';
import Animator from '../Animator';
import Keyboard from '../Keyboard';
import Player from '../Player';
import Canvas from '../Canvas';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {canvasContext: null}
  };

  render() {
    const {
      canvasContext
    } = this.state;

    return (
      <div className="container">
        <ConfigProvider>
          <Keyboard>
            <EntityManager>
              <Player>
                <Animator canvasContext={canvasContext} />
              </Player>
            </EntityManager>
            <Canvas ctxCallback={(ctx) => {
              if (canvasContext !== ctx) {
                this.setState({ canvasContext: ctx });
              }
            }} />
          </Keyboard>
        </ConfigProvider>
      </div>
    );
  }
};

export default App;