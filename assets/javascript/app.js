
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
  // Difference between the times now.diff(past time, "in min, days, years???");
  var differenceInTime = moment().diff(moment(backInTime), "minutes");
  // remainder
  var remainderTime = differenceInTime % frequency;
  // Minute Until Train
  var minutesUntilTrain = frequency - remainderTime;
  // Next Train coming
  var comingTrain = moment().add(minutesUntilTrain, "minutes");
  //  console.log(moment(comingTrain).format("hh:mm"));
  var trainArrivalTime = moment(comingTrain).format('HH:mm a');

  // append to the DOM
  var tr;
  tr = $('<tr/>');
  tr.attr("id","tr-" + snapshotKey + "");
  tr.append("<td class='name'id='name-" +snapshotKey+ "'>" + name + "</td>");
  tr.append("<td id='destination-" +snapshotKey+ "'>" + destination + "</td>");
  tr.append("<td id='frequency-" + snapshotKey+ "'>" + frequency + "</td>");
  tr.append("<td id='train-time-" + snapshotKey + "''>" + trainArrivalTime + "</td>");
  tr.append("<td id='minTillTrain-" + snapshotKey + "'>" + minutesUntilTrain + "</td>");
  tr.append("<td id='btnColumn-" +snapshotKey + "'> <button id='btn-" + snapshotKey + "'> Remove </button>"+ "<br><button id='btnEdit-" + snapshotKey + "'> Edit</button></td>");

  $("#tables-rows").append(tr);

  //updating the dom every minute
  setInterval(function () { 
    if(--minutesUntilTrain<=0){
      minutesUntilTrain=frequency;
      //updating next trainArrivalTime in the DOM
      trainArrivalTime=moment().add(frequency, "minutes").format('HH:mm a');
      $(`#train-time-${snapshotKey}`).text(trainArrivalTime);
    }
    //updating minutes left in the DOM 
    $(`#minTillTrain-${snapshotKey}`).text(minutesUntilTrain);
    //console log to see if the following variables are updating everyminute
    console.log(differenceInTime,snapshotKey,minutesUntilTrain,trainArrivalTime);
  }, 60000);

  //function to remove specific child (childSnapshot)
  $("#btn-" + snapshotKey + "").on("click",function(){
    //remove it from the DOM
    $("#tr-"+snapshotKey+"").remove();
    //removing it from firebase
    childSnapshot.getRef().remove();
  });

    //fuction to edit specific values in each child (childSnapshot)
    $("#btnEdit-" + snapshotKey + "").on("click",function(){
      //append new button to save changes in the burton column...
      $(`#btnColumn-${snapshotKey}`).append("<button id='btnSave-" + snapshotKey + "'>Save</button>");
      //removing text and creating input element so user can create new inputs...
      $(`#name-${snapshotKey}`).text("");
      $(`#name-${snapshotKey}`).html('<input type="trainName" class="form-control" id="train-name-new" placeholder="">');
      $(`#destination-${snapshotKey}`).text("");
      $(`#destination-${snapshotKey}`).html('<input type="train-destination" class="form-control" id="destination-new" placeholder="">');     
      $(`#frequency-${snapshotKey}`).text("");
      $(`#frequency-${snapshotKey}`).html('<input type="frequency-min" class="form-control" id="frequency-new" placeholder="">');     
      $(`#train-time-${snapshotKey}`).text("");
      $(`#train-time-${snapshotKey}`).html('<input type="first-train" class="form-control" id="first-train-time-new" placeholder="">');
      //hide edit button becuase before editing again they have to save the changes
      $("#btnEdit-" + snapshotKey + "").hide();
      //function to save changes
      $("#btnSave-"+ snapshotKey + "").on("click",function(){
        //lets grab user's inputs and store it in the correct variables
        name = $("#train-name-new").val().trim();
        destination = $("#destination-new").val().trim();
        firstTrainTime = $("#first-train-time-new").val().trim();
        frequency = $("#frequency-new").val().trim();
        //print it in the Dom
        $(`#name-${snapshotKey}`).text(name);
        $(`#destination-${snapshotKey}`).text(destination);
        $(`#frequency-${snapshotKey}`).text(frequency);
        $(`#train-time-${snapshotKey}`).text(firstTrainTime);
        //merge it in our datatbase firebase...we are just updating childSnapshot..
        childSnapshot.getRef().update({
          name: name,
          destination: destination,
          frequency: frequency,
          firstTrainTime: firstTrainTime,
        });
        //reloading page...
        location.reload(true);
      });

    });   

  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});



//when user adds a new value, submit, will display it on the dom and then push it to firebase database
$("#submit").on("click", function (event) {
  event.preventDefault();
  //get the values from the user
  name = $("#train-name").val().trim();
  destination = $("#destination").val().trim();
  firstTrainTime = $("#first-train-time").val().trim();
  var frequency = $("#frequency").val().trim();

  // moment.js below... getting.
  // lets pushed back 1 year to make sure it happens in the past
  var backInTime = moment(firstTrainTime, "HH:mm").subtract(1, "years");
  // Difference between the times now.diff(past time, "in min, days, years???");
  //console.log(moment().format());
  var differenceInTime = moment().diff(moment(backInTime), "minutes");
  // remainder
  var remainderTime = differenceInTime % frequency;
  // Minute Until Train
  var minutesUntilTrain = frequency - remainderTime;
  // Next Train coming (trainArrivalTime)
  var comingTrain = moment().add(minutesUntilTrain, "minutes");

  var trainArrivalTime = moment(comingTrain).format("hh:mm");
  console.log(trainArrivalTime);

  // lets get the name of the trains uploaded dynamically
  var nameClass = $(".name");
  for (var i = 0; i < nameClass.length; i++) {
    var nameC = nameClass.eq(i).text();
    console.log(nameC);
  }

  //if name of the train has already been added then you cant re- add it- 
  if (nameC === name) {
    $("#name-taken").html("<h3>The train name is already in the list. Please add a Train that is not in the schedule</h3>");
  }
  //else you can send it to the firebase database! we should include properties and values;
  else {
  
    dataRef.ref().push({

      name: name,
      destination: destination,
      frequency: frequency,
      firstTrainTime: firstTrainTime,

    });
    //input values should clear up after being submited to firebase database
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");
  }

});
