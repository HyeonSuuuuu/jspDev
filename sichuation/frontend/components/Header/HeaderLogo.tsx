import { Title, Group } from '@mantine/core';

export function HeaderLogo() {
    return (
        <Group>
            <div style={{
                width: 32,
                height: 32,
                background: 'var(--mantine-color-blue-filled)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
            }}>
                S
            </div>
            <Title order={3}>Sichuation</Title>
        </Group>
    );
}
