'use client';
import { AppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { HeaderLogo } from '../Header/HeaderLogo';
import { InfoFooter } from '../Footer/InfoFooter';
import { ChatbotSidebar } from '../Chat/ChatbotSidebar';

export function Shell({ children }: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            footer={{ height: 60 }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <HeaderLogo />
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <ChatbotSidebar />
            </AppShell.Navbar>

            <AppShell.Main>
                {children}
            </AppShell.Main>

            <AppShell.Footer >
                <InfoFooter />
            </AppShell.Footer>
        </AppShell>
    );
}
