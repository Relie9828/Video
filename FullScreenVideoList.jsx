import { Dimensions, FlatList, View, Pressable } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import React from 'react';

export default function FullScreenVideoList({ videoList }) {

    const { width, height } = Dimensions.get('window');

    const [currentPlayingIndex, setCurrentPlayingIndex] = React.useState(0);
    const flatListRef = React.useRef(null);
    const playerRefs = React.useRef([]);
    const threshold = height / 2.5;

    React.useEffect(() => {
        if (currentPlayingIndex !== null) {
            const playCurrentVideo = async () => {
                try {
                    await playerRefs.current[currentPlayingIndex]?.playAsync();
                } catch (error) {
                    console.error('Error playing current video:', error);
                }
            };

            const pauseAndResetOtherVideos = async () => {
                playerRefs.current.forEach(async (player, index) => {
                    if (index !== currentPlayingIndex) {
                        try {
                            await player?.pauseAsync();
                            if (Math.abs(index - currentPlayingIndex) > 1) { // Check if the video is not adjacent to the currentPlayingIndex
                                await player?.setPositionAsync(0); // Seek the video to the beginning
                            }
                        } catch (error) {
                            console.error('Error pausing and resetting other videos:', error);
                        }
                    }
                });
            };

            playCurrentVideo();
            pauseAndResetOtherVideos();
        }
    }, [currentPlayingIndex]);

    const handleScroll = (event) => {
        const offset = event.nativeEvent.contentOffset.y;
        const adjustedOffset = offset + threshold;
        const newIndex = adjustedOffset >= 0 ? Math.floor(adjustedOffset / height) : 0;

        if (currentPlayingIndex !== newIndex) {
            setCurrentPlayingIndex(newIndex);
        }
    };

    const renderItem = ({ item, index }) => (
        <Pressable style={{ width, height, justifyContent: 'center', alignItems: 'center', }} 
        onPressIn={async () => {
            try {
                await playerRefs.current[index]?.pauseAsync();
            } catch (error) {
                console.error('Error pausing video:', error);
            }
        }}
        onPressOut={async () => {
            if (index === currentPlayingIndex) {
                try {
                    await playerRefs.current[index]?.playAsync();
                } catch (error) {
                    console.error('Error playing video:', error);
                }
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

    return (
        <View style={{ width, height, alignItems: 'center', justifyContent: 'center', }}>
            <FlatList ref={flatListRef} data={videoList} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} pagingEnabled horizontal={false} showsVerticalScrollIndicator={false} snapToInterval={height} snapToAlignment="start" decelerationRate={0} 
            onScroll={handleScroll} />
        </View>
    )
}
