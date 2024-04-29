module.exports = {
	testEnvironment: "node",
	roots: ["<rootDir>/tests/integration"],
	testMatch: ["**/*.test.ts"],
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	globalSetup: "<rootDir>/tests/integration/jest.globalSetup.ts",
	globalTeardown: "<rootDir>/tests/integration/jest.globalTeardown.ts",
};
