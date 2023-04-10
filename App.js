import React from 'react';
import { SafeAreaView } from 'react-native';
import FullScreenVideoList from './FullScreenVideoList';

const App = () => {
  
  const videoList = [
    {
      uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    },
    {
      uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    },
    {
      uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    },
  ];

  return (
    <FullScreenVideoList videoList={videoList} />
  );
};

export default App;
