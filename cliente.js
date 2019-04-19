const Conta = require("./conta");

module.exports = class Cliente {
    constructor(id, nome, apelido, senha) {
        this.conta = Conta.criarConta(senha);
        this.id = id;
        this.nome = nome;
        this.apelido = apelido;
        this.digitoVerificador = conta._getDigito();
        this.senha = senha;
        this.saldoAtual = this.conta.getSaldo();
        this.chequeEspecial = this.conta.getChequeEspecial();
    }

    getNome() { return this.nome; }
    getApelido() { return this.apelido; }
    getConta() { return this.conta.getConta(); }
    getSaldo() { return this.conta.getSaldo(); }
    getChequeEspecial() { return this.conta.getChequeEspecial(); }

    toString() {
        var header = 'Conta \t\t| Cliente \t| Saldo \t| Cheque Especial\n';
        return `${header}${this.getConta()} \t| ${this.getNome()} \t\t| R$ ${this.getSaldo()} \t\t| ${this.getChequeEspecial()}`;
    }

}