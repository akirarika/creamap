export type Creamap<T = any> = {
  toArray: () => Array<T>;
  toMap: () => Map<string, T>;
  getLength: () => number;
  getKeys: () => IterableIterator<string>;
  getValues: () => IterableIterator<T>;
  forEach: (handler: (value: T, key: string) => void) => void;
  sortBy: (compareFn: (a: any, b: any) => number) => Creamap<T>;
  paginate: (currentPpage: number, num: number, compareFn?: (a: any, b: any) => number) => Creamap<T>;
  filter: (handler: (value: T, key: string) => boolean) => Creamap<T>;
  find: (handler: (value: T, key: string) => boolean) => T | undefined;
  findIndex: (handler: (value: T, key: string) => boolean) => string | undefined;
  findOne(queries: Record<string, unknown>): Promise<any>;
  findMany(queries: Record<string, unknown>): Promise<Creamap<any>>;
  /**
   * Like Array "at" function, return key.
   */
  atKey: (index: number) => string | undefined;
  /**
   * Like Array "at" function, return value.
   */
  at: (index: number) => T | undefined;
} & {
  [Symbol.iterator](): IterableIterator<T>;
  [other: string]: T;
};

const toArray = (target: Map<string, unknown>) => {
  return [...target.values()];
};

const toMap = (target: Map<string, unknown>) => {
  return target;
};

const getLength = (target: Map<string, unknown>) => {
  return target.size;
};

const getKeys = (target: Map<string, unknown>) => {
  return target.keys();
};

const getValues = (target: Map<string, unknown>) => {
  return target.values();
};

const forEach = (target: Map<string, unknown>, handler: (value: unknown, key: string) => void) => {
  for (let [k, v] of target.entries()) {
    handler(v, k);
  }
};

const sortBy = (target: Map<string, unknown>, compareFn: (a: any, b: any) => number) => {
  const arr = Array.from(target);
  arr.sort((a, b) => compareFn(a[1], b[1]));
  return makeCreamap(new Map(arr.map((i) => [i[0], i[1]])));
};

const paginate = (target: Map<string, unknown>, currentPpage: number, num: number, compareFn?: (a: any, b: any) => number) => {
  const res = makeCreamap();

  let data: Map<string, unknown>;
  if (undefined === compareFn) data = target;
  else data = sortBy(target, compareFn).toMap();

  if (currentPpage < 1) currentPpage = 1;

  const min = (currentPpage - 1) * num;
  const max = min + num;

  let i = 0;
  for (const [key, value] of data) {
    i++;
    if (i <= min) continue;
    if (i > max) break;
    res[key] = value;
  }

  return res;
};

const filter = (target: Map<string, unknown>, handler: (value: any, key: string) => boolean) => {
  const newMap = makeCreamap();
  for (let [k, v] of target.entries()) {
    if (true === handler(v, k)) {
      newMap[k] = v;
    }
  }
  return newMap;
};

const find = (target: Map<string, unknown>, handler: (value: any, key: string) => boolean) => {
  for (let [k, v] of target.entries()) {
    if (true === handler(v, k)) {
      return v;
    }
  }
  return undefined;
};

const findIndex = (target: Map<string, unknown>, handler: (value: any, key: string) => boolean) => {
  for (let [k, v] of target.entries()) {
    if (true === handler(v, k)) {
      return k;
    }
  }
  return undefined;
};

const findOne = (target: Map<string, unknown>, queries: Record<string, unknown>) => {
  const handler = (value: Record<string, unknown>) => {
    for (const key in value) {
      if (key in queries && undefined !== queries[key]) {
        if (value[key] !== queries[key]) {
          return false;
        }
      }
    }
    return true;
  };
  return find(target, handler);
};

const findMany = (target: Map<string, unknown>, queries: Record<string, unknown>) => {
  const handler = (value: Record<string, unknown>) => {
    for (const key in value) {
      if (key in queries && undefined !== queries[key]) {
        if (value[key] !== queries[key]) {
          return false;
        }
      }
    }
    return true;
  };
  return filter(target, handler);
};

const atKey = (target: Map<string, unknown>, index: number) => {
  if (index < 0) index = target.size - Math.abs(index);

  let i = 0;
  for (const [key] of target) {
    if (i === index) return key;
    i++;
  }

  return undefined;
};

const at = (target: Map<string, unknown>, index: number) => {
  if (index < 0) index = target.size - Math.abs(index);

  let i = 0;
  for (const [_key, value] of target) {
    if (i === index) return value;
    i++;
  }

  return undefined;
};

export function makeCreamap<ValueType = any>(map?: Map<string, unknown>) {
  if (undefined === map) map = new Map<string, unknown>();
  return new Proxy(map, {
    get: (target, key: string) => {
      if (!key) return undefined;
      else if ("toArray" === key) {
        return () => toArray(target);
      } else if ("toMap" === key) {
        return () => toMap(target);
      } else if ("getLength" === key) {
        return () => getLength(target);
      } else if ("getKeys" === key) {
        return () => getKeys(target);
      } else if ("getValues" === key) {
        return () => getValues(target);
      } else if ("forEach" === key) {
        return (handler: (value: unknown, key: string) => void) => forEach(target, handler);
      } else if ("filter" === key) {
        return (handler: (value: unknown, key: string) => boolean) => filter(target, handler);
      } else if ("find" === key) {
        return (handler: (value: unknown, key: string) => boolean) => find(target, handler);
      } else if ("findIndex" === key) {
        return (handler: (value: unknown, key: string) => boolean) => findIndex(target, handler);
      } else if ("findOne" === key) {
        return (queries: Record<string, unknown>) => findOne(target, queries);
      } else if ("findMany" === key) {
        return (queries: Record<string, unknown>) => findMany(target, queries);
      } else if ("sortBy" === key) {
        return (compareFn: (a: unknown, b: unknown) => number) => sortBy(target, compareFn);
      } else if ("paginate" === key) {
        return (currentPpage: number, num: number, compareFn: (a: unknown, b: unknown) => number) =>
          paginate(target, currentPpage, num, compareFn);
      } else if ("atKey" === key) {
        return (index: number) => atKey(target, index);
      } else if ("at" === key) {
        return (index: number) => at(target, index);
      } else return target.get(key);
    },
    set: (target, key: string, value) => (target.set(key, value), true),
    has: (target, key: string) => target.has(key),
    deleteProperty: (target, key: string) => target.delete(key),
    ownKeys: (target) => [...target.keys()],
    getOwnPropertyDescriptor: (target, key: string) => ({
      enumerable: true,
      configurable: true,
      value: target.get(key),
    }),
  }) as unknown as Creamap<ValueType>;
}
