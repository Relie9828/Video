import React from 'react';
import { SafeAreaView } from 'react-native';
import FullScreenVideoList from './FullScreenVideoList';

const App = () => {
  
  const videoList = [
    {
      uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    },
    {
      uri: 'https://v.pinimg.com/videos/mc/720p/f6/88/88/f68888290d70aca3cbd4ad9cd3aa732f.mp4',
    },
    {
      uri: 'https://v.pinimg.com/videos/mc/720p/11/05/2c/11052c35282355459147eabe31cf3c75.mp4',
    },
    {
      uri: 'https://v.pinimg.com/videos/mc/720p/c9/22/d8/c922d8391146cc2fdbeb367e8da0d61f.mp4',
    },
  ];

  return (
    <FullScreenVideoList videoList={videoList} />
  );
};

export default App;
