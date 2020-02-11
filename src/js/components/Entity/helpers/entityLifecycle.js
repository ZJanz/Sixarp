import uuid4 from 'uuid/v4';

export const createEntity = (props) => {
  return {
    id: uuid4(),
    render: (ctx) => {},
    ...props
  };
};

export const isEntity = (element) => {
  if (Object.isObject(element)) {
    if (element.id && element.render) {
      return true;
    } else {
      return false;
    }
  } else if (Array.isArray(element)) {
    for(let i = 0; i < element.length; i++) {
      if(!isEntity(element[i])) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
};

export const deltaEntities = (source, comparison) => {
  const sourceIds = source.map(element => element.id);
  const comparisonIds = comparison.map(element => element.id);

  const delta = [];
  comparisonIds.forEach(id => {
     if(!sourceIds.includes(id)) {
      delta.push(id);
     }
  });

  return delta.map(id => comparison.filter(element => element.id === id).pop());
};

export default {
  createEntity, isEntity, deltaEntities
};