import {
  MacroOptions,
  MacroResult,
  TDEEOptions,
  TDEEResult,
} from '@repo/types/weight';
/**
 * TDEE: Multiply BMR by an activity factor:
 * 1.2 = sedentary
 * 1.375 = light
 * 1.55 = moderate
 * 1.725 = very active
 * 1.9 = extra active
 */

const defaultTDEEOptions = {
  weightKg: 0,
  heightCm: 165,
  age: 25,
  sex: 'male',
  activityFactor: 1.2,
};

export const calculateBmrTdee = (params: TDEEOptions): TDEEResult => {
  const newParams = { ...defaultTDEEOptions, ...params };

  let bmr: number;

  if (newParams.sex === 'male') {
    bmr =
      10 * newParams.weightKg +
      6.25 * newParams.heightCm -
      5 * newParams.age +
      5;
  } else {
    bmr =
      10 * newParams.weightKg +
      6.25 * newParams.heightCm -
      5 * newParams.age -
      161;
  }

  const tdee = bmr * newParams.activityFactor;

  return { bmr, tdee };
};

export const calculateMacros = (params: MacroOptions): MacroResult => {
  const protein = (params.leanMassKg ?? params.weightKg) * 2; // 2g per kg lean mass or total weight
  const fat = params.weightKg * 1; // 1g per kg body weight
  const proteinCalories = protein * 4; // 408k
  const fatCalories = fat * 9; // 559k

  const totalCalories = (proteinCalories + fatCalories) * 1.5; // carbs fill the rest
  const surplus = 300; // 300 - 500 kcal (excersise, day-to-day, etc.)
  const carbsCalories =
    totalCalories + surplus - (proteinCalories + fatCalories);
  const carbs = carbsCalories / 4;

  return {
    protein: Math.round(protein),
    fat: Math.round(fat),
    carbs: Math.round(carbs),
    kcal: Math.round(totalCalories),
  };
};
