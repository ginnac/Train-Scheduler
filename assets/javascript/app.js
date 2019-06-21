
//firebase - 
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyC2rVWCSnKG5oM0fMumBPVsZoOEjXTKSYc",
    authDomain: "train-scheduler-df130.firebaseapp.com",
    databaseURL: "https://train-scheduler-df130.firebaseio.com",
    projectId: "train-scheduler-df130",
    storageBucket: "train-scheduler-df130.appspot.com",
    messagingSenderId: "320329387571",
    appId: "1:320329387571:web:6f8fdad521dfbae0"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

//objects for each train already typed:

var name;
var destination;
var frequency;
var firstTrainTime;



$("#submit").on("click",function(event){
  event.preventDefault();
//get the values from the user
  name =$("#train-name").val().trim();
  destination = $("#destination").val().trim();
  firstTrainTime= $("#first-train-time").val().trim();
  frequency =$("#frequency").val().trim();
    // moment.js below... getting.
        console.log(frequency);
        console.log(firstTrainTime);
  // lets pushed back 1 year to make sure it happens in the past
  var backInTime= moment(firstTrainTime, "HH:mm").subtract(1, "years");
  console.log(backInTime);

  // Current Time moment();
  var now = moment();
  console.log("CURRENT TIME: " + moment(now).format("hh:mm"));

  // Difference between the times now.diff(past time, "in min, days, years???");
  //console.log(moment().format());
  var differenceInTime = moment().diff(moment(backInTime), "minutes");
  console.log("DIFFERENCE IN TIME: " + differenceInTime);

  // remainder
  var remainderTime = differenceInTime % frequency;
  console.log(remainderTime);

  // Minute Until Train
  var minutesUntilTrain = frequency - remainderTime;
  console.log( minutesUntilTrain);

  // Next Train coming
  var comingTrain = moment().add(minutesUntilTrain, "minutes");
  console.log(moment(comingTrain).format("hh:mm"));
  // }


// update the console:
var tr;
                tr = $('<tr/>');
                tr.append("<td>" + name + "</td>");
                tr.append("<td>" + destination + "</td>");
                tr.append("<td>" + frequency + "</td>");
                tr.append("<td>" + moment(comingTrain).format("hh:mm") + "</td>");
                tr.append("<td>" + minutesUntilTrain + "</td>");
                $("#tables-rows").append(tr);

});

