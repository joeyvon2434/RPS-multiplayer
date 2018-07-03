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
var gameStage = 0;



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
            gameStage = 0;
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


        //Function to add usernames and populate players on the welcome screen

        //Click to add username
        $('#play-button').on('click', function (event) {
            event.preventDefault();

            console.log('yyyy');

            var tempUsername = $('#username-input').val()
            $('#username-input').val();
            var uniqueName = true;
            console.log('unique ' +uniqueName);

            //check to see if username entered is unique
            if (tempUsername == "") {
                alert('You must enter a username to proceed.');
                uniqueName = false;
            } else { //check previously added usernames vs new name
                console.log('xxx');
                for (i = 0; i < usernameList.length; i++) {
                    if (tempUsername == usernameList[i]) {
                        alert('That username is taken. Please enter another username.');
                        uniqueName = false;
                    }
                }
            };//end of checking username for uniqueness

            //Fade out the welcom screen and add username to list
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


        });//end of onClick when adding players




    }); // close setting initial values and updates


    //Stage 1, Start game


    //Stage 2, wait for selections


    //Stage 3, compare selections


    //Stage 4 show winner / calculate stats


    //Stage 5, Prepare for next round and reset to stage 1



}); //close document ready function