export const colors = [
  { label: 'Gray', colorName: 'gray', hex: '#868e96' },
  { label: 'Red', colorName: 'red', hex: '#fa5252' },
  { label: 'Pink', colorName: 'pink', hex: '#e64980' },
  { label: 'Grape', colorName: 'grape', hex: '#be4bdb' },
  { label: 'Violet', colorName: 'violet', hex: '#7950f2' },
  { label: 'Indigo', colorName: 'indigo', hex: '#4c6ef5' },
  { label: 'Blue', colorName: 'blue', hex: '#228be6' },
  { label: 'Cyan', colorName: 'cyan', hex: '#15aabf' },
  { label: 'Teal', colorName: 'teal', hex: '#12b886' },
  { label: 'Green', colorName: 'green', hex: '#40c057' },
  { label: 'Lime', colorName: 'lime', hex: '#82c91e' },
  { label: 'Yellow', colorName: 'yellow', hex: '#fab005' },
  { label: 'Orange', colorName: 'orange', hex: '#fd7e14' },
] as const;

export type ColorItem = (typeof colors)[number];

// Helper to shuffle a fresh deck of color names
type ColorName = (typeof colors)[number]['colorName'];

function createColorDeck(): ColorName[] {
  const deck: ColorName[] = colors.map((c) => c.colorName);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j]!, deck[i]!];
  }
  return deck;
}

// In your route handler / seed function:
let colorDeck = createColorDeck();
let lastColor: string | null = null;

export const getUniqueColor = (): string => {
  if (colorDeck.length === 0) {
    colorDeck = createColorDeck();
    // Prevent back-to-back duplicate across deck reshuffles
    if (colorDeck[colorDeck.length - 1] === lastColor && colorDeck.length > 1) {
      const popped = colorDeck.pop()!;
      colorDeck.unshift(popped);
    }
  }
  lastColor = colorDeck.pop()!;
  return lastColor;
};
