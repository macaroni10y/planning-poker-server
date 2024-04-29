module.exports = {
	testEnvironment: "node",
	roots: ["<rootDir>/tests/functions"],
	testMatch: ["**/*.test.ts"],
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
};
