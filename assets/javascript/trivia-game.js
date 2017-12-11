//--- JavaScript for a trivia game---//


//when document ready, start game
$(document).ready(function() {
    $('#play').on('click', game.restart);
});

//object main
game = {
    // time allowed to answer each question
    maxTime: 30,

    //array of questions and answers with image

    questions: [
        {
            question: 'Which mountain has the highest paved road in'
                + ' North America?',
            options: ['Mt Evans', 'Pikes Peak', 'Mt Shasta', 'Mt Rainier', 'Smoky Mountain',
                'Mt Rushmore'],
            answer: 0,
            image: 'q0.jpg',

          },
        {
            question: 'Which food does Denver claim was invented whithin the'
                + ' municpality in 1935',
            options: ['Shrimp Cocktail', 'Rocky Mountain Oysters',
                'CheeseBurger', 'Green Chile', 'Corndogs'],
            answer: 2,
            image: 'q1.jpg',
        },
        {
            question: 'Who owns 1/3 of all the land in Colorado',
            options: ['The Denver Broncos', 'Catholic Church', 'US Government',
                'Coors'],
            answer: 2,
            image: 'q2.jpg',
        },
        {
            question: 'What mountain view inspired Katherine Lee Bates\'s'
                + ' America The Beautiful?',
            options: ['Mt Evans', 'Pikes Peak', 'Mt Shasta', 'Mt Rainier','Mt Rushmore'],
            answer: 1,
            image: 'q3.png',
        },
        {
            question: 'Which city has the largest parks system in'
                + ' the nation?',
            options: ['Colorado Springs',  'Fort Collins',
                'Boulder', 'Parker', 'Denver'],
            answer: 4,
            image: 'q4.jpg',
        },
        {
            question: 'In which city is the United States Air'
                + ' Force Academy located?',
            options: ['Colorado Springs',  'Fort Collins',
                  'Boulder', 'Parker', 'Denver'],
            answer: 0,
            image: 'q5.jpg',
        },
        {
            question: 'Where is the worlds largest flat top mountain?',
            options: ['Durango', 'Mesa Verde', 'Grand Mesa', 'Taos'],
            answer: 2,
            image: 'q6.jpg',
        },

    ],

    restart: function() {
        //stop countdown timer if it happens to be running
        game.clockRunning = false;
        //reset starting values
        game.round = 0;
        game.score = 0;
        //hide play button when game starts
        $('#play').hide();
        //start new round
        game.newRound();
    },

    newRound: function() {
        //check if there are questions left, if so...
        if (game.questions.length > game.round) {
            game.round++;

            //refresh display values for new question
            $('#score').html(game.score + ' / ' + game.round);
            $('#questionTitle').html('Question #' + game.round);
            $('#question').html(game.questions[game.round - 1].question);
            $('#link').html('<img src="assets/images/'
                + game.questions[game.round - 1].image + '">'
            );
            $('#answerTitle').html('Answer Choices:');

            //create buttons
            game.renderButtons();

            //start timer
            game.timer.restart();

        //if no questions left, game over
        } else {
            game.end();
        }
    },

    renderButtons: function() {
        //create answer choice buttons with class 'btn' and id
            $('#answer').empty();
            $.each(game.questions[game.round - 1].options, function(i, val) {
                var li = $('<li>');
                var button = $('<button>');
                //add on click event for all with class 'btn'
                button.addClass('btn');
                button.attr('id','btn-' + i);
                button.attr('onclick', 'game.guess(' + i + '); return false;');
                button.html(val);
                li.append(button);
                $('#answer').append(li);

            //enable answer choice buttons
            $(".btn").prop("disabled", false);
            })
    },

    guess: function(i) {
        //upon click of answer choice button...
        game.timer.stop();
        $(".btn").prop("disabled", true);

        //if guessed answer is correct...
        if (i === game.questions[game.round - 1].answer) {
            //increase score and refresh screen values
            game.score++;
            $('#score').html(game.score + ' / ' + game.round);

            $('#answerTitle').html('Correct!');

            //animate correct answer background color
            $('#btn-' + i).animate({
                backgroundColor: "#80ff80"
            }, 1000);

            //wait then start new round
            setTimeout(game.newRound, 5000);

        //if guessed answer is incorrect...
        } else {
            //refresh screen values
            $('#answerTitle').html('Incorrect!');

            //animate incorrect answer background color
            $('#btn-' + i).animate({
                backgroundColor: "#ff80bf"
            }, 1000).animate({
                backgroundColor: 'auto'
            }, 1000);

            //wait then animate correct answer background color
            setTimeout(function() {
                $('#btn-' + game.questions[game.round - 1].answer).animate({
                    backgroundColor: "#80ff80"
                }, 1000);
            }, 2000);

            //wait then start new round
            setTimeout(game.newRound, 7000);
        }
    },

    timeout: function() {
        //when timer runs out, disable buttons
        $('.btn').prop('disabled', true);

        //animate correct answer background color
        $('#btn-' + game.questions[game.round - 1].answer).animate({
            backgroundColor: "#0A6535"
        }, 1000);

        //wait then start new round
        setTimeout(game.newRound, 7000);
    },

    end: function() {
        //when game is over, disable buttons
        $('.btn').prop('disabled', true);

        //refresh display values
        $('#time').html('00:00');
        $('#answer').empty();
        $('#questionTitle').html(
            'Final Score: '
            + game.score + ' / '
            + game.round
        );
        $('#question').empty();
        $('#link').html('<img src="assets/images/end.jpg">');
        $('#answerTitle').empty();

        //show button to restart game
        $('#play').html('Play Again?');
        $('#play').show();
    },

    timer: {

        restart: function() {
            // reset timer to max allowed time
            game.timer.time = game.maxTime;
            var converted = game.timer.timeConverter(game.timer.time);
            $('#time').text(converted);
            if (!game.clockRunning) {
                game.clockRunning = true;
                intervalId = setInterval(game.timer.count, 1000);
            }
        },

        count: function() {
            if (game.timer.time === 0) {
                game.timer.stop();
                game.timeout();
            }

            else {
                // Increment time by 1, remember we cant use "this" here.
                game.timer.time--;
                // Get the current time, pass that into the
                // timer.timeConverter function, and save the result in a
                // variable.
                var converted = game.timer.timeConverter(game.timer.time);
                // Use the variable we just created to show the converted time
                // in the "time" element.
                $('#time').text(converted);
            }
        },

        timeConverter: function(t) {
            var minutes = Math.floor(t / 60);
            var seconds = t - (minutes * 60);

            if (seconds < 10) {
              seconds = '0' + seconds;
            }

            if (minutes === 0) {
              minutes = '00';
            }
            else if (minutes < 10) {
              minutes = '0' + minutes;
            }

            return minutes + ':' + seconds;
        },

        stop: function() {
            clearInterval(intervalId);
            game.clockRunning = false;
        },
    },
}
