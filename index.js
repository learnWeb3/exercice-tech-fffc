const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { zip } = require("zip-a-folder");
const uploadMiddleware = require("./middlewares/uploadMiddleware"); // Importer le middleware
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
app.post("/upload", uploadMiddleware, async (req, res) => {
  try {
    const errors = await readAllFiles(); // Utilisation de 'await' pour attendre la résolution de la promesse
    res.json(errors); // Renvoyer les erreurs sous forme de tableau JSON
  } catch (error) {
    res.sendStatus(500); // Répondre avec un statut d'erreur 500
  }
});
app.get("/download", async (req, res) => {
  const outputFolderPath = path.join(__dirname, "public", "OutputData");
  const tempFolderPath = path.join(__dirname, "temp"); // Dossier temporaire pour stocker l'archive ZIP
  const outputFilePath = path.join(tempFolderPath, "fichiers_convertis.zip");

  try {
    // Vérifier si le dossier temporaire existe, sinon le créer
    if (!fs.existsSync(tempFolderPath)) {
      fs.mkdirSync(tempFolderPath);
    }

    // Créer l'archive ZIP du dossier 'OutputData' contenant les fichiers convertis
    await zip(outputFolderPath, outputFilePath);

    // Envoyer l'archive ZIP au client pour le téléchargement avec les en-têtes appropriés
    res.download(outputFilePath, "fichiers_convertis.zip", (err) => {
      if (err) {
        console.error("Erreur lors du téléchargement du fichier :", err);
        return res.sendStatus(500);
      }

      // Une fois le téléchargement terminé, supprimer le dossier temporaire et son contenu
      fs.rmdir(tempFolderPath, { recursive: true }, (err) => {
        if (err) {
          console.error(
            "Erreur lors de la suppression du dossier temporaire :",
            err
          );
        }
      });
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'archive ZIP :", error);
    return res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
