// TODO : Je crée une méthode pour selectionner les fichiers à uploader et les sauvegarder dans le dossier InputData
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
// Dans cet objet de configuration, la clé storage est utilisée pour spécifier comment les fichiers téléversés doivent être sauvegardés sur le serveur
//.single("file"): C'est une méthode de multer qui indique que l'application s'attend à recevoir un seul fichier sous le champ
const uploadMiddleware = multer({ storage }).single("file");

module.exports = uploadMiddleware;
