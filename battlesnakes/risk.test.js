const { createOwnershipArray, sumArray, checkGameEnd } = require('./riskTestFunctions.js');

describe('createOwnershipArray function', () => {
    // Test case to check if the returned array contains only 1s and 2s
    test('should return an array of 9 numbers, either 1 or 2', () => {
        // Call the function to get the array
        const result = createOwnershipArray();
        // Assert that the result is an array
        expect(Array.isArray(result)).toBe(true);
        // Assert that the result has a length of 9
        expect(result.length).toBe(9);
        // Assert that all elements in the array are either 1 or 2
        result.forEach(number => {
            expect([1, 2]).toContain(number);
        });
    });
});

describe('sumArray function', () => {
    test('should return the sum of the elements in the array', () => {
        // Define test cases with input arrays and expected outputs
        const testCases = [
            { input: [1, 1, 2, 2, 1, 2, 2, 1, 2], expected: 14 },  // Test case 1
            { input: [2, 2, 1, 1, 2, 1, 2, 2, 2], expected: 15 },  // Test case 2
            { input: [1, 1, 1, 1, 1, 2, 1, 1, 1], expected: 10 },  // Test case 3
            { input: [2, 2, 1, 2, 2, 2, 2, 2, 2], expected: 17 },  // Test case 4
        ];

        // Iterate through each test case and run the test
        testCases.forEach(({ input, expected }) => {
            // Call the sumArray function with the input array
            const result = sumArray(input);
            // Assert that the result matches the expected output
            expect(result).toBe(expected);
        });
    });
});

describe('checkGameEnd function', () => {
    const testCases = [
        { ownershipArray: [1, 1, 2, 2, 1, 2, 2, 1, 2], expectedMessage: undefined }, // Test case 1
        { ownershipArray: [2, 2, 1, 1, 2, 1, 2, 2, 2], expectedMessage: undefined }, // Test case 2
        { ownershipArray: [1, 1, 1, 1, 1, 1, 1, 1, 1], expectedMessage: "Player 1 Wins!!!" }, // Test case 3
        { ownershipArray: [2, 2, 2, 2, 2, 2, 2, 2, 2], expectedMessage: "Player 2 Wins!!!" }  // Test case 4
    ];

    testCases.forEach(({ ownershipArray, expectedMessage }, index) => {
        test(`should return ${index < 2 ? 'false' : 'true'} and log "${expectedMessage}" for test case ${index + 1}`, () => {
            // Spy on console.log to capture the output
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
            // Call the checkGameEnd function with the ownership array from the test case
            const result = checkGameEnd(ownershipArray);
            // Expect the result to be false for the first 2 cases, true otherwise
            expect(result).toBe(index >= 2);
            // If there's an expected message, expect console.log to have been called with it
            if (expectedMessage) {
                expect(consoleLogSpy).toHaveBeenCalledWith(expectedMessage);
            }
            // Restore the original console.log implementation
            consoleLogSpy.mockRestore();
        });
    });
});