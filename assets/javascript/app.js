//Rock Paper Scissors Javascript Code utilizing JQuery and Firebase


//Global variable definitions

var usernameList = [];
var playerOne = '';
var playerTwo = '';
var viewers = [];

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
        console.log(snapshot.val());
        if (snapshot.child("usernameList").exists()) {
            usernameList=[];
            var tempUserList = snapshot.val().usernameList.usernameList;
            console.log(tempUserList);
            usernameList = tempUserList;
            console.log('here ' + usernameList)
        } else {
            usernameList = [];
        }

        //set initial playerOne and playerTwo value
        if (snapshot.child("playerOne").exists()) {
            playerOne = snapshot.val().playerOne;
        } else {
            playerOne = '';
        }

        if (snapshot.child("playerTwo").exists()) {
            playerTwo = snapshot.val().playerTwo;
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

    });




    //Function to add the username of each user
    $('#play-button').on('click', function (event) {
        event.preventDefault();

        var username = $('#username-input').val();
        var uniqueName = true;


        //get usernameList variable value from firebase server

        //check to see if user input a username
        if (username == "") {
            alert('You must enter a username to proceed.');
            uniqueName = false;
        } else { //check to see if the username is unique

            for (i = 0; i < usernameList.length; i++) {
                if (username == usernameList[i]) {
                    alert('That username is taken. Please choose a new username.')
                    uniqueName = false;
                }
            }
        }

        if (uniqueName == true) {
            usernameList.push(username);

            //clear session storage and add the new username to session storage
            sessionStorage.clear();
            sessionStorage.setItem("username", username);

            //send the username to firebase by updating the usernameList array
            var userNameListRef = database.ref('/usernameList');
            userNameListRef.set({
                usernameList: usernameList
            });
        }

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


    });//play-button click close

}); //Document ready close