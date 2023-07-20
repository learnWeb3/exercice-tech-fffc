const multer = require("multer");

// Configurer Multer pour gérer les téléversements de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "InputData"); // Sauvegarder le fichier dans le dossier "InputData"
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Utiliser le nom de fichier original
  },
});

// Créer le middleware d'upload
const uploadMiddleware = multer({ storage }).single("file");

module.exports = uploadMiddleware;
