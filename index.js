const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
// const uploadMiddleware = require("./middlewares/uploadMiddleware"); // Importer le middleware
const { readAllFiles } = require("./DataMapper/readAllFiles"); // Importer la fonction readAllFiles

const PORT = 22445;

// on va configurer Express pour pouvoir utiliser le moteur de vues EJS
app.set("view engine", "ejs");

// Une fois le moteur de vue sélectionner, il va falloir dire à Express dans quel dossier
// se trouvent les vues qu'on va vouloir afficher
app.set("views", "./views");

// Pour pouvoir utiliser du CSS sur nos pages, on va également devoir ajouter
// une ligne de configuration dans notre serveur:
app.use(express.static("public"));

// grace à notre moteur de vue, on va pouvoir utiliser la méthode "render"
app.get("/", (request, response) => {
  response.render("home");
});
// Nouvelle route pour gérer le téléversement de fichier
app.post("/upload", (req, res) => {
  // Appel de la méthode pour lire tous les fichiers du dossier InputData
  readAllFiles();
  res.sendStatus(200); // Répondre avec un statut de succès
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
