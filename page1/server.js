const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

app.post('/submitData', (req, res) => {
  const { clientName, risk1, risk2 } = req.body;

  if (risk1 >= 1000000000000 && risk1 <= 2000000000000 && risk2 >= 1000000000 && risk2 <= 3499999999) {
    // Read existing data from data.json file
    fs.readFile('data.json', (err, data) => {
      if (err && err.code !== 'ENOENT') {
        console.error('Error reading file:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      // Convert data from file to JSON object
      let existingData = {};
      if (!err) {
        try {
          existingData = JSON.parse(data);
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          res.status(500).send('Internal Server Error');
          return;
        }
      }

      if (Object.keys(existingData).length === 0 && existingData.constructor === Object) {
        // If data.json file is empty, directly save new data
        const newData = {
          [clientName]: {
            risk1: risk1,
            risk2: risk2
          }
        };
        fs.writeFile('data.json', JSON.stringify(newData), (writeErr) => {
          if (writeErr) {
            console.error('Error writing file:', writeErr);
            res.status(500).send('Internal Server Error');
            return;
          }
          console.log('Data written to data.json file');
          // Simulate 30 seconds delay before responding to client
          setTimeout(() => {
            res.status(200).send('Data sent successfully');
          }, 30000);
        });
      } else {
        // Check if data already exists in data.json file
        if (existingData && existingData[clientName] && existingData[clientName].risk1 === risk1 && existingData[clientName].risk2 === risk2) {
          // Duplicate data, send alert with 30 seconds delay
          setTimeout(() => {
            res.status(400).send('Data has already been sent previously');
          }, 30000);
        } else {
          // Save new data only if it is not duplicated
          const newData = {
            [clientName]: {
              risk1: risk1,
              risk2: risk2
            }
          };
          fs.writeFile('data.json', JSON.stringify({ ...existingData, ...newData }), (writeErr) => {
            if (writeErr) {
              console.error('Error writing file:', writeErr);
              res.status(500).send('Internal Server Error');
              return;
            }
            console.log('Data written to data.json file');
            // Simulate 30 seconds delay before responding to client
            setTimeout(() => {
              res.status(200).send('Data sent successfully');
            }, 30000);
          });
        }
      }
    });
  } else {
    res.status(400).send('Invalid Request');

    
  }
});

app.listen(port, () => {
  console.log(`Node.js server listening on port ${port}`);
});
