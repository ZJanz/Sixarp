import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import applyValueToPath from '../../helpers/applyValueToPath';
import ConfigContext from '../../contexts/ConfigContext';
import BaseConfigurations from '../..';

const ConfigProvider = (props) => {
  const {
    children
  } = props;

  const [configurations, setConfigurations] = useState(BaseConfigurations);

  const updateConfigByPath = (path, value) => {
    setConfigurations(applyValueToPath({ ...configurations }, path, value));
  };

  return (
    <ConfigContext.Provider configurations={configurations} updateConfig={updateConfigByPath}>
      {children}
    </ConfigContext.Provider>
  )
};

ConfigContext.propTypes = {
  children: PropTypes.elementType
}

export default ConfigProvider;