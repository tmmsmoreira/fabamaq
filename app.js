var anim_started = false, anim_ended = false, is_playing = false, elem_ended = 0;

var createBalls = function() {
    var total_balls = 30, num_limit = 60, balls = [], is_playing = false, current_duration = 100;

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
        node.setAttribute("duration", current_duration - 3);
        node.appendChild(span);
        node.appendChild(audio);
        document.getElementById("root").appendChild(node);
        current_duration += 100;
    }
};

//Handle the balls color, giving it's number
var checkNumberColor = function(num) {
    var colors = ['#2ECC40', '#39CCCC', '#85144b', '#FFDC00', '#FF851B', '#AAAAAA'];

    for (let i = 0; i < colors.length * 10; i += 11) {
        if (num < (i + 11)) {
            return colors[Math.floor(i/10)];
        }
    }
}

//Check is a number is prime or not
var checkIfPrimeNumber = function(num) {
    for (var i = 2; i < num; i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return num > 1;
}

//Button click event to handle the diferent PAUSE and PLAY
document.getElementsByClassName('toggleButton')[0].onclick = function() {
    var balls = document.getElementsByClassName('ball'),
        current_duration = 100, self = this;

    if (!is_playing) {
        self.innerHTML = 'PAUSE';
        is_playing = true;
        anim_started = true;

        //Check if a previous animation has ended or not. If so, it must create new balls
        if (anim_ended) {
            createBalls();
            document.getElementById("total-primes").innerHTML = "";
            balls = document.getElementsByClassName('ball');
            anim_ended = false;
        }

        //Start or resume animation
        for (let i = 0; i < balls.length; i++) {
            let el = balls[i],
                regExp = /\(([^)]+)\)/,
                maxTranslate = 300;
                matches = regExp.exec(el.style.transform),
                translate = matches ? matches[1].substr(0, matches[1].indexOf('px')) : 0;

            if (translate < maxTranslate) {
                let diffToMax = maxTranslate - translate,
                    ratio = diffToMax / maxTranslate,
                    durationDiff = balls[i].getAttribute('duration') * ratio;

                Velocity(balls[i], { translateX: "300px" }, { duration: durationDiff, delay: translate == 0 ? 3 : 0,complete: function(elem) {
                    elem_ended++;
                    elem[0].childNodes[1].play();

                    if (elem_ended === balls.length) {
                        animationHasEnded();
                    }
                }});
            }
        }
    } else {
        //Pause animation
        self.innerHTML = 'PLAY';
        for (let i = 0; i < balls.length; i++) {
            Velocity(balls[i], "stop", true);
        }
        is_playing = false;
    }

    // Animation has ended method
    // Return the total prime numbers and reset the needed flags
    var animationHasEnded = function(elem) {
        var total_primes = 0;
        self.innerHTML = 'PLAY';
        current_duration = 100;
        elem_ended = 0;
        anim_ended = true;
        anim_started = false;
        is_playing = false;

        for (let i = 0; i < balls.length; i++) {
            if (checkIfPrimeNumber(balls[i].childNodes[0].innerHTML)) {
                total_primes++;
            }
        }

        document.getElementById("total-primes").innerHTML = total_primes;
    }
}

createBalls();
