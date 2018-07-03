//Rock Paper Scissors Javascript Code utilizing JQuery and Firebase


//Global variable definitions

var username = '';
var usernameList = [];
var playerOne = '';
var playerTwo = '';
var viewers = [];
var playerOneChoice = '';
var playerTwoChoice = '';
var playerOneReady = false;
var playerTwoReady = false;
var gameStage = '';
var playerOneTie = 0;
var playerTwoTie = 0;
var playerOneWins = 0;
var playerOneLosses = 0;
var playerTwoWins = 0;
var playerTwoLosses = 0;

//Document.ready function
$(document).ready(function () {


    //Player Screen Testing Section (hide visibility of certain screens)
    //$('#welcome-page').hide();
    $('#player1-box').hide();
    $('#player2-box').hide();
    $('#viewer-box').hide();

    //Firebase access configuration

    var config = {
        apiKey: "AIzaSyCy1mTp-IGels0EDD7ATtGfFpJzgxGZ0NE",
        authDomain: "rps-multiplayer-51996.firebaseapp.com",
        databaseURL: "https://rps-multiplayer-51996.firebaseio.com",
        projectId: "rps-multiplayer-51996",
        storageBucket: "",
        messagingSenderId: "189633094220"
    }

    firebase.initializeApp(config);

    var database = firebase.database();

    //Variable updates from firebase

    database.ref().on('value', function (snapshot) {
        //set initial usernameList value

        if (snapshot.child("usernameList").exists()) {
            usernameList = [];
            var tempUserList = snapshot.val().usernameList.usernameList;

            usernameList = tempUserList;
        } else {
            usernameList = [];
        }

        //set initial playerOne and playerTwo value
        if (snapshot.child("playerOne").exists()) {
            var playerOneRef = snapshot.val().playerOne;
            playerOne = playerOneRef.playerOne;
        } else {
            playerOne = '';
        }

        if (snapshot.child("playerTwo").exists()) {
            var playerTwoRef = snapshot.val().playerTwo;
            playerTwo = playerTwoRef.playerTwo;
        } else {
            playerTwo = '';
        }

        //set initial value of viewers array
        if (snapshot.child("viewers").exists()) {
            var tempViewers = snapshot.val().viewers.viewers;
            viewers = tempViewers;
        } else {
            viewers = [];
        }

        // //set initial values of playerOne and playerTwo choices
        // if (snapshot.child("playerOneChoice").exists()) {
        //     var playerOneChoiceRef = database.ref('/playerOneChoice');
        //     playerOneChoiceRef.set({
        //         playerOneChoice: playerOneChoice
        //     });
        // } else {
        //     playerOneChoice = '';
        // };

        // if (snapshot.child("playerTwoChoice").exists()) {
        //     var playerTwoChoiceRef = database.ref('/playerTwoChoice');
        //     playerTwoChoiceRef.set({
        //         playerTwoChoice: playerTwoChoice
        //     });
        // } else {
        //     playerTwoChoice = '';
        // };

    });


    //Function to add the username of each user
    $('#play-button').on('click', function (event) {
        event.preventDefault();

        var tempUsername = $('#username-input').val();
        $('#username-input').val('');
        var uniqueName = true;


        //get usernameList variable value from firebase server

        //check to see if user input a username
        if (tempUsername == "") {
            alert('You must enter a username to proceed.');
            uniqueName = false;
        } else { //check to see if the username is unique

            for (i = 0; i < usernameList.length; i++) {
                if (tempUsername == usernameList[i]) {
                    alert('That username is taken. Please choose a new username.')
                    uniqueName = false;
                }
            }
        }

        if (uniqueName == true) {
            $('#welcome-page').fadeOut(500);
            username = tempUsername;
            usernameList.push(username);

            //clear session storage and add the new username to session storage
            sessionStorage.clear();
            sessionStorage.setItem("username", username);

            //send the username to firebase by updating the usernameList array
            var userNameListRef = database.ref('/usernameList');
            userNameListRef.set({
                usernameList: usernameList
            });


            if (playerOne == '') {
                playerOne = username;
                var playerOneRef = database.ref('/playerOne');
                playerOneRef.set({
                    playerOne: playerOne
                });
            } else if (playerTwo == '') {
                playerTwo = username;
                var playerTwoRef = database.ref('/playerTwo');
                playerTwoRef.set({
                    playerTwo: playerTwo
                });
            } else {
                viewers.push(username);
                var viewersRef = database.ref('/viewers');
                viewersRef.set({
                    viewers: viewers
                });
            }
        }

        //Section to show the correct screen to each player

        username = sessionStorage.getItem('username');

        if (username === playerOne) {
            $('#player1-box').delay(501).fadeIn(500);
        } else if (username == playerTwo) {
            $('#player2-box').delay(501).fadeIn(500);
        } else {
            $('#viewer-box').delay(501).fadeIn(500);
        }

    });//play-button click close


    //Begin round when player 1 and player 2 have been set

        //starts game when both player 1 and player 2 have been set
        if (playerOne != '' && playerTwo != '') {
            //'alerts' players to make their choices
            if (username == playerOne || username == playerTwo) {
                $('.player-choose-message').fadeIn(500).delay(2000).fadeOut(500);
                
            };
            // listens for clicks to assign the players choices and passes them to firebase

            //player 1
            $(document).on('click', '.player1-choices', function () {
                playerOneChoice = $(this).attr('data-value');


                var playerOneChoiceRef = database.ref('/playerOneChoice');
                playerOneChoiceRef.set({
                    playerOneChoice: playerOneChoice
                });
                console.log(playerOneChoice);
                $('.player1-choices').fadeOut(250);

            });

            //player 2
            $(document).on('click', '.player2-choices', function () {
                playerTwoChoice = $(this).attr('data-value');


                var playerTwoChoiceRef = database.ref('/playerTwoChoice');
                playerTwoChoiceRef.set({
                    playerTwoChoice: playerTwoChoice
                });
                console.log(playerTwoChoice);
                $('.player2-choices').fadeOut(250);
            });

        } //ends if statement to begin the game when players 1 and 2 are set

        //check the results for player 1 and player 2 and declare a winner
       

            //read in player1 and player2 choices from database

            
            // var tempPlayerOneChoice = snapshot.val().playerOneChoice;
            // playerOneChoice = tempPlayerOneChoice;

            // if (playerOneChoice == 'rock' || playerOneChoice == 'paper' || playerOneChoice == 'scissors') {
            //     playerOneReady = true;
            //     console.log(playerOneChoice);
            // }


//             var tempPlayerTwoChoice = snapshot.val().playerTwoChoice;
//             playerTwoChoice = tempPlayerTwoChoice;

//             if (playerTwoChoice == 'rock' || playerTwoChoice == 'paper' || playerTwoChoice == 'scissors') {
//                 playerTwoReady = true;
//                 console.log(playerTwoChoice);
//             }

//             if (playerOneReady == true && playerTwoReady == true) {
//                 gameStage = 'check-answers';
//             }

//             // if (gameStage == 'check-answers') {

//             //     //if players choose the same
//             //     if (playerOneChoice == playerTwoChoice) {
//             //         playerOneTie = playerOneTie + 1;
//             //         playerTwoTie = playerTwoTie + 1;
//             //         gameStage = '';
//             //         alert('tie');
//             //         resetChoices()

//             //     } else if (playerOneChoice == 'rock') {
//             //         //if player 1 chooses rock
//             //         if (playerTwoChoice == 'paper') {
//             //             playerOneLosses = playerOneLosses + 1;
//             //             playerTwoWins = playerTwoWins + 1;
//             //             gameStage = '';
//             //             alert('player 2 wins');
//             //             resetChoices()
//             //         } else {//checking scissors by elimination
//             //             playerOneWins = playerOneWins + 1;
//             //             playerTwoLosses = playerTwoLosses + 1;
//             //             gameStage = '';
//             //             alert('player 1 wins')
//             //             resetChoices()
//             //         };

//             //     } else if (playerOneChoice == 'paper') {
//             //         //if player 1 chooses paper
//             //         if (playerTwoChoice == 'rock') {
//             //             playerOneWins = playerOneWins + 1;
//             //             playerTwoLosses = playerTwoLosses + 1;
//             //             gameStage = '';
//             //             alert('player 1 wins');
//             //             resetChoices()
//             //         } else {//checking scissors by elimination
//             //             playerOneLosses = playerOneLosses + 1;
//             //             playerTwoWins = playerTwoWins + 1;
//             //             gameStage = '';
//             //             alert('player 2 wins');
//             //             resetChoices()
//             //         };
//             //     } else { //playerOneChoice is scissors by elimination
//             //         if (playerTwoChoice == 'rock') {
//             //             playerOneLosses = playerOneLosses + 1;
//             //             playerTwoWins = playerTwoWins + 1;
//             //             gameStage = '';
//             //             alert('player 2 wins');
//             //             resetChoices()
//             //         } else {//checking paper by elimination
//             //             playerOneWins = playerOneWins + 1;
//             //             playerTwoLosses = playerTwoLosses + 1;
//             //             gameStage = '';
//             //             alert('player 1 wins');
//             //             resetChoices()
//             //         };
//             //     };
//             // }; //end section to check if game is ready to move on

//         }); //end section to check answers when both players have selected

//   //ends if statement to ensure there are two players


//     //function to reset player choices to nothing

//     // function resetChoices() {

//     //     var playerOneChoiceRef = database.ref('/playerOneChoice');
//     //     playerOneChoiceRef.set({
//     //         playerOneChoice: playerOneChoice
//     //     });

//     //     var playerTwoChoiceRef = database.ref('/playerTwoChoice');
//     //     playerTwoChoiceRef.set({
//     //         playerTwoChoice: ''
//     //     });

//     //     playerOneChoice = '';
//     //     playerTwoChoice = '';

//     // }; //close resetChoices functions

}); //Document ready close