declare namespace NodeJS {
  interface Global {
    context: jest.Describe;
  }
}

// eslint-disable-next-line no-var
declare var context: jest.Describe;
