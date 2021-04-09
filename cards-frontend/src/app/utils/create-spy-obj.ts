export const createSpyObj = (_baseName: string, methodNames: string[]): jest.Mocked<any> => {
  const obj: any = {};

  for (let i = 0; i < methodNames.length; i++) {
    obj[methodNames[i]] = jest.fn();
  }

  return obj;
};
