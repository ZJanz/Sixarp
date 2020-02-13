import React, { useContext, useEffect, useState } from 'react';

import ConfigContext from '../../contexts/ConfigContext';

const Canvas = (props) => {

  const configuration = useContext(ConfigContext);
  
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(function updateDimensionsOnConfigChange() {
    if (configuration && configuration.canvas) {
      setWidth(configuration.canvas.width);
      setHeight(configuration.canvas.height);
    }
  }, [configuration]);

  const {
    ctxCallback
  } = props;

  return (
    <canvas
      height={height}
      ref={node => node ? ctxCallback(node.getContext('2d')) : null}
      width={width}
    />
  );
};

export default React.memo(Canvas);