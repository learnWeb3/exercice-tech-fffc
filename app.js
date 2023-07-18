
// Pour une présentation de notre outil de conversion
// nous utilisons un page web il nous faut donc la libraire http afin de créer notre serveur
const http = require('http');


// On importe les données que l'on souhaite convertir
const datas = require('./DATAS/liste.txt');

// On importe la fonction pour générer la conversion
const fileconvert = require();

// On peut enregistrer le port dans une variable
const PORT = 3000;

// Création de notre serveur
const server = http.createServer((req, res) => {

    // On court-circuite l'appel automatique du navigateur au favicon.ico
    if (req.url === '/favicon.ico') {
        res.writeHead(200, { 'Content-Type': 'image/x-icon' });
        res.end();
        return;
    }

    // On envoi les header de la réponse http
    // ici nous voulons une réponse de type text encodé en UTF-8
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    // On écrit l'entête de notre page html
    res.write('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge">    <title>Document</title></head><body>');

    // Corps de la page
    res.write(fileconvert())

    // On écrit le pied de page de notre page html
    res.write('</body></html>');

    // On à fini d'envoyer nos informations au client
    res.end();
});

// Notre serveur sera sur le port 3000
server.listen(PORT);
