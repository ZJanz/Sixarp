import React, { useState, useEffect } from 'react';
import EntityContext from '../../contexts/EntityContext';
import { createEntity, isEntity, deltaEntities } from './components/Entity';

const EntityManager = (props) => {

  const {
    configuration: { entity: entityConfig },
    entities,
    children
  } = props;

  const [entityList, updateEntityList] = useState([]);

  useEffect(function loadInitialEntities() {
    updateEntityList(
      entityConfig.initialEntities.map(
        template => createEntity(template)
      )
    );
  }, []);

  useEffect(function updateEntityListFromProps() {
    updateEntityList(entityList);
  }, [entities]);

  const addEntities = (newEntities) => {
    if(!isEntity(newEntities)) return;
    
    const additions = deltaEntities(entityList, newEntities);

    updateEntityList([...entities, ...additions]);
  };

  const removeEntities = (removeEntities) => {
    if(!isEntity(removeEntities)) return;

    const diffList = deltaEntities(removeEntities, entityList);

    updateEntityList(diffList);
  };

  const renderEntities = (ctx) => {
    entityList.forEach(({ render }) => render(ctx));
  };

  return (
    <EntityContext.Provider
      addEntities={addEntities}
      entityList={entityList}
      removeEntities={removeEntities}
      render={renderEntities}
    >
      {children}
    </EntityContext.Provider>
  )
};

export default EntityManager;