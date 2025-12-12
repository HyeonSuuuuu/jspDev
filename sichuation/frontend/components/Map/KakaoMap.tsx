'use client';
import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { Box, Text } from '@mantine/core';

declare global {
    interface Window {
        kakao: any;
    }
}

export function KakaoMap() {
    const mapContainer = useRef<HTMLDivElement>(null);

    const loadMap = () => {
        if (window.kakao && window.kakao.maps && mapContainer.current) {
            window.kakao.maps.load(() => {
                const options = {
                    center: new window.kakao.maps.LatLng(37.4005, 126.9248), // Anyang University Coordinates approx
                    level: 3,
                };
                const map = new window.kakao.maps.Map(mapContainer.current, options);

                // Example Marker
                const markerPosition = new window.kakao.maps.LatLng(37.4005, 126.9248);
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition
                });
                marker.setMap(map);
            });
        }
    };

    return (
        <Box w="100%" h="100%" pos="relative" bg="gray.1">
            <Script
                src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY&autoload=false"
                strategy="afterInteractive"
                onLoad={loadMap}
                onError={(e) => console.error("Kakao SDK failed to load", e)}
            />
            <div id="kakao-map" ref={mapContainer} style={{ width: '100%', height: '100%' }}>
                {/* Fallback visual if map doesn't load immediately or key is missing */}
                <Box
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 0,
                        textAlign: 'center',
                        color: 'gray'
                    }}
                >
                    <Text>Map Area</Text>
                    <Text size="xs">(Requires Kakao Map API Key)</Text>
                </Box>
            </div>
        </Box>
    );
}
