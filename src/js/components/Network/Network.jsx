import React, { useState, useRef, useEffect, useContext } from 'react';

const Network = (props) => {
  const {
    children
  } = props;

  return children;
};

export default React.memo(Network);