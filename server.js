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
      note_id: uuid(),
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

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in adding note');
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/db/db.json'))
});

// Bonus - Delete Note
// app.delete('/api/notes/:id', (req, res) => {
//   const notes = JSON.parse(fs.readFileSync('./db/db.json'));
//   const delNote = notes.filter((rmvNote) => rmvNote.id !== req.params.id);
//   fs.writeFileSync('./db/db.json', JSON.stringify(delNote));
//   res.json(delNote);
// });

// Listener
app.listen(PORT, () =>
  console.log(`Serving app at http://localhost:${PORT}`)
);
