'use client';
import { Stack, Title, TextInput, ScrollArea, Paper, Text, ActionIcon, Loader, Badge, Group, Code } from '@mantine/core';
import { IconSend, IconRobot, IconUser } from '@tabler/icons-react';
import { useState, useRef } from 'react';
import { useMapStore } from '@/store/useMapStore';

interface Message {
    id: number;
    text: string;
    isUser: boolean;
    addresses?: string[];
}

export function ChatbotSidebar() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: '안녕하세요! 시흥시/안양시 맛집, 카페 등을 추천해 드립니다.', isUser: false }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollViewport = useRef<HTMLDivElement>(null);
    const setSearchAddress = useMapStore((state) => state.setSearchAddress);

    const scrollToBottom = () => {
        setTimeout(() => {
            scrollViewport.current?.scrollTo({ top: scrollViewport.current.scrollHeight, behavior: 'smooth' });
        }, 100);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, isUser: true };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        scrollToBottom();

        try {
            // Call Spring Boot Backend
            // Assuming backend is running on port 8080. If configured via proxy, use '/api/gemini/chat'
            const response = await fetch('http://localhost:8080/api/gemini/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage.text })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            // data format matches GeminiResponse(String message, List<String> addresses)
            const botMessage = {
                id: Date.now() + 1,
                text: data.message, // Field name from Java record
                isUser: false,
                addresses: data.addresses
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage = { id: Date.now() + 1, text: '오류가 발생했습니다. 백엔드 서버가 실행 중인지 확인해주세요.', isUser: false };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
            scrollToBottom();
        }
    };

    return (
        <Stack h="100%" gap="xs">
            <Title order={4} mb="xs">🤖 AI 추천 봇</Title>

            <Paper withBorder flex={1} radius="md" bg="gray.0" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <ScrollArea type="always" viewportRef={scrollViewport} style={{ flex: 1 }} p="sm">
                    <Stack gap="sm">
                        {messages.map((msg) => (
                            <Group key={msg.id} align="flex-start" justify={msg.isUser ? 'flex-end' : 'flex-start'} gap="xs">
                                {!msg.isUser && <IconRobot size={24} />}
                                <Stack gap={4} maw="80%">
                                    <Paper
                                        p="xs"
                                        radius="lg"
                                        bg={msg.isUser ? 'blue.6' : 'white'}
                                        c={msg.isUser ? 'white' : 'black'}
                                        shadow="xs"
                                    >
                                        <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</Text>
                                    </Paper>

                                    {/* Render extracted addresses if any */}
                                    {msg.addresses && msg.addresses.length > 0 && (
                                        <Group gap={4}>
                                            {msg.addresses.map((addr, idx) => (
                                                <Badge
                                                    key={idx}
                                                    variant="light"
                                                    color="blue"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => setSearchAddress(addr)}
                                                    leftSection="📍"
                                                >
                                                    {addr}
                                                </Badge>
                                            ))}
                                        </Group>
                                    )}
                                </Stack>
                                {msg.isUser && <IconUser size={24} />}
                            </Group>
                        ))}
                        {loading && <Loader size="sm" type="dots" ml="md" />}
                    </Stack>
                </ScrollArea>
            </Paper>

            <Group gap="xs">
                <TextInput
                    placeholder="질문을 입력하세요..."
                    value={input}
                    onChange={(e) => setInput(e.currentTarget.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    style={{ flex: 1 }}
                    disabled={loading}
                />
                <ActionIcon
                    variant="filled"
                    color="blue"
                    size="lg"
                    onClick={handleSend}
                    loading={loading}
                    disabled={!input.trim()}
                >
                    <IconSend size={18} />
                </ActionIcon>
            </Group>
        </Stack>
    );
}
