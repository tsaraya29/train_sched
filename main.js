console.log("This is loaded");

var db = firebase.database();

var train = "";
var destination = "";
var firstTrain = 0;
var freq = 0;
var currentTime = moment();

$("#submit").on("click", function(event) {
  event.preventDefault();
  train = $("#name").val().trim();
  destination = $("#destination").val().trim();
  firstTrain = $("#firstTrain").val().trim();
  freq = $("#freq").val().trim();  


//clear entries
$("#name").val("");
$("#destination").val("");
$("#firstTrain").val("");
$("#freq").val("");

setInterval(function(){
  $("#current-time").html(moment(moment()).format("hh:mm:ss"));
}, 1000);

// add to firebase
db.ref().push({
  train: train,
  destination: destination,
  firstTrain: firstTrain,
  freq: freq
});

db.ref().on("child_added", function(param) {

  //calculations   
    var firstTime = moment(param.val().firstTrain, "hh:mm").subtract(1, "days");
  
     var timeDiff = moment().diff(moment(firstTime), "minutes");
      //console.log("Difference in time: " + timeDiff);
  
      var remainder = timeDiff % param.val().freq;
      //console.log("Remainder: " + remainder);
  
      var minutesAway = param.val().freq - remainder;
      //console.log("Time till Train: " + minsUntilTrain);
  
      var nextTrainTime = moment().add(minutesAway, "minutes");
      //console.log("Next arrival: " + moment(nextTrainTime).format("hh:mm"));

      $("#schedule > tbody").append("<tr><td>" + param.val().train+ 
      "</td><td>" + param.val().destination + 
      "</td><td>" + param.val().freq + 
      "</td><td>" + moment(nextTrainTime).format("hh:mm") + "</td><td>" + minutesAway + " Minutes</td></tr>");
      });
    });