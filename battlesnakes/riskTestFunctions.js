function createOwnershipArray() {
    const array = [1, 1, 1, 1, 2, 2, 2, 2, 2]; // Define the specific array
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Generate a random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements at i and j indices
    }
    return array;
}

function sumArray(arr) {
    return arr.reduce((total, num) => total + num, 0);
}

function checkGameEnd(ownershipArray) {
    if (sumArray(ownershipArray) === 9) {
        console.log(`Player 1 Wins!!!`);
        return true;
    } else if (sumArray(ownershipArray) === 18) {
        console.log(`Player 2 Wins!!!`);
        return true;
    }
    return false;
}

module.exports = {
    createOwnershipArray,
    sumArray,
    checkGameEnd
};