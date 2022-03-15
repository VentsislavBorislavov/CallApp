import React from 'react';
import {StatusBar} from 'react-native';
import AppNavigation from './src/appNavigation';

const App = () => {
  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <AppNavigation />
    </>
  );
};

export default App;
