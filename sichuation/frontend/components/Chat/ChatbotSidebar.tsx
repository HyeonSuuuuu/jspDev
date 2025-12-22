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
        { id: 1, text: '안녕하세요! 시흥시 맛집, 카페 등을 추천해 드립니다.', isUser: false }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollViewport = useRef<HTMLDivElement>(null);
    const setSearchAddress = useMapStore((state) => state.setSearchAddress);
    const setPlaces = useMapStore((state) => state.setPlaces);

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
            // Use environment variable or default to relative path (for production Nginx)
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const response = await fetch(`${baseUrl}/api/gemini/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage.text })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            // data format matches GeminiResponse(String message, List<String> addresses)
            let botText = data.message;
            let addresses = data.addresses || [];

            // Try to parse JSON from the response
            try {
                const cleanJson = data.message.replace(/```json/gi, '').replace(/```/g, '').trim();
                const places = JSON.parse(cleanJson);

                if (Array.isArray(places)) {
                    setPlaces(places);

                    // Extract addresses from the parsed places
                    const newAddresses = places.map((p: any) => {
                        // Frontend preprocessing: remove text in parentheses and special chars
                        const rawAddr = p.address || '';
                        return rawAddr.replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '').replace(/[*#\-•·]/g, '').trim();
                    }).filter((addr: string) => addr && addr.length > 0);

                    if (newAddresses.length > 0) {
                        addresses = newAddresses;
                    }

                    // Format the chat message to be more readable
                    botText = "추천 장소를 좌측 목록에 업데이트했습니다.\n\n" +
                        places.map((p: any) => `📍 ${p.name}\n${p.description}`).join('\n\n');
                }
            } catch (e) {
                console.warn("Failed to parse JSON from LLM response:", e);
                // If parsing fails, fall back to showing the original message
            }

            const botMessage = {
                id: Date.now() + 1,
                text: botText,
                isUser: false,
                addresses: addresses
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
