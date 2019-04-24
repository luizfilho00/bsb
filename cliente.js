const Conta = require("./conta");

module.exports = class Cliente {
    constructor(nome, apelido) {
        this.nome = nome;
        this.apelido = apelido;
    }

    getId() { return this.id; }
    setId(id) { this.id = id; }
    getNome() { return this.nome; }
    getApelido() { return this.apelido; }

    // toString() {
    //     var header = 'Conta \t\t| Cliente \t| Saldo \t| Cheque Especial\n';
    //     return `${header}${this.getConta().print()} \t| ${this.getNome()} \t\t| R$ ${this.getSaldo()} 
    //     \t\t| ${this.getChequeEspecial()}`;
    // }

}