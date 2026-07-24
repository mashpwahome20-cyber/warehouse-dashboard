const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Render assigns its own port automatically; 3000 is only used when running locally
const DATA_FILE = path.join(__dirname, 'data.json');

// Lets the server understand JSON sent from the browser
app.use(express.json());

// Serves everything inside the "public" folder (your index.html lives there)
app.use(express.static(path.join(__dirname, 'public')));

// ---- Read the saved data file, or return null if it doesn't exist yet ----
function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return null;
  }
}

// ---- GET: the browser asks "what's the current data?" ----
app.get('/api/state', (req, res) => {
  const data = readData();
  res.json(data); // null means "nothing saved yet, use your defaults"
});

// ---- POST: the browser says "here's the latest data, please save it" ----
app.post('/api/state', (req, res) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
  res.json({ ok: true });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running! Open this in your browser: http://localhost:' + PORT);
});
