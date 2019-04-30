class Conta {
    constructor(cliente, numero, digito, senha, saldo, chequeEspecial) {
        this.cliente = cliente;
        this.digito = digito;
        this.numero = numero;
        this.senha = senha;
        this.saldo = saldo;
        this.chequeEspecial = chequeEspecial;
    }

    //Contas são criadas por padrão com saldo = 0 e cheque especial = 100
    static criarConta(cliente, senha) {
        const contaGerada = Conta.gerarNumero();
        const numeroConta = contaGerada[0];
        const digito = contaGerada[1];
        return new Conta(cliente, numeroConta, digito, senha, 0, 0);
    }

    /**
     * Gera numero aleatório para conta com dígito verificador válido
     */
    static gerarNumero() {
        const random = Math.floor(Math.random() * 90000) + 10000;
        const soma = random
            .toString()
            .split("")
            .map(Number)
            .reduce((a, b) => a + b);
        const digitoVerificador = soma % 10;
        const numeroConta = random.toString();
        return [numeroConta, digitoVerificador];
    }

    /**
     * Verifica se o dígito verificador da conta é um dígito válido
     * @param {string} conta
     * @param {string} digito
     */
    verificarDigito(conta, digito) {
        var soma = conta
            .toString()
            .split("")
            .map(Number)
            .reduce((a, b) => a + b, 0);
        var digitoEsperado = soma % 10;
        if (digito != digitoEsperado) return false;
        return true;
    }

    print() {
        return this.numero + "-" + this.digito;
    }
}

module.exports = Conta;
