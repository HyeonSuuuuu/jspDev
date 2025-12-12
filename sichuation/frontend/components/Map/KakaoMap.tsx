'use client';
import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { Box } from '@mantine/core';
import { useMapStore } from '@/store/useMapStore';

declare global {
    interface Window {
        kakao: any;
    }
}

export function KakaoMap() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null); // Keep track of map instance
    const searchAddress = useMapStore((state) => state.searchAddress);

    // Effect to handle address search
    useEffect(() => {
        if (!mapInstance.current || !searchAddress || !window.kakao) return;

        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(searchAddress, function (result: any, status: any) {
            if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

                // Move map
                mapInstance.current.setCenter(coords);

                // Add marker
                const marker = new window.kakao.maps.Marker({
                    map: mapInstance.current,
                    position: coords
                });

                // Add InfoWindow
                const infowindow = new window.kakao.maps.InfoWindow({
                    content: `<div style="padding:5px;color:black;">${searchAddress}</div>`
                });
                infowindow.open(mapInstance.current, marker);
            }
        });
    }, [searchAddress]);

    const loadMap = () => {
        if (window.kakao && window.kakao.maps && mapContainer.current) {
            window.kakao.maps.load(() => {
                const options = {
                    center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
                    level: 3,
                };
                const map = new window.kakao.maps.Map(mapContainer.current, options);
                mapInstance.current = map; // Save instance

                // Initial Marker logic (optional, keeping for consistency)
                const markerPosition = new window.kakao.maps.LatLng(37.566826, 126.9786567);
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition
                });
                marker.setMap(map);

                const iwContent = '<div style="padding:5px;">카카오맵 테스트입니다!</div>';
                const iwRemoveable = true;

                const infowindow = new window.kakao.maps.InfoWindow({
                    content: iwContent,
                    removable: iwRemoveable
                });

                window.kakao.maps.event.addListener(marker, 'click', function () {
                    infowindow.open(map, marker);
                });
            });
        }
    };

    return (
        <Box w="100%" h="100%" pos="relative" bg="gray.1">
            <Script
                src="//dapi.kakao.com/v2/maps/sdk.js?appkey=a879ba7722002d45da1ece28d8c2aca7&autoload=false&libraries=services"
                strategy="afterInteractive"
                onLoad={loadMap}
            />
            <div id="kakao-map" ref={mapContainer} style={{ width: '100%', height: 'calc(100vh - 140px)' }}></div>
        </Box>
    );
}
