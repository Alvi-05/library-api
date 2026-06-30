/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/**/*.spec.ts"],
  // Prints individual test results in the terminal instead of just a summary
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  //Tells Jest to treat TypeScript files as ES Modules
  extensionsToTreatAsEsm: [".ts"],

  transform: {
    //Configure ts-jest to compile files with ESM flag turned on
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.json",
      },
    ],
  },
};

export default config;