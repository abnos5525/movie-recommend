const map = {
  home: '/',
  offline: "/offline"
} as const;

const extractKeys = (obj: Record<string, string | Record<string, string>>) => {
  const res: Array<string> = [];

  Object.values(obj).forEach((val) => {
    if (typeof val === 'string') {
      res.push(val);
    } else {
      Object.values(val).forEach((val2) => res.push(val2));
    }
  });

  return res;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const keys = extractKeys(map);
type Tkeys = (typeof keys)[number];

export { map };
export type { Tkeys };
