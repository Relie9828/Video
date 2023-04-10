import { Dimensions, FlatList, View, Pressable } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import React from 'react';

export default function FullScreenVideoList({ videoList }) {

    const { width, height } = Dimensions.get('window');

    const [currentPlayingIndex, setCurrentPlayingIndex] = React.useState(0);
    const playerRefs = React.useRef([]);
    const flatListRef = React.useRef(null);

    const renderItem = ({ item, index }) => (
        <Pressable style={{ width, height, justifyContent: 'center', alignItems: 'center', }} onPressIn={() => playerRefs.current[index]?.pauseAsync()}
        onPressOut={() => {
            if (index === currentPlayingIndex) {
            playerRefs.current[index]?.playAsync();
            }
        }}>
        <Video ref={(ref) => (playerRefs.current[index] = ref)} source={{ uri: item.uri }} rate={1.0} volume={1.0} isMuted={false} isLooping resizeMode={ResizeMode.COVER} 
        onPlaybackStatusUpdate={(status) => {
            if (status.isPlaying && currentPlayingIndex !== index) {
                setCurrentPlayingIndex(index);
            }
        }} style={{ width: width, height: height, backgroundColor: 'black', }} />
        </Pressable>
    );

    React.useEffect(() => {
        if (currentPlayingIndex !== null) {
        playerRefs.current[currentPlayingIndex]?.playAsync();
        playerRefs.current.forEach((player, index) => {
            if (index !== currentPlayingIndex) {
            player?.pauseAsync().then(() => {
                player?.setPositionAsync(0); // Seek the video to the beginning
            });
            }
        });
        }
    }, [currentPlayingIndex]);

  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center', }}>
      <FlatList ref={flatListRef} data={videoList} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} pagingEnabled horizontal={false} showsVerticalScrollIndicator={false} snapToInterval={height} snapToAlignment="start" decelerationRate="fast" 
      onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.y / height);
          if (currentPlayingIndex !== newIndex) {
            setCurrentPlayingIndex(newIndex);
          }
        }} />
    </View>
  );
}
