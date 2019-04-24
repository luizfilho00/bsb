const Cliente = require('./cliente');
const read = require('./helpers');
const Database = require('./database');
const Gerente = require('./gerente');

const gerente = new Gerente();
const db = new Database();

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

async function acessoGerente() {
    console.log("###### Módulo Gerente ######");
    read.question('login: ', (user) => {
        read.question('senha: ', (pass) => {
            if (db.verificarGerente(user, pass)) {
                gerente.exibirMenu();
            }
            else {
                console.error("Falha na autenticação!");
                process.exit();
            }
        });
    });
}

