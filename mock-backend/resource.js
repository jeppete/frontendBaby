const express = require('express');
const app = express();
const port = 3001;

const cors = require('cors');
app.use(cors());

app.get('/sleep_logs.csv', (_req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.send(`awake,time
0,1747152000
1,1747155600
0,1747159200
1,1747162800
0,1747166400
1,1747170000
0,1747173600
1,1747177200
0,1747180800
1,1747184400
0,1747188000
1,1747191600
0,1747195200
1,1747198800
0,1747202400
`);
});

app.get('/sleep_logs_forecasted.csv', (_req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.send(`awake,time
0,1670956744
1,1670959042
0,1670967172
1,1670975558
0,1670980074
1,1670980295
0,1670980507
1,1694730184
0,1694730385
1,1694730566
0,1694730918
1,1694731099
0,1694731321
1,1694731512
`);
});

app.listen(port, () => {
  console.log(`Mock backend listening at http://localhost:${port}`);
});
