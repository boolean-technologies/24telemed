export type RecursiveKeyOf<TObj extends object> = {
    [TKey in keyof TObj & (string | number)]: TObj[TKey] extends Array<unknown>
      ? `${TKey}`
      : TObj[TKey] extends object
      ? `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
      : `${TKey}`;
  }[keyof TObj & (string | number)];
  