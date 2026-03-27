'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import {
  Box,
  Button,
  Grid,
  GridCol,
  Group,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useFormUserProfile } from '@/hooks/form/account/profile';
import InputComboboxCountryCode from '@repo/components/common/inputs/combobox/country-code';

export default function Profile() {
  const { form, submitted, handleSubmit, session } = useFormUserProfile();

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Grid>
        <GridCol span={{ base: 12, sm: 6 }}>
          <TextInput
            required
            label={'First Name'}
            placeholder="First Name"
            {...form.getInputProps('name.first')}
            disabled={!session}
          />
        </GridCol>

        <GridCol span={{ base: 12, sm: 6 }}>
          <TextInput
            required
            label={'Last Name'}
            placeholder="Last Name"
            {...form.getInputProps('name.last')}
            disabled={!session}
          />
        </GridCol>

        <GridCol span={{ base: 12 }}>
          <Stack gap={'xs'}>
            <Text component="label" htmlFor="phone-number">
              Phone
            </Text>

            <Group gap={0} grow preventGrowOverflow={false}>
              <InputComboboxCountryCode
                formValue={form.values.phone}
                onChange={(value) => form.setFieldValue('phone.code', value)}
                error={form.getInputProps('phone.code').error}
              />

              <TextInput
                id={'phone-number'}
                placeholder="Your Phone"
                {...form.getInputProps('phone.number')}
                styles={{
                  input: {
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  },
                }}
              />
            </Group>
          </Stack>
        </GridCol>

        <GridCol span={{ base: 12 }}>
          <Button type="submit" loading={submitted} mt={'md'}>
            {submitted ? 'Submitting' : 'Submit'}
          </Button>
        </GridCol>
      </Grid>
    </Box>
  );
}
