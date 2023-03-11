const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const term = require('./db/db.json');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Create New Note
app.post('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./db/db.json'));
  const newNotes = req.body;
  newNotes.id = uuid.v4();
  notes.push(newNotes);
  fs.writeFileSync('./db/db.json', JSON.stringify(notes))
  res.json(notes);
});

// Routes
app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(_dirname, '/db/db.json'))
});

// Bonus - Delete Note
app.delete('/api/notes/:id', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./db/db.json'));
  const delNote = notes.filter((rmvNote) => rmvNote.id !== req.params.id);
  fs.writeFileSync('./db/db.json', JSON.stringify(delNote));
  res.json(delNote);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// Listener
app.listen(PORT, () =>
  console.log(`Serving app at http://localhost:${PORT}!`)
);





// Maybe a way to GET and POST tasks from db.json
// // GET request for reviews
// app.get('/api/reviews', (req, res) => {
//   // Inform the client
//   res.json(`${req.method} request received to get reviews`);

//   // Log our request to the terminal
//   console.info(`${req.method} request received to get reviews`);
// });

// // POST request for reviews
// app.post('/api/reviews', (req, res) => {
//   // Inform the client that their POST request was received
//   res.json(`${req.method} request received to add a review`);

//   // Log our request to the terminal
//   console.info(`${req.method} request received to add a review`);
// });
