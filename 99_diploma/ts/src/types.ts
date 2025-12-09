import type { NOT_FOUND, TECH_ERROR } from "./constants.js";

export type FindResult<T> = { found: T } | typeof NOT_FOUND | typeof TECH_ERROR;

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
