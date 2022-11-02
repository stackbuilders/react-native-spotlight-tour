declare namespace NodeJS {
  interface Global {
    context: jest.Describe;
  }
}

declare var context: jest.Describe;
