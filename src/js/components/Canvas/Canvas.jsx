import React from 'react';

import ConfigContext from '../../contexts/ConfigContext';

const Canvas = (props) => {

  const configuration = useContext(ConfigContext);

  const {
    ctxCallback
  } = props;

  return (
    <canvas
      height={configuration.canvas.height}
      ref={node => node ? ctxCallback(node.getContext('2d')) : null}
      width={configuration.canvas.width}
    />
  );
};

export default React.memo(Canvas);