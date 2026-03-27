import React from 'react';
import {
  Box,
  Center,
  Divider,
  Loader,
  ScrollAreaAutosize,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
} from '@mantine/core';
import { IconCarrot, IconSoup } from '@tabler/icons-react';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import { sortArray } from '@repo/utilities/array';
import { useStoreFood } from '@/libraries/zustand/stores/food';
import { Order, Variant } from '@repo/types/enums';
import ModalServingCrud from '../modals/serving/crud';
import CardFood from '../cards/food';
import { useStoreMeal } from '@/libraries/zustand/stores/meal';
import CardMeal from '../cards/meal';
import { FormEat } from '@/hooks/form/eat';
import { useServingActions } from '@/hooks/actions/serving';
import { useStoreServing } from '@/libraries/zustand/stores/serving';
import { useNotification } from '@repo/hooks/notification';
import { generateUUID } from '@repo/utilities/generators';

export default function Eat({ props }: { props: { form: FormEat } }) {
  return (
    <Tabs defaultValue="foods">
      <TabsList justify="center">
        <TabsTab
          value="foods"
          leftSection={
            <IconCarrot size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
        >
          Foods
        </TabsTab>

        <TabsTab
          value="meals"
          leftSection={<IconSoup size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
        >
          Meals
        </TabsTab>
      </TabsList>

      <TabsPanel value="foods">
        <FoodsPartial props={{ formEat: props.form }} />
      </TabsPanel>

      <TabsPanel value="meals">
        <MealsPartial props={{ formEat: props.form }} />
      </TabsPanel>
    </Tabs>
  );
}

function FoodsPartial({ props }: { props: { formEat: FormEat } }) {
  const { foods } = useStoreFood();

  return (
    <ScrollAreaAutosize h={200} scrollbars={'y'}>
      <Box px={'xs'}>
        {foods === undefined ? (
          <Center py={SECTION_SPACING / 2}>
            <Loader />
          </Center>
        ) : !foods?.length ? (
          <Center py={SECTION_SPACING / 2}>
            <Text fz={'sm'} c={'dimmed'} ta={'center'}>
              No foods found.
            </Text>
          </Center>
        ) : (
          <Stack gap={0}>
            {sortArray(
              foods,
              (i) => new Date(i.updated_at),
              Order.DESCENDING
            ).map((f, i) => (
              <Stack gap={0} key={f.id}>
                {i > 0 && <Divider />}

                <ModalServingCrud
                  props={{
                    serving_size: f.per,
                    serving_unit: f.per_unit,
                    food_id: f.id,
                    eat_id: props.formEat.values.id,
                  }}
                  formEat={props.formEat}
                >
                  <CardFood props={f} />
                </ModalServingCrud>
              </Stack>
            ))}
          </Stack>
        )}
      </Box>
    </ScrollAreaAutosize>
  );
}

function MealsPartial({ props }: { props: { formEat: FormEat } }) {
  const { meals } = useStoreMeal();
  const { servings } = useStoreServing();
  const { servingCreate } = useServingActions({ formEat: props.formEat });
  // let createdServings: ServingGet[] = [];

  const { showNotification } = useNotification();

  return (
    <ScrollAreaAutosize h={200} scrollbars={'y'}>
      <Box px={'xs'}>
        {meals === undefined ? (
          <Center py={SECTION_SPACING / 2}>
            <Loader />
          </Center>
        ) : !meals?.length ? (
          <Center py={SECTION_SPACING / 2}>
            <Text fz={'sm'} c={'dimmed'} ta={'center'}>
              No meals found.
            </Text>
          </Center>
        ) : (
          <Stack gap={0}>
            {sortArray(
              meals,
              (i) => new Date(i.updated_at),
              Order.DESCENDING
            ).map((m, i) => (
              <Stack gap={0} key={m.id}>
                {i > 0 && <Divider />}

                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (!props.formEat.values.id) {
                      showNotification({
                        title: 'Form state required',
                        variant: Variant.WARNING,
                      });

                      return;
                    }

                    const mealServings = (servings || [])
                      .filter((s) => !s.eat_id && s.meal_id == m.id)
                      .map((ms) => {
                        return {
                          ...ms,
                          id: generateUUID(),
                          eat_id: props.formEat.values.id as string,
                          meal_id: null,
                        };
                      });

                    servingCreate(mealServings);
                  }}
                >
                  <CardMeal props={m} />
                </div>
              </Stack>
            ))}
          </Stack>
        )}
      </Box>
    </ScrollAreaAutosize>
  );
}
