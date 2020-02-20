import React, { useContext, useEffect, useState } from 'react';
import debounce from 'debounce';

import ConfigContext from '../../contexts/ConfigContext';

import './Canvas.scss';

const Canvas = (props) => {

  const {
    containerClassName
  } = props;

  const configContext = useContext(ConfigContext);
  
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);


  const getContainerSize = () => {
    const {
      width,
      height
    } = document.getElementsByClassName(containerClassName)[0]
      .getBoundingClientRect();

    return {
      height: Math.floor(height),
      width: Math.floor(width)
    }
  }

  useEffect(function updateDimensionsOnConfigChange() {
    if (configContext) {
      const containerDimensions = getContainerSize();

      setWidth(containerDimensions.width);
      setHeight(containerDimensions.height);
    }
  }, [configContext]);

  useEffect(function updateDimensionsOnWindowResize() {
    const handleResize = debounce(() => {
      const container = getContainerSize();

      setWidth(container.width);
      setHeight(container.height);
    });

    window.addEventListener('resize', handleResize);

    return _ => window.removeEventListener('resize', handleResize);
  });

  const {
    ctxCallback
  } = props;

  return (
    <canvas
      className={'game-canvas'}
      height={height}
      ref={node => node ? ctxCallback(node.getContext('2d')) : null}
      width={width}
    />
  );
};

export default React.memo(Canvas);