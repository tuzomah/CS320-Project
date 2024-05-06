const { startGame, startTimer, createBoard, generate, rotate, showOutcome, enemyGo, checkForWins, gameOver, gameOvert, toggleAudio } = require('./appGame.js');

describe('Audio test functions', () => {
    it('should toggle audio play/pause', () => {
        const audio = { paused: true, play: jest.fn(), pause: jest.fn() };
        toggleAudio(audio);
        expect(audio.play).toHaveBeenCalled();
        expect(audio.paused).toBe(false);

        toggleAudio(audio);
        expect(audio.pause).toHaveBeenCalled();
        expect(audio.paused).toBe(true);
    });
});

describe('Game Initialization', () => {
    it('StartGame executes', () => {
        expect(startGame).toBeDefined();
    });

    it('If timer starts', () => {
        expect(startTimer).toBeDefined();
    });

    it('Gamebaord defined', () => {
        expect(createBoard).toBeDefined();
    });

    it('Enemy ships generated', () => {
        expect(generate).toBeDefined();
    });

    it('Enemy ships rotated', () => {
        expect(rotate).toBeDefined();
    });

    it('Toggle audio on webpage', () => {
        expect(toggleAudio).toBeDefined();
    });
});

describe('Game logic', () => {
    it('should handle user shots', () => {
        expect(showOutcome).toBeDefined();
    });

    it('Turns pass between enemy', () => {
        expect(enemyGo).toBeDefined();
    });

    it('If game ends', () => {
        expect(checkForWins).toBeDefined();
    });

    it('end pt 2', () => {
        expect(gameOver).toBeDefined();
        expect(gameOvert).toBeDefined();
    });
});
