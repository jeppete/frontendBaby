const express = require('express');
const app = express();
const cors = require('cors');

const PORT = 5000; // match with REACT_APP_BACKEND_IP:5000

app.use(cors());

// Simulated video stream endpoints (use placeholder images or dummy paths)
app.get('/video_feed/raw', (req, res) => {
  res.redirect('https://placebear.com/640/360');
});

app.get('/video_feed/processed', (req, res) => {
  res.redirect('https://placebear.com/640/360');
});

// Simulate baby presence probabilities
app.get('/getClassificationProbabilities', (req, res) => {
  const present = Math.random() > 0.5 ? 0.9 : 0.1;
  const notPresent = 1 - present;
  const bodyFound = Math.random() > 0.5;
  res.send(`${present},${notPresent},${Date.now()},${bodyFound}`);
});

// Simulate awake probability + reasons
app.get('/getResultAndReasons', (req, res) => {
  const awakeProba = Math.random().toFixed(2);
  const reasons = ['Eyes Open', 'Movement', 'No baby present'];
  const picked = reasons.sort(() => 0.5 - Math.random()).slice(0, 2);
  res.send([awakeProba, ...picked].join(','));
});

app.get('/getAvrgTime', (req, res) => {
  res.send(23575);
});

app.get('/getSleepNotificationsEnabled', (req, res) => {
  res.send('true'); // or 'false' based on what you want to test
});

// Simulate retraining endpoints
app.get('/retrainWithNewSample/:classification', (req, res) => {
  console.log(`Received retraining sample: ${req.params.classification}`);
  res.sendStatus(200);
});

// Set/reset AI focus region
app.get('/setAIFocusRegion/:region', (req, res) => {
  console.log(`Set focus region to: ${req.params.region}`);
  res.sendStatus(200);
});

app.get('/setAIFocusRegion/reset', (req, res) => {
  console.log('Reset focus region');
  res.sendStatus(200);
});


app.listen(PORT, () => {
  console.log(`Mock backend running on http://localhost:${PORT}`);
});
