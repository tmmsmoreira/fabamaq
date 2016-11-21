var anim_started = false, anim_ended = false;

var createBalls = function() {
    var total_balls = 30, num_limit = 60, balls = [];

    if (document.getElementsByClassName("ball").length > 0) {
        let rootNode = document.getElementById("root");
        while (rootNode.firstChild) {
            rootNode.removeChild(rootNode.firstChild);
        }
    }

    while (balls.length < total_balls) {
        var randomnumber = Math.ceil(Math.random() * num_limit);
        if (balls.indexOf(randomnumber) > -1) continue;
        balls.push({ 'num': randomnumber, 'color': checkNumberColor(randomnumber) });
    }

    for (let i = 0; i < balls.length; i++) {
        let node = document.createElement("div"),
            span = document.createElement("span"),
            audio = document.createElement("audio");
        span.innerHTML = balls[i].num;
        audio.src = checkIfPrimeNumber(balls[i].num) ? "prime.mp3" : "not_prime.mp3";
        node.className = "ball";
        node.style.cssText = "background-color: " + balls[i].color;
        node.appendChild(span);
        node.appendChild(audio);
        document.getElementById("root").appendChild(node);
    }
};

var checkNumberColor = function(num) {
    var colors = ['green', 'blue', 'red', 'yellow', 'orange', 'gray'];

    for (let i = 0; i < colors.length * 10; i += 11) {
        if (num < (i + 11)) {
            return colors[Math.floor(i/10)];
        }
    }
}

var checkIfPrimeNumber = function(num) {
    for (var i = 2; i < num; i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return num > 1;
}

document.getElementsByClassName('toggleButton')[0].onclick = function() {
    var balls = document.getElementsByClassName('ball'),
        current_duration = 100, elem_ended = 0, self = this;

    if (self.innerHTML === 'PLAY') {
        self.innerHTML = 'PAUSE';

        anim_stared = true;
        if (anim_ended) {
            createBalls();
            document.getElementById("total-primes").innerHTML = "";
            balls = document.getElementsByClassName('ball');
        }

        for (let i = 0; i < balls.length; i++) {
            Velocity(balls[i], { translateX: "300px" }, { duration: current_duration - 3, delay: 3, complete: function(elem) {
                elem_ended++;
                elem[0].childNodes[1].play();
                if (elem_ended === balls.length) {
                    animationHasEnded();
                }
            }});
            current_duration += 100;
        }
    } else {
        self.innerHTML = 'PLAY';
        for (let i = 0; i < balls.length; i++) {
            Velocity(balls[i], "stop", true);
        }
    }

    var animationHasEnded = function(elem) {
        var total_primes = 0;
        self.innerHTML = 'PLAY';
        current_duration = 100;
        elem_ended = 0;
        anim_ended = true;
        anim_started = false;

        for (let i = 0; i < balls.length; i++) {
            if (checkIfPrimeNumber(balls[i].childNodes[0].innerHTML)) {
                total_primes++;
            }
        }

        document.getElementById("total-primes").innerHTML = total_primes;
    }
}

createBalls();
