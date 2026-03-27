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
