'use client';

import React from 'react';
import {
  Box,
  Button,
  Grid,
  GridCol,
  Select,
  SimpleGrid,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useFormEmailInquiry } from '@/hooks/form/inquiry';
import TooltipInputInfo from '@repo/components/common/tooltips/input/info';
import AnchorNextLink from '@repo/components/common/anchor/next-link';

export default function Contact({
  props,
  options,
}: {
  props?: { subject?: string; message?: string };
  options?: { modal?: boolean; close?: () => void };
}) {
  const { form, submitted, handleSubmit } = useFormEmailInquiry(
    {
      subject: props?.subject,
      message: props?.message,
    },
    { close: options?.close }
  );

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Grid>
        <GridCol span={{ base: 12, md: options?.modal ? 6 : undefined }}>
          <Grid>
            <GridCol
              span={{ base: 12, xs: 6, md: options?.modal ? 12 : undefined }}
            >
              <TextInput
                required
                label={options?.modal ? undefined : 'Name'}
                aria-label={options?.modal ? 'Name' : undefined}
                placeholder={`Your Name${options?.modal ? ' *' : ''}`}
                {...form.getInputProps('name')}
              />
            </GridCol>

            <GridCol
              span={{ base: 12, xs: 6, md: options?.modal ? 12 : undefined }}
            >
              <TextInput
                label={options?.modal ? undefined : 'Phone'}
                aria-label={options?.modal ? 'Phone' : undefined}
                placeholder="Your Phone"
                {...form.getInputProps('phone')}
              />
            </GridCol>

            <GridCol span={12}>
              <TextInput
                required
                label={options?.modal ? undefined : 'Email'}
                aria-label={options?.modal ? 'Email' : undefined}
                placeholder={`Your Email${options?.modal ? ' *' : ''}`}
                {...form.getInputProps('email')}
                rightSection={<TooltipInputInfo />}
              />
            </GridCol>
          </Grid>
        </GridCol>

        <GridCol span={{ base: 12, md: options?.modal ? 6 : undefined }}>
          <Grid>
            <GridCol span={12}>
              <Select
                required
                label={options?.modal ? undefined : 'Inquiry'}
                aria-label={options?.modal ? 'Inquiry' : undefined}
                placeholder={
                  options?.modal ? 'Inquiry *' : 'What are you inquiring about?'
                }
                {...form.getInputProps('subject')}
                data={[
                  { label: 'What are you inquiring about?', value: '' },
                  { label: 'Technical Support', value: 'Technical Support' },
                  { label: 'Sales Support', value: 'Sales Support' },
                  { label: 'Bug Report', value: 'Bug Report' },
                ]}
                checkIconPosition={'right'}
                allowDeselect={false}
              />
            </GridCol>

            <GridCol span={12}>
              <Textarea
                required
                label={options?.modal ? undefined : 'Message'}
                aria-label={options?.modal ? 'Message' : undefined}
                placeholder={
                  options?.modal ? 'Message *' : 'Write your message here...'
                }
                autosize
                minRows={2}
                styles={{ input: { height: '100%' } }}
                maxRows={15}
                resize="vertical"
                {...form.getInputProps('message')}
              />
            </GridCol>

            <GridCol span={12}>
              <Text fz={'sm'} c={'dimmed'}>
                By submitting this form, I agree to the{' '}
                <AnchorNextLink href="#pp" inherit fw={500}>
                  privacy policy
                </AnchorNextLink>
                .
              </Text>
            </GridCol>
          </Grid>
        </GridCol>

        <GridCol span={12}>
          <SimpleGrid cols={{ base: 1, xs: 2 }}>
            <Button
              variant="light"
              fullWidth
              type="reset"
              onClick={() => form.reset()}
              disabled={submitted}
              visibleFrom={options?.modal ? 'xs' : undefined}
            >
              Clear
            </Button>

            <Button fullWidth type="submit" loading={submitted}>
              {submitted ? 'Sending' : 'Send'}
            </Button>
          </SimpleGrid>
        </GridCol>
      </Grid>
    </Box>
  );
}
