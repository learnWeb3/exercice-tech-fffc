const express = require("express");
const app = express();
const PORT = 2345;

// on va configurer Express pour pouvoir utiliser le moteur de vues EJS
app.set("view engine", "ejs");

// Une fois le moteur de vue sélectionner, il va falloir dire à Express dans quel dossier
// se trouvent les vues qu'on va vouloir afficher
app.set("views", "./views");

// Pour pouvoir utiliser du CSS sur nos pages, on va également devoir ajouter
// une ligne de configuration dans notre serveur:
app.use(express.static("public"));

app.get("/", (request, response) => {
  // grace à notre moteur de vue, on va pouvoir utiliser la méthode "render"
  // pour choisir la vue qu'on souhaite afficher
  response.render("home");
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
