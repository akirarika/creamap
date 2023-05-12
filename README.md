# Creamap

Use Map like Object and have util-methods like Array.

```ts
const creamap = makeCreamap();

creamap.foo = "hello";
creamap.bar = "world";
console.log(creamap.foo); // echo: 'hello'

console.log(creamap.at(-1)); // echo: 'world'
console.log(creamap.atKey(-1)); // echo: 'bar'

creamap.forEach((value, key) => {
  console.log(value, key); // echo: 'hello' 'foo', 'world' 'bar'
});

const map = creamap.toMap();
console.log(map.get("foo")); // echo: 'hello'
```

## Where to get

```sh
npm i creamap
```

## All methods

```ts
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
```
