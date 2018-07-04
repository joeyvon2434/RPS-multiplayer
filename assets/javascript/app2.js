//Rock Paper Scissors Multiplayer Javascript attempt 2

//Global Variables

var username = '';
var usernameList = [];
var playerOne = {
    name: '',
    wins: 0,
    losses: 0,
    ties: 0,
    choice: ''
};
var playerTwo = {
    name: '',
    wins: 0,
    losses: 0,
    ties: 0,
    choice: ''
};
var viewers = [];
var gameReady = false;
var gameStage = 'begin';
var playerOneChoice = '';
var result = '';



$(document).ready(function () {

    //Player Screen Testing Section (hide visibility of certain screens)
    //$('#welcome-page').hide();
    $('#player1-box').hide();
    $('#player2-box').hide();
    $('#viewer-box').hide();

    //Initializing Firebase
    var config = {
        apiKey: "AIzaSyCy1mTp-IGels0EDD7ATtGfFpJzgxGZ0NE",
        authDomain: "rps-multiplayer-51996.firebaseapp.com",
        databaseURL: "https://rps-multiplayer-51996.firebaseio.com",
        projectId: "rps-multiplayer-51996",
        storageBucket: "",
        messagingSenderId: "189633094220"
    }

    firebase.initializeApp(config);


    //Stage 0, populate players and viewers


    var database = firebase.database();

    //set current/initial values from/for firebase, and provide updates
    database.ref().on('value', function (snapshot) {

        //Update gameStage
        if (snapshot.child("gameStage").exists()) {
            var gameStageRef = snapshot.val().gameStage;
            gameStage = gameStageRef.gameStage;
        } else {
            gameStage = 'begin';
        };

        //Update result
        if (snapshot.child("result").exists()) {
            var resultRef = snapshot.val().result;
            result = resultRef.resultStage;
        } else {
            result = '';
        };



        //Update usernameList
        if (snapshot.child("usernameList").exists()) {//sets usernameList from firebase
            usernameList = [];

            var tempUserList = snapshot.val().usernameList.usernameList;
            usernameList = tempUserList
        } else { //gives a value if firebase has not stored the list yet
            usernameList = [];
        };

        //set playerOne and playerTwo values
        //playerOne
        if (snapshot.child("playerOne").exists()) {
            var playerOneRef = snapshot.val().playerOne;
            playerOne = playerOneRef.name;
        } else {
            playerOne = '';
        };

        //playerTwo
        if (snapshot.child("playerTwo").exists()) {
            var playerTwoRef = snapshot.val().playerTwo;
            playerTwo = playerTwoRef.name;
        } else {
            playerTwo = '';
        };

        //set viewers list
        if (snapshot.child("viewers").exists()) {
            var tempViewers = snapshot.val().viewers.viewers;
            viewers = tempViewers;
        } else {
            viewers = [];
        };

        //set gameReady initial value
        if (snapshot.child('gameReady').exists()) {
            var tempGameReady = snapshot.val().gameReady.gameReady;
            gameReady = tempGameReady;
        } else {
            gameReady = false;
        }


        //Function to add usernames and populate players on the welcome screen

        //Click to add username
        $('#play-button').on('click', function (event) {
            event.preventDefault();


            var tempUsername = $('#username-input').val()
            $('#username-input').val();
            var uniqueName = true;

            //check to see if username entered is unique
            if (tempUsername == "") {
                alert('You must enter a username to proceed.');
                uniqueName = false;
            } else { //check previously added usernames vs new name
                for (i = 0; i < usernameList.length; i++) {

                    if (tempUsername == usernameList[i]) {
                        alert('That username is taken. Please enter another username.');
                        uniqueName = false;
                    }
                };
            };//end of checking username for uniqueness

            //Fade out the welcom escreen and add username to list
            if (uniqueName == true) {
                $('#welcome-page').fadeOut(500);
                username = tempUsername;
                usernameList.push(username);

                //clear session storage and add the current username
                sessionStorage.clear();
                sessionStorage.setItem("username", username);

                //send the usernameList to firebase
                var usernameListRef = database.ref('/usernameList');
                usernameListRef.set({
                    usernameList: usernameList
                });


                //populate players if they are empty
                if (playerOne == '') {//fill player One
                    playerOne = username;
                    var playerOneRef = database.ref('/playerOne');
                    playerOneRef.set({
                        name: username,
                        wins: 0,
                        losses: 0,
                        ties: 0,
                        choice: ''
                    });
                } else if (playerTwo == '') {//fill player Two
                    playerTwo = username;
                    var playerTwoRef = database.ref('/playerTwo');
                    playerTwoRef.set({
                        name: username,
                        wins: 0,
                        losses: 0,
                        ties: 0,
                        choice: ''
                    });
                } else { //send all other users to viewers
                    viewers.push(username);
                    var viewersRef = database.ref('/viewers');
                    viewersRef.set({
                        viewers: viewers
                    });
                }

            }; //end of uniqueName portion

            //section to start game if players 1 and 2 exist
            //gameStage = begin

            if (playerOne != '' && playerTwo != '') {
                gameReady = true;
                var gameReadyRef = database.ref('/gameReady');
                gameReadyRef.set({
                    gameReady: true
                })

            } else {
                gameReady = false;
            };


        });//end of onClick when adding players


        //Stage 1, Start game (begin stage)

        //verify that game can enter the begin stage and allow player selections
        if (gameReady === true && gameStage === 'begin') {
            if (username === playerOne) {
                $('#player1-box').delay(501).fadeIn(500);
            } else if (username == playerTwo) {
                $('#player2-box').delay(501).fadeIn(500);
            } else if (username != playerOne && username != playerTwo) {
                $('#viewer-box').delay(501).fadeIn(500);
            }

            //read in selections of player 1 and player 2
            //player 1
            $(document).on('click', '.player1-choices', function () {
                playerOneChoice = $(this).attr('data-value');

                var playerOneRef = database.ref('/playerOne');
                playerOneRef.update({
                    choice: playerOneChoice
                });

                $('.player1-choices').fadeOut(500);



            });

            $(document).on('click', '.player2-choices', function () {
                playerTwoChoice = $(this).attr('data-value');

                var playerTwoRef = database.ref('/playerTwo');
                playerTwoRef.update({
                    choice: playerTwoChoice
                });

                $('.player2-choices').fadeOut(500);

            });//end player choices

            //set values for choices from server
            var playerOneRef = snapshot.val().playerOne;
            playerOneChoice = playerOneRef.choice;

            playerTwoRef = snapshot.val().playerTwo;
            playerTwoChoice = playerTwoRef.choice;

            //moves game to the compare stage
            if (playerOneChoice != '' && playerTwoChoice != '') {
                gameStage = 'compare';

                var gameStageRef = database.ref('/gameStage');
                gameStageRef.set({
                    gameStage: gameStage
                });

            } else {
                gameStage = 'begin';

                var gameStageRef = database.ref('/gameStage');
                gameStageRef.set({
                    gameStage: gameStage
                });
            };

        };//end begin stage

        //Stage 2, compare selections

        if (gameReady == true && gameStage == 'compare') {

            console.log('once or twice');
            console.log('p1 ' + playerOneChoice);
            console.log('p2 ' + playerTwoChoice);

            gameStage = 'hold';
            var gameStageRef = database.ref('/gameStage');
            gameStageRef.set({
                gameStage: gameStage
            });


            //ensure only wins and losses are only incremented once
            //by using only player 1 to complete them
            if (username == playerOne && gameStage == 'hold') {
                //check for a tie
                if (playerOneChoice == playerTwoChoice) {
                    result = 'tie';
                    playerOneChoice = '';
                    playerTwoChoice = '';
                    //check P1 choice = rock
                } else if (playerOneChoice == 'rock') {
                    if (playerTwoChoice == 'paper') {
                        result = 'p2win';
                        playerOneChoice = '';
                        playerTwoChoice = '';
                    } else if (playerTwoChoice == 'scissors') {
                        result = 'p1win';
                        playerOneChoice = '';
                        playerTwoChoice = '';
                    }// check P1 choice = paper
                } else if (playerOneChoice == 'paper') {
                    if (playerTwoChoice == 'rock') {
                        result = 'p1win';
                        playerOneChoice = '';
                        playerTwoChoice = '';
                    } else if (playerTwoChoice == 'scissors') {
                        result = 'p2win';
                        playerOneChoice = '';
                        playerTwoChoice = '';
                    }//check P1 choice == scissors by elimination
                } else if (playerOneChoice == 'scissors') {
                    if (playerTwoChoice == 'paper') {
                        result = 'p1win';
                        playerOneChoice = '';
                        playerTwoChoice = '';
                    } else if (playerTwoChoice == 'rock') {
                        result = 'p2win';
                        playerOneChoice = '';
                        playerTwoChoice = '';
                    };
                };




                console.log('result ' + result);



                //update player choice values in firebase


                //update results
                if (result == 'tie') {


                    //pull player 1 ties
                    var playerOneRef = snapshot.val().playerOne;
                    var p1temp = playerOneRef.ties;
                    p1temp = p1temp + 1;
                    //pull player 2 ties
                    playerTwoRef = snapshot.val().playerTwo;
                    var p2temp = playerTwoRef.ties;
                    p2temp = p2temp + 1;

                    //update player 1 and player 2 ties
                    var playerOneRef = database.ref('/playerOne');
                    playerOneRef.update({
                        ties: p1temp,
                    });

                    var playerTwoRef = database.ref('/playerTwo');
                    playerTwoRef.update({
                        ties: p2temp,
                    });

                } else if (result == 'p1win') {

                    //pull player 1 wins
                    var playerOneRef = snapshot.val().playerOne;
                    var p1temp = playerOneRef.wins;
                    p1temp = p1temp + 1;
                    //pull player 2 losses
                    playerTwoRef = snapshot.val().playerTwo;
                    var p2temp = playerTwoRef.losses;
                    p2temp = p2temp + 1;

                    //update player 1 and player 2 wins/losses
                    var playerOneRef = database.ref('/playerOne');
                    playerOneRef.update({
                        wins: p1temp,
                    });

                    var playerTwoRef = database.ref('/playerTwo');
                    playerTwoRef.update({
                        losses: p2temp,
                    });
                } else if (result == 'p2win') {


                    //pull player 1 losses
                    var playerOneRef = snapshot.val().playerOne;
                    var p1temp = playerOneRef.losses;
                    p1temp = p1temp + 1;
                    //pull player 2 wins
                    playerTwoRef = snapshot.val().playerTwo;
                    var p2temp = playerTwoRef.wins;
                    p2temp = p2temp + 1;

                    //update player 1 and player 2 wins/losses
                    var playerOneRef = database.ref('/playerOne');
                    playerOneRef.update({
                        losses: p1temp,
                    });

                    var playerTwoRef = database.ref('/playerTwo');
                    playerTwoRef.update({
                        wins: p2temp,
                    });
                }


            }; //close comparisons in player 1 and calculations

            gameStage = 'results';
            var gameStageRef = database.ref('/gameStage');
            gameStageRef.set({
                gameStage: gameStage
            });

        };//End the compare section of the game

        //begin the output seection of the game called results
        if (gameStage == 'results' && gameReady == true) {

            gameStage = 'hold';
            
            


        }; //end results output section


        //alert everyone with the value of result and reset in firebase


        //Stage 3, show winner / output stats


        //Stage 4, Prepare for next round and reset to stage 1


    }); // close setting initial values and updates

    

}); //close document ready function