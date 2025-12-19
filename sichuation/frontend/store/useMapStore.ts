import { create } from 'zustand';

export interface Place {
    name: string;
    address: string;
    description: string;
}

interface MapState {
    searchAddress: string | null;
    places: Place[];
    zoomTrigger: number;
    selectedPlace: Place | null;
    setSearchAddress: (address: string) => void;
    setPlaces: (places: Place[]) => void;
    triggerZoom: () => void;
    setSelectedPlace: (place: Place | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
    searchAddress: null,
    places: [],
    zoomTrigger: 0,
    selectedPlace: null,
    setSearchAddress: (address) => set({ searchAddress: address }),
    setPlaces: (places) => set({ places }),
    triggerZoom: () => set((state) => ({ zoomTrigger: state.zoomTrigger + 1 })),
    setSelectedPlace: (place) => set({ selectedPlace: place }),
}));
