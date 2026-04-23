export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  DEV = 'DEV',
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export enum SyncStatus {
  PENDING = 'PENDING',
  SYNCED_CLIENT = 'SYNCED_CLIENT',
  SYNCED = 'SYNCED',
  SAVED = 'SAVED',
  ERROR = 'ERROR',
  DELETED = 'DELETED',
}

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
  TRANSFER = 'TRANSFER',
}

export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
}

export enum CategoryType {
  BLOG = 'BLOG',
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export enum RecurringFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMI_ANNUALLY = 'SEMI_ANNUALLY',
  ANNUALLY = 'ANNUALLY',
}

export enum WeightUnitType {
  MILLIGRAMS = 'MILLIGRAMS',
  GRAMS = 'GRAMS',
}

export enum EatTime {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
}

export enum ChatMessageRole {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
}

export enum Priority {
  URGENT_IMPORTANT = 'URGENT_IMPORTANT',
  NOT_URGENT_IMPORTANT = 'NOT_URGENT_IMPORTANT',
  URGENT_UNIMPORTANT = 'URGENT_UNIMPORTANT',
  NOT_URGENT_UNIMPORTANT = 'NOT_URGENT_UNIMPORTANT',
}

export enum Frequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMI_ANNUALLY = 'SEMI_ANNUALLY',
  ANNUALLY = 'ANNUALLY',
}

export enum ViewType {
  LIST = 'LIST',
  BOARD = 'BOARD',
  CALENDAR = 'CALENDAR',
}

export enum GroupSort {
  PRIORITY = 'PRIORITY',
  CATEGORY = 'CATEGORY',
  DATE = 'DATE',
}

export enum SortDirection {
  ASCENDING = 'ASCENDING',
  DESCENDING = 'DESCENDING',
}

export enum WorkspaceType {
  NOTELINE = 'NOTELINE',
  STRIDE = 'STRIDE',
}
