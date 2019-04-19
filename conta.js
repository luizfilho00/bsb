class Conta {

    constructor(conta, senha, saldo, chequeEspecial) {
        this.conta = conta;
        this.senha = senha;
        this.saldo = saldo;
        this.chequeEspecial = chequeEspecial;
        this.LIMITE_DEPOSITO = 3000;
        this.LIMITE_SAQUE = 1000;
    }

    getSaldo() { return this.saldo; }
    getChequeEspecial() { return this.chequeEspecial; }
    _getDigito() { return this.digitoVerificador };
    getConta() { return this.conta; }

    //Contas são criadas por padrão com saldo = 0 e cheque especial = 100
    static criarConta(senha) {
        var conta = Conta.gerarNumero();
        return new Conta(conta, senha, 0, 100);
    }

    /**
     * Gera numero aleatório para conta com dígito verificador válido
     */
    static gerarNumero() {
        var random = Math.floor(Math.random() * 90000) + 10000;
        var soma = random.toString().split('').map(Number).reduce((a, b) => a + b);
        var digitoVerificador = soma % 10;
        this.digitoVerificador = digitoVerificador;
        var numeroConta = random.toString();
        return numeroConta;
    }

    /**
     * Verifica se o dígito verificador da conta é um dígito válido
     * @param {string} conta 
     * @param {string} digito 
     */
    _verificarDigito(conta, digito) {
        var soma = conta.toString().split('').map(Number).reduce((a, b) => a + b, 0);
        var digitoEsperado = soma % 10;
        if (digito != digitoEsperado) return false;
        return true;
    }

    /**
     * Verifica se a senha passada é a mesma da conta armazenada no banco de dados
     * @param {string} senha 
     */
    _conferirSenha(senha) {
        if (senha == this.senha) return true;
        return false;
    }

    /**
     * Verifica se essa conta existe no banco de dados
     * @param {string} conta 
     */

    static contaExiste(conta) {
        //TODO -> Se a conta existe no banco de dados retorna true
    }

    static _checarLogin() {
        if (contaExiste(conta) && conferirSenha(senha)) {

        }
    }

    /**
     * Incrementa valor em saldo se o valor é <= 3000
     * @param {FloatNumber} valor 
     */
    depositar(valor) {
        if (parseFloat(valor) == NaN) {
            console.error("Insira um valor válido!");
            return false;
        }
        if (valor > LIMITE_DEPOSITO) {
            console.log("Valor limite para depósitos: " + LIMITE_DEPOSITO);
            return false;
        }
        this.saldo += valor;
        console.log("Depósito efetuado com sucesso!\nSaldo: " + this.getSaldo());
        return true;
    }

    print() {
        return this.conta + '-' + this._getDigito();
    }
}

module.exports = Conta;