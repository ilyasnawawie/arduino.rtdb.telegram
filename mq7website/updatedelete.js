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
var rtdbRef = rtdb.ref("Contacts");

// Read all the child nodes of the "Contacts" node
rtdbRef.once("value", function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    // Read the known child nodes of the current child node
    var email = childSnapshot.child("Email").val();
    var np = childSnapshot.child("NP").val();
    var name = childSnapshot.child("Name").val();

    // Create a new row in the table
    var row = document.createElement("tr");

    // Add the email, NP, and name values to cells in the row
    var emailCell = document.createElement("td");
    emailCell.innerHTML = email;
    row.appendChild(emailCell);

    var npCell = document.createElement("td");
    npCell.innerHTML = np;
    row.appendChild(npCell);

    var nameCell = document.createElement("td");
    nameCell.innerHTML = name;
    row.appendChild(nameCell);

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