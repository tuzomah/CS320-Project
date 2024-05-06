const { play } = require('snakes.js'); 
describe('Snake and Ladder Game Tests', () => {
    let p1sum, p2sum;

    beforeEach(() => {
        p1sum = 0;
        p2sum = 0;
    });

    test('Player 1 Moves', () => {
        play('p1', p1sum, 0, 3);
        expect(p1sum).toBe(3); 
    });

    test('Player 2 Moves', () => {
        play('p2', p2sum, 55, 4);
        expect(p2sum).toBe(4); 
    });

    test('Player 1 Wins', () => {
        p1sum = 97;
        play('p1', p1sum, 0, 3);
        expect(alert).toHaveBeenCalledWith("Red Won !!"); 
    });

    test('Player 2 Wins', () => {
        p2sum = 96; 
        play('p2', p2sum, 55, 4);
        expect(alert).toHaveBeenCalledWith("Yellow Won !!"); 
    });

    
});
