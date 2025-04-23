const express = require('express');
const cors = require('cors');


const app = express();

app.use(express.static('dist'));


app.use(express.json());
app.use(cors());


let notes = [
    {
        id: "1",
        content: "HTML is easy",
        important: true
    },
    {
        id: "2",
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: "3",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

app.get('/', (req, resp) => {
    resp.send('<h1>Hello World</h1>');
}
);
app.get('/api/notes', (req, resp) => {
    resp.json(notes);
}
);

app.get('/api/notes/:id', (req, resp) => {
    const id = req.params.id;
    const note = notes.find(note => note.id === id);
    if (note) {
        resp.json(note);
    } else {
        resp.status(404).end();
    }
}
);

app.delete('api/notes/:id', (req, resp) => {
    const id = req.params.id;
    notes = notes.filter(note => note.id !== id);
    resp.status(204).end();
}
);

app.post('/api/notes', (req, resp) => {
    const note = req.body;


    if (!note || !note.content) {
        return resp.status(400).json({
            error: 'content missing'
        });
    }
    if (notes.find(n => n.content === note.content)) {
        return resp.status(400).json({
            error: 'note must be unique'
        });
    }

    const generateId = () => {
        const maxId = notes.length > 0
            ? Math.max(...notes.map(n => parseInt(n.id)))
            : 0;
        return maxId + 1;
    }

    const newNote = {
        id: generateId(),
        content: note.content,
        important: note.important || false
    };

    notes = notes.concat(newNote);
    resp.json(newNote);
}
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});