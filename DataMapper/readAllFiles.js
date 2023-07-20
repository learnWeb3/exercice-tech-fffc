// import.js
const dayjs = require("dayjs");
const fs = require("fs");
const { writeFile, rename } = require("fs/promises");
const path = require("path");
let errors = [];
let hasErrors = false;

// Valeur max des chaines de caractères
const MAX_FIRSTNAME_LENGTH = 15;
const MAX_LASTNAME_LENGTH = 15;
const MAX_WEIGHT_LENGTH = 5;

const NEW_SEPARATOR = ",";

// J'ajoute en premier lieu une fonction qui me permettra de créer une boucle et de lire tous les fichiers contenus dans le dossier InputData
async function readAllFiles() {
  try {
    const inputDirectory = path.join(__dirname, "../InputData");
    const files = fs.readdirSync(inputDirectory);

    // Je crée une boucle pour lire chaque fichier
    for (const file of files) {
      hasErrors = false; // !!!RESET de la variable à false pour chaque nouveau fichier traité
      const filePath = `${inputDirectory}/${file}`;
      const fileContent = fs.readFileSync(filePath, "utf-8");

      const processedData = await processThefile(file, fileContent);

      // Je définis dans quel dossier iront mes fichiers traités
      console.log("hasErrors : ", hasErrors);
      const outputDirectory = hasErrors
        ? "public/OutputDataError"
        : "public/OutputData";
      await createDirectory(outputDirectory);

      // Je renomme mes fichiers txt en fichier csv après l'execution de ma méthode
      const outputFile = file.replace(/\.[^.]+$/, ".csv");
      const outputFilePath = `${outputDirectory}/${outputFile}`;
      await writeNewCSV(outputFilePath, processedData);

      // Je crée une condition pour envoyer les fichiers qui ont une erreur dans un dossier différent
      if (hasErrors) {
        const sourceFile = outputFilePath;
        const targetFile = `public/OutputDataError/${outputFile}`;
        await rename(sourceFile, targetFile);
      }
    }
  } catch (e) {
    console.error(e);
  }
  return errors;
}

async function createDirectory(directory) {
  try {
    if (!fs.existsSync(directory)) {
      await fs.promises.mkdir(directory, { recursive: true });
    }
  } catch (e) {
    console.error(e);
  }
}

async function processThefile(filename, fileContent) {
  try {
    // Le contenu traité du fichier sera stocké dans cette variable
    let processedData;

    // Séparation des lignes en fonction des retours à la ligne
    const listLines = fileContent.split(/\r?\n/);
    let newListlines = [];

    listLines.forEach((line, i) => {
      //console.log(`Line from file: ${line}`);

      // Séparation des lignes en fonction des espaces j'ajoute trim pour supprimer les espaces à gauches et à droites
      let dataLine = line.trim().split(" ");
      // console.log("data line :", dataLine);

      // Je met à jours les données
      dataLine = updateData(dataLine, filename, i + 1);

      // Je sépare mes données par le séparateur demandé
      const newLine = dataLine.join(NEW_SEPARATOR);
      // J'ajoute mes données mises à jours dans un nouveau tableau
      newListlines.push(newLine);
    });
    console.log("liste des erreurs : ", errors);

    newListlines = ["Date de naissance,Prénom,Nom,Poids", ...newListlines];

    // Le contenu traité est stocké dans la variable processedData
    processedData = newListlines.join("\r\n");

    // On retourne le contenu traité
    return processedData;
  } catch (e) {
    console.error(e);
  }
}

// Formatage et mise à jour des données
function updateData(refData, filename, numLine) {
  let updatedData = [...refData];

  if (refData.length !== 4) {
    errors.push({
      filename: filename, // filename,
      line: numLine,
      desc: "des données sont manquantes",
    });
    hasErrors = true; // je définis hasErrors sur true en cas d'erreur
    return [];
  }

  const formattedDate = dayjs(refData[0]).format("DD/MM/YYYY");

  updatedData[0] = formattedDate;
  // En une seule ligne => updateData[0] = dayjs(refData[0]).format("DD/MM/YYYY");
  updatedData[1] = updatedData[1].substring(0, MAX_FIRSTNAME_LENGTH);
  updatedData[2] = updatedData[2].substring(0, MAX_LASTNAME_LENGTH);

  const currentWeight = updatedData[3]
    .replace(",", ".")
    .substring(0, MAX_WEIGHT_LENGTH);

  if (isNaN(currentWeight)) {
    errors.push({
      filename: filename, // filename,
      line: numLine,
      desc: "le poids n'est pas une valeur numérique valide",
    });
    hasErrors = true;
  } else {
    updatedData[3] = currentWeight;
  }
  return updatedData;
}

// Appel de la méthode pour réécrire le fichier en csv
async function writeNewCSV(filePath, fileContent) {
  try {
    await writeFile(filePath, fileContent, {
      encoding: "utf8",
    });
    console.log(`Wrote data to ${filePath}`);
  } catch (error) {
    console.error(`Got an error trying to write the file: ${error.message}`);
  }
}
// // On appelle la fonction pour lire tous les fichiers du dossier InputData
// readAllFiles();

exports.readAllFiles = readAllFiles;
