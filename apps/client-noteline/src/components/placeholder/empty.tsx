import { Button, Center, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';
import React from 'react';

export default function Empty({
  props,
  children,
}: {
  props: { image?: string; title: string; desc?: string };
  children?: React.ReactNode;
}) {
  return (
    <Center mih={320}>
      <Stack ta={'center'} maw={320} mx={'auto'}>
        <Title order={1} fw={'bold'} fz={'lg'}>
          {props.title}
        </Title>

        {props.desc && <Text fz={'sm'}>{props.desc}</Text>}

        <div>
          {!children ? (
            <Button size="xs" component={Link} href={'/app/home'}>
              Go To Home Page
            </Button>
          ) : (
            children
          )}
        </div>
      </Stack>
    </Center>
  );
}
