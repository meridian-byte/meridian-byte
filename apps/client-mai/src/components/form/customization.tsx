'use client';

import React from 'react';
import {
  Group,
  List,
  ListItem,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import classes from './customization.module.scss';
import PopoverMain from '@/components/common/popover/main';
import { IconHelpCircle } from '@tabler/icons-react';
import { useFormCustomization } from '@repo/hooks/form/customization';
import { APP_NAME } from '@repo/constants/app';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';

export default function Customization() {
  const { form, handleSubmit, submitted } = useFormCustomization();

  return (
    <form onSubmit={form.onSubmit(() => handleSubmit())}>
      <Stack gap={'lg'}>
        <TextInput
          label={`What should ${APP_NAME.MAI} call you?`}
          placeholder="Nickname"
          key={form.key('nickname')}
          {...form.getInputProps('nickname')}
          disabled={!form.getValues().active}
          classNames={classes}
        />

        <TextInput
          label={`What do you do?`}
          placeholder="Occupation"
          key={form.key('occupation')}
          {...form.getInputProps('occupation')}
          disabled={!form.getValues().active}
          classNames={classes}
        />

        <Textarea
          label={
            <Group gap={5}>
              <span>What traits should {APP_NAME.MAI} have?</span>

              <PopoverMain
                target={
                  <Group mb={4} c={'dimmed'}>
                    <IconHelpCircle
                      size={ICON_SIZE}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  </Group>
                }
              >
                <Text size="sm" fw={'bold'}>
                  You can tell {APP_NAME.MAI} to do things like:
                </Text>

                <List size="sm" mt={'xs'} pl={5} spacing={5} pr={20}>
                  <ListItem>Use a formal, professional tone</ListItem>
                  <ListItem>Be casual and chatty</ListItem>
                  <ListItem>
                    Be opinionated. If a question could have multiple answers,
                    try to give only the best one
                  </ListItem>
                </List>
              </PopoverMain>
            </Group>
          }
          placeholder="Describe or select traits"
          key={form.key('traits')}
          {...form.getInputProps('traits')}
          disabled={!form.getValues().active}
          classNames={classes}
          rows={5}
        />

        <Textarea
          label={
            <Group gap={5}>
              <span>Anything else {APP_NAME.MAI} should know about you?</span>

              <PopoverMain
                target={
                  <Group mb={4} c={'dimmed'}>
                    <IconHelpCircle size={16} stroke={ICON_STROKE_WIDTH} />
                  </Group>
                }
              >
                <Text size="sm" fw={'bold'}>
                  You can share things like:
                </Text>

                <List size="sm" mt={'xs'} pl={5} spacing={5} pr={20}>
                  <ListItem>I love hiking and jazz</ListItem>
                  <ListItem>I&apos;m vegetarian</ListItem>
                  <ListItem>I&apos;m trying to learn French</ListItem>
                </List>
              </PopoverMain>
            </Group>
          }
          placeholder="Interests, values, or preferences to keep in mind"
          key={form.key('partialities')}
          {...form.getInputProps('partialities')}
          disabled={!form.getValues().active}
          classNames={classes}
          rows={5}
        />
      </Stack>
    </form>
  );
}
