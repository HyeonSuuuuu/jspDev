import { Text, Group } from '@mantine/core';

export function InfoFooter() {
    return (
        <Group justify="space-between" h="100%" px="md">
            <Text size="sm" fw={500}>Team Sichuation</Text>
            <Text size="sm" c="dimmed">Tech University of Korea</Text>
        </Group>
    );
}
