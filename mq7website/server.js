const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/login', (req, res) => {
  // Get the username and password from the request body
  const username = req.body.username;
  const password = req.body.password;

  // Check if the username and password are both "admin"
  if (username === 'admin' && password === 'admin') {
    // Login was successful, stop the server
    console.log('Stopping server');
    process.exit();
  } else {
    // Login was unsuccessful, send an error message
    res.send({ success: false, message: 'Invalid username or password' });
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
