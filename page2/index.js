const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const port = 3000;

// Servir archivos estáticos
app.use(express.static('public'));

// Ruta para obtener los datos del archivo CSV
app.get('/data', (req, res) => {
  const results = [];

  fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json(results);
    });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
