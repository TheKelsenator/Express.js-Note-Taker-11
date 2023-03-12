const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const term = require('./db/db.json');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Create New Note
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request reveived to add a new note`);
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('Successfully added note!')
        );
      }
    });
    const response = {
      status: 'success',
      body: newNote,
    };
    console.info(response);
    res.status(200).json(response);
  } else {
    res.status(500).json('Error in adding note');
  }
});

// Retrieves the landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Retrieves the notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
})

// Retrieves notes input
app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/db/db.json'))
});

// Bonus - Delete Note


// Listener
app.listen(PORT, () =>
  console.log(`Serving app at http://localhost:${PORT}`)
);
