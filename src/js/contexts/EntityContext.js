import React from 'react';

export default React.createContext({
  addEntities: () => {},
  entityList: [],
  removeEntities: () => {},
  render: () => {}
});