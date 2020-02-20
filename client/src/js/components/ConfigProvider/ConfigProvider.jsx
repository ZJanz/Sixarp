import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import applyValueToPath from '../../helpers/applyValueToPath';
import ConfigContext from '../../contexts/ConfigContext';
import BaseConfigurations from '../../config';

const ConfigProvider = (props) => {
  const {
    children
  } = props;

  const providerRef = useRef(null);

  const [configurations, setConfigurations] = useState(BaseConfigurations);

  const updateConfigByPath = (path, value) => {
    setConfigurations(applyValueToPath({ ...configurations }, path, value));
    providerRef.current = { ...providerRef.current, configurations };
  };

  useEffect(() => {
    providerRef.current = { ...providerRef.current, configurations };
  }, [configurations]);

  useEffect(() => {
    providerRef.current = { configurations, updateConfig: updateConfigByPath };
  }, []);

  return (
    <ConfigContext.Provider value={providerRef.current}>
      {children}
    </ConfigContext.Provider>
  )
};

ConfigContext.propTypes = {
  children: PropTypes.elementType
}

export default ConfigProvider;