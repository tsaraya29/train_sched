 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyAqY_cDn9KnKnvPZeHqhhtUWlPQc4xz1dg",
    authDomain: "trainschedule-e29a5.firebaseapp.com",
    databaseURL: "https://trainschedule-e29a5.firebaseio.com",
    projectId: "trainschedule-e29a5",
    storageBucket: "trainschedule-e29a5.appspot.com",
    messagingSenderId: "160276224936"
  };

  firebase.initializeApp(config);

  //a variable to referance the database

  var database = firebase.database();

  //variables from form

var trainName = "";
var destination = "";
var firstTrain = 0;
var frequency = 0;
var currentTime= moment()

// updates clock

setInterval(function(){
        $("#current-time").html(moment(moment()).format("hh:mm:ss"));
    }, 1000);

  // 2. Button for adding Trains
$("#submit").on("click", function(event) {
  event.preventDefault();


	trainName = $("#trainName").val().trim();

	destination = $("#destination").val().trim();

	firstTrain = $("#firstTrain").val().trim();

	frequency = $("#frequency").val().trim();

// Clears all of the text-boxes
  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTrain").val("");
  $("#frequency").val("");




//pushes to database
  database.ref().push({

	    trainName: trainName,
	    destination: destination,
	    firstTrain: firstTrain,
	    frequency: frequency

	});
});

 

database.ref().on("child_added", function(childSnapshot) {

//calculations needed

	var firstTimeConverted = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "days");

 	var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
    //console.log("Difference in time: " + timeDiff);

    var remainder = timeDiff % childSnapshot.val().frequency;
    //console.log("Remainder: " + remainder);

    var minsUntilTrain = childSnapshot.val().frequency - remainder;
    //console.log("Time till Train: " + minsUntilTrain);

    var nextTrainTime = moment().add(minsUntilTrain, "minutes");
    //console.log("Next arrival: " + moment(nextTrainTime).format("hh:mm"));
  		

 // Add each train's data into the table
    $("#schedule > tbody").append("<tr><td>" + childSnapshot.val().trainName + "</td><td>" + childSnapshot.val().destination + "</td><td>" +
        childSnapshot.val().frequency + "</td><td>" + moment(nextTrainTime).format("hh:mm") + "</td><td>" + minsUntilTrain + "</td></tr>");

	     // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);

});