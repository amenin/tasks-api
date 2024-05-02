const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require("fs");

const app = express();
app.use(bodyParser.json());

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

const tasks = [
    { id: 1, title: 'Faire les courses', description: 'Acheter des légumes et du lait' },
    { id: 2, title: 'Répondre aux e-mails', description: 'Vérifier la boîte de réception' },
    { id: 3, title: 'Préparer la présentation', description: 'Slides pour la réunion' },
  ];

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    res.status(404).json({ message: 'Tâche non trouvée' });
  } else {
    res.json(task);
  }
});

app.post('/tasks', (req, res) => {
  const newTask = req.body;
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const updatedTask = req.body;
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    res.status(404).json({ message: 'Tâche non trouvée' });
  } else {
    tasks[taskIndex] = updatedTask;
    res.json(updatedTask);
  }
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    res.status(404).json({ message: 'Tâche non trouvée' });
  } else {
    tasks.splice(taskIndex, 1);
    res.status(204).send();
  }
});

const port = 8024
const portHTTPS = 8027

app.listen(port, async () => { console.log(`HTTP Server started at port ${port}.`) })

try {
    var privateKey = fs.readFileSync( '/etc/httpd/certificate/exp_20240906/dataviz_i3s_unice_fr.key' );
    var certificate = fs.readFileSync( '/etc/httpd/certificate/exp_20240906/dataviz_i3s_unice_fr_cert.crt' );
    var ca = fs.readFileSync( '/etc/httpd/certificate/exp_20240906/dataviz_i3s_unice_fr_AC.cer' );
    var options = {key: privateKey, cert: certificate, ca: ca};
    https.createServer( options, function(req,res)
    {
        app.handle( req, res );
    } ).listen( portHTTPS, async () => { console.log(`HTTPS Server started at port ${portHTTPS}.`) } );
} catch(e) {
    console.log(e);
    console.log("Could not start HTTPS server")
}
