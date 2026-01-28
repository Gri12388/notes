import { AGE, type COLLECTIONS, type NOT_FOUND, type NOT_UNIQUE_TYPES, type TECH_ERROR } from "./constants.js";

export type FindResult<T> = { found: T } | typeof NOT_FOUND | typeof TECH_ERROR;
export type CollectionName = typeof COLLECTIONS.creds | typeof COLLECTIONS.sessions;

export type Creds = {
  login: string;
  password: string;
};

export type Session = {
  user: string;
  expire: number;
};

export type Dictionary<T> = {
  name: string;
  value: T;
};

export type UrlOptions = {
  origin: string;
  path: string;
  search: Dictionary<string>[];
};

export type NotUnique = typeof NOT_UNIQUE_TYPES.session | typeof NOT_UNIQUE_TYPES.user;

export type Note = {
  id: string;
  user: string;
  title: string;
  text: string;
  isArchived: boolean;
  createdAt: number;
};

export type Age = typeof AGE.allTime | typeof AGE.archive | typeof AGE.oneMonth | typeof AGE.threeMonth;

export type AgeData = {
  isArchived: boolean;
  timestamp: number;
};

export type List = {
  age: Age;
  search: string;
  page: number;
};
