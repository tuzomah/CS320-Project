describe('startGame', () => {
  test('tests board setup', () => {
    expect(startGame).toBeDefined();
  });

  test('start game button disappears', () => {
    const mockSetupButtons = document.createElement('div');
    const mockStartButton = document.createElement('button');

    mockStartButton.click();

    expect(mockSetupButtons.style.display).toBe('none');
    expect(textDisplay.innerHTML).toBe('');
  });
});

describe('createBoard', () => {
  test('createBoard defined here', () => {
    expect(createBoard).toBeDefined();
  });

  test('spotsOnGrid is correct', () => {
    const mockGridLines = document.createElement('div');
    const mockSpotsOnGrid = [];

    createBoard(mockGridLines, mockSpotsOnGrid);

    expect(mockGridLines.children.length).toBe(width * width);
    expect(mockSpotsOnGrid.length).toBe(width * width);
  });
});

