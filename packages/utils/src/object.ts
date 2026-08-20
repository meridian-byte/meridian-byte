export function hasChanges<T extends object>(current: T, incoming: Partial<T>): boolean {
  return Object.keys(incoming).some((key) => current[key as keyof T] !== incoming[key as keyof T]);
}
