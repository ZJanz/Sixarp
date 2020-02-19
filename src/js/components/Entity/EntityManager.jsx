import React, { useState, useEffect, useContext, useRef } from 'react';
import EntityContext from '../../contexts/EntityContext';
import ConfigContext from '../../contexts/ConfigContext';
import { createEntity, isEntity, deltaEntities } from './helpers/entityLifecycle';

const EntityManager = (props) => {

  const {
    entities,
    children
  } = props;

  const [entityList, updateEntityList] = useState([]);

  const configurations = useContext(ConfigContext);

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

  const providerRef = useRef(null);

  useEffect(function updateEntityListFromProps() {
    updateEntityList(entityList);
  }, [entities]);

  useEffect(function updateProviderRef() {
    providerRef.current =  {
      ...providerRef.current,
      entityList
    };
  }, [entityList]);

  useEffect(function loadInitialEntities() {
    if (configurations && configurations.entities) {
      updateEntityList(
        entityConfig.initialEntities.map(
          template => createEntity(template)
        )
      );
    }
    providerRef.current = {
      addEntities, removeEntities, render: renderEntities, entityList
    };
  }, []);

  return (
    <EntityContext.Provider
      value={providerRef.current}
    >
      {children}
    </EntityContext.Provider>
  )
};

export default EntityManager;