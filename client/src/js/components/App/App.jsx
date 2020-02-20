import React from 'react';

import ConfigProvider from '../ConfigProvider';
import EntityManager from '../Entity';
import Animator from '../Animator';
import Keyboard from '../Keyboard';
import Player from '../Player';
import Canvas from '../Canvas';

import './App.scss';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {canvasContext: null}
  };

  render() {
    const {
      canvasContext
    } = this.state;

    const containerClassName = 'root-container';

    return (
      <div className={containerClassName}>
        <ConfigProvider>
          <Keyboard>
            <EntityManager>
              <Player>
                <Animator canvasContext={canvasContext} />
              </Player>
            </EntityManager>
            <Canvas 
              containerClassName={containerClassName}
              ctxCallback={(ctx) => {
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