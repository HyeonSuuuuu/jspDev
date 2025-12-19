'use client';
import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { Box } from '@mantine/core';
import { useMapStore } from '@/store/useMapStore';
import Image from 'next/image';

declare global {
    interface Window {
        kakao: any;
    }
}

export function KakaoMap() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null); // Keep track of map instance
    const selectedPlace = useMapStore((state) => state.selectedPlace);
    const zoomTrigger = useMapStore((state) => state.zoomTrigger);

    // Effect to handle zoom trigger
    useEffect(() => {
        if (mapInstance.current) {
            mapInstance.current.setLevel(1);
        }
    }, [zoomTrigger]);

    // Effect to handle place search
    useEffect(() => {
        if (!mapInstance.current || !selectedPlace || !window.kakao) return;

        console.log("Searching for:", selectedPlace);

        const geocoder = new window.kakao.maps.services.Geocoder();
        const ps = new window.kakao.maps.services.Places();

        const displayMarker = (coords: any, content: string) => {
            // Move map
            mapInstance.current.setCenter(coords);

            // Add marker
            const marker = new window.kakao.maps.Marker({
                map: mapInstance.current,
                position: coords
            });

            // Add InfoWindow
            const infowindow = new window.kakao.maps.InfoWindow({
                content: `<div style="padding:5px;color:black;">${content}</div>`
            });
            infowindow.open(mapInstance.current, marker);
        };

        // Utility to clean address (remove parens like (정왕동))
        const cleanString = (str: string) => {
            return str.replace(/\(.*\)/g, '').replace(/\[.*\]/g, '').trim();
        };

        const cleanAddr = cleanString(selectedPlace.address);

        // 1. Try Keyword Search (Place Name + "시흥")
        ps.keywordSearch(`${selectedPlace.name} 시흥`, function (data: any, status: any) {
            if (status === window.kakao.maps.services.Status.OK) {
                console.log("1. Keyword search (Name+Siheung) success");
                const coords = new window.kakao.maps.LatLng(data[0].y, data[0].x);
                displayMarker(coords, data[0].place_name);
            } else {
                console.log("1. Failed. Trying Name Only...");
                // 2. Fallback to Keyword Search (Name only) - in case "Siheung" keyword filtering is too strict or map name implies it
                ps.keywordSearch(selectedPlace.name, function (data: any, status: any) {
                    if (status === window.kakao.maps.services.Status.OK) {
                        console.log("2. Keyword search (Name only) success");
                        // Sort by distance if possible? For now, pick first.
                        const coords = new window.kakao.maps.LatLng(data[0].y, data[0].x);
                        displayMarker(coords, data[0].place_name);
                    } else {
                        console.log("2. Failed. Trying Keyword Search (Clean Address)...");
                        // 3. Fallback to Keyword Search (Clean Address) - Finds building/area
                        ps.keywordSearch(cleanAddr, function (data: any, status: any) {
                            if (status === window.kakao.maps.services.Status.OK) {
                                console.log("3. Keyword search (Addr) success");
                                const coords = new window.kakao.maps.LatLng(data[0].y, data[0].x);
                                displayMarker(coords, data[0].place_name);
                            } else {
                                console.log("3. Failed. Trying Address Search (Clean Address)...");
                                // 4. Fallback to Geocoding (Clean Address) - High tolerance
                                geocoder.addressSearch(cleanAddr, function (result: any, status: any) {
                                    if (status === window.kakao.maps.services.Status.OK) {
                                        console.log("4. Geocoding success");
                                        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                                        displayMarker(coords, selectedPlace.address);
                                    } else {
                                        console.warn("All search methods failed for:", selectedPlace);
                                        alert(`'${selectedPlace.name}'의 위치를 찾을 수 없습니다.\n주소: ${selectedPlace.address}`);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }, [selectedPlace]);

    const loadMap = () => {
        if (window.kakao && window.kakao.maps && mapContainer.current) {
            window.kakao.maps.load(() => {
                const options = {
                    center: new window.kakao.maps.LatLng(37.3805, 126.8031), // Siheung City Hall
                    level: 7,
                };
                const map = new window.kakao.maps.Map(mapContainer.current, options);
                mapInstance.current = map; // Save instance
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

            {/* Floating Logo */}
            <Box
                pos="absolute"
                top={20}
                left={20}
                style={{ zIndex: 10, pointerEvents: 'none' }} // pointerEvents: none allows clicking through to map if needed, but usually logo is clickable. Let's keep it simple.
            >
                <Image
                    src="/team_logo.png"
                    alt="Team Logo"
                    width={120}
                    height={120}
                    style={{ objectFit: 'contain', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' }}
                />
            </Box>
        </Box>
    );
}
