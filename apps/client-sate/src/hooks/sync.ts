/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { useCallback, useEffect } from 'react';
import { STORE_NAME } from '@repo/constants/names';
import { SyncParams } from '@repo/types/sync';
// import { categoriesUpdate } from '@repo/handlers/requests/database/category';
// import { useStoreCategory } from '@repo/libraries/zustand/stores/category';
import { foodsUpdate } from '@repo/handlers/requests/database/foods';
import { mealsUpdate } from '@repo/handlers/requests/database/meals';
import { servingsUpdate } from '@repo/handlers/requests/database/servings';
import { eatsUpdate } from '@repo/handlers/requests/database/eats';
import { useStoreFood } from '@repo/libraries/zustand/stores/food';
import { useStoreMeal } from '@repo/libraries/zustand/stores/meal';
import { useStoreServing } from '@repo/libraries/zustand/stores/serving';
import { useStoreEat } from '@repo/libraries/zustand/stores/eat';
import { useStoreMass } from '@repo/libraries/zustand/stores/mass';
import { massesUpdate } from '@repo/handlers/requests/database/masses';

// export const useSyncCategories = (params: {
//   syncFunction: (input: SyncParams) => void;
//   online: boolean;
// }) => {
//   const { syncFunction, online } = params;

//   const {
//     categories,
//     deleted: deletedCategories,
//     setCategories,
//     clearDeletedCategories,
//   } = useStoreCategory();

//   const syncCategories = useCallback(() => {
//     syncFunction({
//       items: categories || [],
//       deletedItems: deletedCategories,
//       dataStore: STORE_NAME.CATEGORIES,
//       stateUpdateFunctionDeleted: () => clearDeletedCategories(),
//       stateUpdateFunction: (i) => setCategories(i),
//       serverUpdateFunction: async (i, di) => await categoriesUpdate(i, di),
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [categories, deletedCategories, setCategories, clearDeletedCategories]);

//   useEffect(() => syncCategories(), [categories, syncCategories, online]);

//   return { syncCategories };
// };

export const useSyncFoods = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    foods,
    deleted: deletedFoods,
    setFoods,
    clearDeletedFoods,
  } = useStoreFood();

  const syncFoods = useCallback(() => {
    syncFunction({
      items: foods || [],
      deletedItems: deletedFoods,
      dataStore: STORE_NAME.FOODS,
      stateUpdateFunctionDeleted: () => clearDeletedFoods(),
      stateUpdateFunction: (i) => setFoods(i),
      serverUpdateFunction: async (i, di) => await foodsUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foods, deletedFoods, setFoods, clearDeletedFoods]);

  useEffect(() => syncFoods(), [foods, syncFoods, online]);

  return { syncFoods };
};

export const useSyncMeals = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    meals,
    deleted: deletedMeals,
    setMeals,
    clearDeletedMeals,
  } = useStoreMeal();

  const syncMeals = useCallback(() => {
    syncFunction({
      items: meals || [],
      deletedItems: deletedMeals,
      dataStore: STORE_NAME.MEALS,
      stateUpdateFunctionDeleted: () => clearDeletedMeals(),
      stateUpdateFunction: (i) => setMeals(i),
      serverUpdateFunction: async (i, di) => await mealsUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meals, deletedMeals, setMeals, clearDeletedMeals]);

  useEffect(() => syncMeals(), [meals, syncMeals, online]);

  return { syncMeals };
};

export const useSyncServings = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    servings,
    deleted: deletedServings,
    setServings,
    clearDeletedServings,
  } = useStoreServing();

  const syncServings = useCallback(() => {
    syncFunction({
      items: servings || [],
      deletedItems: deletedServings,
      dataStore: STORE_NAME.SERVINGS,
      stateUpdateFunctionDeleted: () => clearDeletedServings(),
      stateUpdateFunction: (i) => setServings(i),
      serverUpdateFunction: async (i, di) => await servingsUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servings, deletedServings, setServings, clearDeletedServings]);

  useEffect(() => syncServings(), [servings, syncServings, online]);

  return { syncServings };
};

export const useSyncEats = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    eats,
    deleted: deletedEats,
    setEats,
    clearDeletedEats,
  } = useStoreEat();

  const syncEats = useCallback(() => {
    syncFunction({
      items: eats || [],
      deletedItems: deletedEats,
      dataStore: STORE_NAME.EATS,
      stateUpdateFunctionDeleted: () => clearDeletedEats(),
      stateUpdateFunction: (i) => setEats(i),
      serverUpdateFunction: async (i, di) => await eatsUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eats, deletedEats, setEats, clearDeletedEats]);

  useEffect(() => syncEats(), [eats, syncEats, online]);

  return { syncEats };
};

export const useSyncMasses = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    masses,
    deleted: deletedMasses,
    setMasses,
    clearDeletedMasses,
  } = useStoreMass();

  const syncMasses = useCallback(() => {
    syncFunction({
      items: masses || [],
      deletedItems: deletedMasses,
      dataStore: STORE_NAME.MASSES,
      stateUpdateFunctionDeleted: () => clearDeletedMasses(),
      stateUpdateFunction: (i) => setMasses(i),
      serverUpdateFunction: async (i, di) => await massesUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masses, deletedMasses, setMasses, clearDeletedMasses]);

  useEffect(() => syncMasses(), [masses, syncMasses, online]);

  return { syncMasses };
};
