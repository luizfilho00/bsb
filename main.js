const Cliente = require('./cliente');

var conta = process.argv[2];
var senha = process.argv[3];

if (conta == undefined || senha == undefined) {
    console.error('Por favor informe a conta e senha!');
    process.exit();
}