const Cliente = require('./cliente');
const readline = require('readline');
const Database = require('./database');


const db = new Database()

const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

console.log("###### Banco Seguro do Brasil ######\n");
console.log("0 - Acessar como Cliente\n1 - Acessar como Gerente");
read.question('Acesso: ', (res) => {
    if (res == 0) return acessoCliente();
    else return acessoGerente();
})

function acessoCliente() {
    console.log("###### Módulo Cliente ######\n");
    read.question('Informe sua conta: ', (c) => {
        var conta = c;
        read.question('Informe o digito verificador: ', (d) => {
            digito = d;
        })
    })
    console.log("Bem vindo ");
    return true;
}

function acessoGerente() {
    console.log("###### Módulo Gerente ######");
    read.question('login: ', (user) => {
        read.question('senha: ', (pass) => {
            if (db.verificarGerente(user, pass)) {
                exibirMenuGerente();
            }
            else {
                console.error("Falha na autenticação!");
                process.exit();
            }
            read.close();
        });
    });
}

function exibirMenuGerente() {
    console.log("Bem vindo Gerente!");
}