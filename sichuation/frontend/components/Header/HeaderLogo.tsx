import { Title, Group } from '@mantine/core';
import Image from 'next/image';

export function HeaderLogo() {
    return (
        <Group>
            <Image
                src="/team_logo.png"
                alt="SichuAtion Logo"
                width={40}
                height={40}
                style={{ objectFit: 'contain' }}
            />
            <Title order={3}>Sichuation</Title>
        </Group>
    );
}
