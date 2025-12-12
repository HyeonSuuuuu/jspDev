'use client';
import { Stack, Title, TextInput, ScrollArea, Paper, Text } from '@mantine/core';

export function ChatbotSidebar() {
    return (
        <Stack h="100%" justify="space-between">
            <Stack gap="md" style={{ flex: 1, overflow: 'hidden' }}>
                <Title order={4} contentEditable={false}>Situation Bot</Title>
                <ScrollArea style={{ flex: 1 }}>
                    <Stack gap="xs">
                        <Paper p="sm" withBorder bg="var(--mantine-color-gray-0)">
                            <Text size="sm">Welcome! I can help you find locations or understand the current situation.</Text>
                        </Paper>
                    </Stack>
                </ScrollArea>
            </Stack>
            <TextInput placeholder="Type a message..." />
        </Stack>
    );
}
