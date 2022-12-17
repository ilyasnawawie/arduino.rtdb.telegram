// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyB8jKumbYyKaOb3Ap7ZF3xpAdxZJ_ls8zc",
  authDomain: "gas-mq7.firebaseapp.com",
  databaseURL: "https://gas-mq7-default-rtdb.firebaseio.com",
  projectId: "gas-mq7",
  storageBucket: "gas-mq7.appspot.com",
  messagingSenderId: "283159719369",
  appId: "1:283159719369:web:f40b8faec6e915a11f0c18"
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the Realtime Database
var rtdb = firebase.database();
var rtdbRef = rtdb.ref("Sensor MQ7");

// Read all the child nodes of the "Sensor MQ7" node
rtdbRef.once("value", function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    // Read the known child nodes of the current child node
    var coConcentration = childSnapshot.child("MQ7").val();
    var latitude = childSnapshot.child("latitude").val();
    var longitude = childSnapshot.child("longitude").val();
    var time = childSnapshot.child("time").val();

    // Create a new row in the table
    var row = document.createElement("tr");

    // Add the data to the cells
    var timeCell = document.createElement("td");
    timeCell.innerHTML = time;
    row.appendChild(timeCell);

    var locationCell = document.createElement("td");
    locationCell.innerHTML = latitude + ", " + longitude;
    row.appendChild(locationCell);

    var mq7Cell = document.createElement("td");
    mq7Cell.innerHTML = coConcentration;
    row.appendChild(mq7Cell);

    // Add the row to the table body
    document.getElementById("data-table").getElementsByTagName("tbody")[0].appendChild(row);
  });
});

// Modify the menu
document.querySelectorAll(".menu a").forEach(function(menuItem) {
  menuItem.addEventListener("click", function(event) {
    event.preventDefault();
    document.querySelectorAll(".menu a").forEach(function(item) {
      item.classList.remove("active");
    });
    menuItem.classList.add("active");
  });
});
