const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
