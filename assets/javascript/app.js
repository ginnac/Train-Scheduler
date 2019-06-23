
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

//database...
var dataRef = firebase.database();

//global variables for name, destination, and first train time...:

var name;
var destination;
var firstTrainTime;

//function to read firebase, in this case we have appended childs in firebase so we are working with "child_added"
dataRef.ref().on("child_added", function (childSnapshot) {
  //var frequency for frequency of our trains...
  var frequency; 
  console.log({ childSnapshot: childSnapshot.key });
  console.log(childSnapshot);
  //snapshotKey.key is a unique value of each child added, let's use it to distinguish each child from another, used when updating the dom with setInterval
  var snapshotKey = childSnapshot.key;
  // getting values from snapshot in firebase, they are childs so childSnapshot.Val().property
  name = childSnapshot.val().name;
  destination = childSnapshot.val().destination;
  frequency = childSnapshot.val().frequency;
  firstTrainTime = childSnapshot.val().firstTrainTime;
  //momentum js
  // lets pushed back 1 year to make sure it happens in the past
  var backInTime = moment(firstTrainTime, "HH:mm").subtract(1, "years");
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
  console.log(minutesUntilTrain);

  // Next Train coming
  var comingTrain = moment().add(minutesUntilTrain, "minutes");
  
  //  console.log(moment(comingTrain).format("hh:mm"));
  console.log({ comingTrain });
  var trainArrivalTime = moment(comingTrain).format('HH:mm a');
  console.log(trainArrivalTime);

  // append to the DOM
  var tr;
  tr = $('<tr/>');
  tr.attr("id","tr-" + snapshotKey + "");
  tr.append("<td class='name'>" + name + "</td>");
  tr.append("<td>" + destination + "</td>");
  tr.append("<td>" + frequency + "</td>");
  tr.append("<td class='train-time-" + snapshotKey + "''>" + trainArrivalTime + "</td>");
  tr.append("<td id='minTillTrain-" + snapshotKey + "'>" + minutesUntilTrain + "</td>");
  tr.append("<td> <button id='btn-" + snapshotKey + "'> Remove </button>"+ "</td>")

  $("#tables-rows").append(tr);

//updating the dom every minute
  setInterval(function () { 
    if(--minutesUntilTrain<=0){
      minutesUntilTrain=frequency;
      //updating next trainArrivalTime in the DOM
      trainArrivalTime=moment().add(frequency, "minutes").format('HH:mm a');
      $(`.train-time-${snapshotKey}`).text(trainArrivalTime);
    }
     //updating minutes left in the DOM 
    $(`#minTillTrain-${snapshotKey}`).text(minutesUntilTrain);
    //console log to see if the following variables are updating everyminute
    console.log(differenceInTime,snapshotKey,minutesUntilTrain,trainArrivalTime);
  }, 60000);

  $("#btn-" + snapshotKey + "").on("click",function(){
    alert("hola!");
    $("#tr-"+snapshotKey+"").remove();
    childSnapshot.getRef().remove();
    });

  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});





//submit on click take value, display it on the dom and set/push it to firebase
$("#submit").on("click", function (event) {
  event.preventDefault();
  //get the values from the user
  name = $("#train-name").val().trim();
  destination = $("#destination").val().trim();
  firstTrainTime = $("#first-train-time").val().trim();
  var frequency = $("#frequency").val().trim();
  // moment.js below... getting.
  console.log(frequency);
  console.log(firstTrainTime);
  // lets pushed back 1 year to make sure it happens in the past
  var backInTime = moment(firstTrainTime, "HH:mm").subtract(1, "years");
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
  console.log(minutesUntilTrain);

  // Next Train coming
  var comingTrain = moment().add(minutesUntilTrain, "minutes");
  console.log(moment(comingTrain).format("hh:mm"));
  var trainArrivalTime = moment(comingTrain).format("hh:mm");
  console.log(trainArrivalTime);
  // }


  // lets get the name of the trains uploaded dinamically
  var nameClass = $(".name");
  for (var i = 0; i < nameClass.length; i++) {
    var lass = nameClass.eq(i).text();
    console.log(lass);
  }

  //if name of the train has already been added then you cant re- add it- 
  if (lass === name) {
    alert("Sorry, The train name is already in the list!");
  }
  //else you can! and then let's set or push (write) properties and values in firebase;
  else {
    dataRef.ref().push({

      name: name,
      destination: destination,
      frequency: frequency,
      firstTrainTime: firstTrainTime,

    });
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");



  }

});
