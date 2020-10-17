var mysql = require('mysql');
const dotenv = require('dotenv');
const path = require ('path');

dotenv.config({path: './.env'});

const dbConnexion = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port : "8889",
    //socketPathest disponible sur la page d'acceuil du MAMP local
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
    strict: false //permet d'entrer des valeurs NULL pour les champs dare
});

//verification de la connexion a la base
dbConnexion.connect((err) => {
if(err) {
    console.log(err.message);
}else {
    console.log("Connexion à la base réussie")
}
});
//liste des variables qui vont etre exportees
//nom de l'export : variables exportees

module.exports = dbConnexion