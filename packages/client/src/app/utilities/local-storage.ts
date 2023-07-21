export const storeStorageItem = (key: string, value: any) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const loadStorageItem = (key: string): any | undefined => {
  try {
    return JSON.parse(window.localStorage.getItem(key) as string);
  } catch (err) {
    return undefined;
  }
};
