import { Dimensions, FlatList, View, Pressable, ActivityIndicator } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import React from 'react';

export default function FullScreenVideoList({ videoList }) {

    const { width, height } = Dimensions.get('window');

    const [loadedVideos, setLoadedVideos] = React.useState(videoList.slice(0, 2));
    const [currentPlayingIndex, setCurrentPlayingIndex] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const flatListRef = React.useRef(null);
    const playerRefs = React.useRef([]);
    const threshold = height / 2.5;

    React.useEffect(() => {
        if (currentPlayingIndex !== null) {
            const playCurrentVideo = async () => {
                try {
                    if (typeof playerRefs.current[currentPlayingIndex]?.playAsync === 'function') {
                        await playerRefs.current[currentPlayingIndex].playAsync();
                    }
                } catch (error) {
                    console.error('Error playing current video:', error);
                }
            };

            const pauseAndResetOtherVideos = async () => {
                playerRefs.current.forEach(async (player, index) => {
                    if (index !== currentPlayingIndex) {
                        try {
                            if (typeof player?.pauseAsync === 'function') {
                                await player.pauseAsync();
                            }
                            if (Math.abs(index - currentPlayingIndex) > 1) {
                                if (typeof player?.setPositionAsync === 'function') {
                                    await player.setPositionAsync(0);
                                }
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

    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const handleScroll = (event) => {
        event.persist(); // Persist the event

        const debouncedScroll = debounce((event) => {
            const offset = event.nativeEvent.contentOffset.y;
            const adjustedOffset = offset + threshold;
            const newIndex = adjustedOffset >= 0 ? Math.floor(adjustedOffset / height) : 0;

            if (currentPlayingIndex !== newIndex) {
                setCurrentPlayingIndex(newIndex);
            }
        }, 250); // Adjust debounce time (in ms) if needed

        debouncedScroll(event);
    };

    const loadMoreVideos = () => {
        if (loadedVideos.length < videoList.length) {
            setLoading(true);
            setTimeout(() => {
                const moreVideos = videoList.slice(loadedVideos.length, loadedVideos.length + 2);
                setLoadedVideos([...loadedVideos, ...moreVideos]);
                setLoading(false);
            }, 500); // Adjust the delay before loading more videos
        }
    };

    const renderItem = ({ item, index }) => {
        return (
            <Pressable style={{ width, height, justifyContent: 'center', alignItems: 'center', }} 
            onPressIn={async () => {
                try {
                    if (typeof playerRefs.current[index]?.pauseAsync === 'function') {
                        await playerRefs.current[index].pauseAsync();
                    }
                } catch (error) {
                    console.error('Error pausing video:', error);
                }
            }}
            onPressOut={async () => {
                if (index === currentPlayingIndex) {
                    try {
                        if (typeof playerRefs.current[index]?.playAsync === 'function') {
                            await playerRefs.current[index].playAsync();
                        }
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
        )
    };

    const footerItem = () => {
        if (loading) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 20, }}>
                    <ActivityIndicator size="small" color="lightgray" />
                </View>
            );
        } else {
            return null;
        }
    };

    return (
        <View style={{ width, height, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black', }}>
            <FlatList ref={flatListRef} data={loadedVideos} ListFooterComponent={footerItem} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} pagingEnabled initialNumToRender={1} maxToRenderPerBatch={2} updateCellsBatchingPeriod={2} onEndReachedThreshold={0.5} horizontal={false} showsVerticalScrollIndicator={false} snapToInterval={height} snapToAlignment="start" decelerationRate={0} onScroll={handleScroll} onEndReached={loadMoreVideos} />
        </View>
    )
}
