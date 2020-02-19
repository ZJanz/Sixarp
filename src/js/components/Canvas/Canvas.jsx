import React, { useContext, useEffect, useState } from 'react';

import ConfigContext from '../../contexts/ConfigContext';

const Canvas = (props) => {

  const configContext = useContext(ConfigContext);
  
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(function updateDimensionsOnConfigChange() {
    if (configContext) {
      const {
        configurations: {
          canvas
        }
      } = configContext;

      setWidth(canvas.width);
      setHeight(canvas.height);
    }
  }, [configContext]);

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