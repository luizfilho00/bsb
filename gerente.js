const Cliente = require('./cliente');
const Conta = require('./conta');
const read = require('./helpers');
const Database = require('./database');

module.exports = class Gerente {

    constructor() {
        this.db = new Database();
    }

    exibirMenu() {
        console.log("Bem vindo Gerente!\n\n");
        console.log("################ MENU ################\n");
        console.log("1 - Criar novo cliente");
        read.question('Menu: ', (opcao) => {
            switch (opcao) {
                case '1':
                    this.criarCliente();
                    break;
            }
        });
    }

    async criarCliente() {
        read.question('Nome: ', (nome) => {
            read.question('Apelido: ', (apelido) => {
                var cliente = new Cliente(nome, apelido);
                var id = await this.db.insertCliente(cliente);
                console.log('id: ' + id);
                this.criarConta(cliente);
            });
        });
    }

    criarConta(cliente) {
        read.question('Senha: ', (senha) => {
            read.question('Confirmar senha: ', (confirma) => {
                if (confirma === senha) {
                    var conta = Conta.criarConta(cliente, senha);
                    console.log(`Conta: ${conta.print()}`);
                    this.db.insertConta(conta, cliente);
                } else {
                    console.log("As senhas não conhecidem, tente novamente.");
                    return criarConta();
                }
            });
        })
    }
}