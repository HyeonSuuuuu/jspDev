'use client';
import { Stack, Text, UnstyledButton, Paper, ScrollArea } from '@mantine/core';
import { useMapStore } from '@/store/useMapStore';

export function PlaceList() {
  const setSearchAddress = useMapStore((state) => state.setSearchAddress);
  const places = useMapStore((state) => state.places);
  const triggerZoom = useMapStore((state) => state.triggerZoom);
  const setSelectedPlace = useMapStore((state) => state.setSelectedPlace);

  return (
    <Stack gap="sm" h="100%">
      <Text fw={700} size="lg" mb="xs">추천 장소</Text>
      <ScrollArea style={{ flex: 1 }} type="always" offsetScrollbars>
        <Stack gap="sm">
          {places.length === 0 && (
            <Text c="dimmed" size="sm" ta="center" mt="xl">
              챗봇에게 여행 장소를<br />추천받아보세요!
            </Text>
          )}
          {places.map((item, index) => (
            <UnstyledButton
              key={index}
              onClick={() => setSelectedPlace(item)}
              onDoubleClick={() => {
                setSelectedPlace(item);
                triggerZoom();
              }}
            >
              <Paper p="sm" withBorder shadow="xs" style={{ cursor: 'pointer', transition: '0.2s' }} >
                <Text fw={600}>{item.name}</Text>
                <Text size="xs" c="dimmed" lineClamp={1}>{item.address}</Text>
                <Text size="sm" mt={4}>{item.description}</Text>
              </Paper>
            </UnstyledButton>
          ))}
        </Stack>
      </ScrollArea>
    </Stack>
  );
}
