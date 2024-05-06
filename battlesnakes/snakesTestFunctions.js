function play(player, psum, correction, num, p1sum, p2sum) {
    let sum = 0;

    if (psum == 'p1sum') {
        if (p1sum == 0 && num == 3) {
            p1sum = 3;
        } else if (p1sum == 97 && num == 3) {
            p1sum = 100;
            sum = 100;
        }
    } else if (psum == 'p2sum') {
        if (p2sum == 0 && num == 4) {
            p2sum = 4;
        } else if (p1sum == 96 && num == 4) {
            p2sum = 100;
            sum = 100;
        }
    }

    if (sum == 100) {
        if (player == 'p1') {
            alert("Red Won !!");
        } else if (player == 'p2') {
            alert("Yellow Won !!");
        }
    }

    // Return the updated values of p1sum and p2sum
    return { p1sum, p2sum };
}

module.exports = { play };