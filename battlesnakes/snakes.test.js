const { play } = require('./snakesTestFunctions');
global.alert = jest.fn();

describe('Snake and Ladder Game Tests', () => {
    let p1sum = 0;
    let p2sum = 0;

    test('Player 1 Moves', () => {
        // Capture the updated values of p1sum and p2sum
        const { p1sum: updatedP1sum, p2sum: updatedP2sum } = play('p1', 'p1sum', 0, 3, p1sum, p2sum);
        // Update the original variables with the updated values
        p1sum = updatedP1sum;
        p2sum = updatedP2sum;
        expect(p1sum).toBe(3);
    });

    test('Player 2 Moves', () => {
        const { p1sum: updatedP1sum, p2sum: updatedP2sum } = play('p2', 'p2sum', 55, 4, p1sum, p2sum);
        p1sum = updatedP1sum;
        p2sum = updatedP2sum;
        expect(p2sum).toBe(4);
    });

    test('Win', () => {
        p1sum = 97;
        const { p1sum: updatedP1sum } = play('p1', 'p1sum', 0, 3, p1sum, p2sum);
        p1sum = updatedP1sum;
        expect(global.alert).toHaveBeenCalledWith("Red Won !!");
    });

});
