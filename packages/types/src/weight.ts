export type TDEEOptions = {
  weightKg: number;
  heightCm?: number; // optional, defaults to 170cm
  age?: number; // optional, defaults to 30 years
  sex?: 'male' | 'female'; // optional, defaults to male
  activityFactor?: number; // optional, defaults to 1.55 (moderate activity)
};

export type TDEEResult = {
  bmr: number;
  tdee: number;
};

export type MacroOptions = {
  weightKg: number;
  leanMassKg?: number; // optional, to fine-tune protein
};

export type MacroResult = {
  protein: number; // grams
  fat: number; // grams
  carbs: number; // grams
  kcal: number;
};
