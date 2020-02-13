import React from 'react';

const EntityContext = React.createContext({
  addEntities: () => { },
  entityList: [],
  removeEntities: () => { },
  render: () => { }
});

export default EntityContext;