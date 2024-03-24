const express = require('express');
const session = require('express-session');
const router = express.Router();
const db = require('../database');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { getCoins } = require('../util');

router.get('/', async (req, res) => {
    const username = req.session.username;
    const coins = await getCoins(username);
    res.render('snakes', { username, coins });
});;

module.exports = router;

let rollingSound = new Audio('SnakesAndLadder_rpg-dice-rolling-95182.mp3')
let winSound = new Audio('SnakesAndLadder_winharpsichord-39642.mp3')



let psum = 0


function play(num) {
    let sum
    

        psum = psum + num

        if (psum > 100) {
            psum = psum - num
            // sum = p1sum
        }

        if (psum == 1) {
            psum = 38
        }
        if (psum == 4) {
            psum = 14
        }
        if (psum == 8) {
            psum = 30
        }
        if (psum == 21) {
            psum = 42
        }
        if (psum == 28) {
            psum = 76
        }
        if (psum == 32) {
            psum = 10
        }
        if (psum == 36) {
            psum = 6
        }
        if (psum == 48) {
            psum = 26
        }
        if (psum == 50) {
            psum = 67
        }
        if (psum == 62) {
            psum = 18
        }
        if (psum == 71) {
            psum = 92
        }
        if (psum == 80) {
            psum = 99
        }
        if (psum == 88) {
            psum = 24
        }
        if (psum == 95) {
            psum = 56
        }
        if (psum == 97) {
            psum = 78
        }

        sum = psum



    

    document.getElementById(`player`).style.transition = `linear all .5s`





    if (sum < 10) {

        document.getElementById(`player`).style.left = `${(sum - 1) * 62}px`
        document.getElementById(`player`).style.top = `${-0 * 62}px`


    }

    else if (sum == 100) {
        winSound.play()
      alert("Congratulations! You won!")
        location.reload()
    }

    else {

        numarr = Array.from(String(sum))
        n1 = eval(numarr.shift())
        n2 = eval(numarr.pop())
        // console.log(n1, n2)

        if (n1 % 2 != 0) {

            if (n2 == 0) {
                document.getElementById(`player`).style.left = `${(9) * 62}px`
                document.getElementById(`player`).style.top = `${(-n1 + 1) * 62}px`
            }
            else {
                document.getElementById(`player`).style.left = `${(9 - (n2 - 1)) * 62}px`
                document.getElementById(`player`).style.top = `${-n1 * 62}px`

            }

        }
        else if (n1 % 2 == 0) {
            if (n2 == 0) {

                document.getElementById(`player`).style.left = `${(0) * 62}px`
                document.getElementById(`player`).style.top = `${(-n1 + 1) * 62}px`
            }
            else {

                document.getElementById(`player`).style.left = `${(n2 - 1) * 62}px`
                document.getElementById(`player`).style.top = `${-n1 * 62}px`
            }

        }



    }
}


document.getElementById("diceBtn").addEventListener("click", function () {
    rollingSound.play()
    num = Math.floor(Math.random() * (6 - 1 + 1) + 1)
    document.getElementById("dice").innerText = num;
    play(num);
});