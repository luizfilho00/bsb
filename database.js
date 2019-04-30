const sqlite = require("sqlite-sync");

class Database {
    constructor() {
        sqlite.connect("db.db");
    }

    /**
     * Verifica se usuario e senha bate com usuario e senha da tabela gerente no banco
     * @param {String} usuario
     * @param {String} senha
     */
    verificarGerente(usuario, senha) {
        console.log("Autenticando...");
        var result;
        sqlite.run("SELECT * FROM gerente;", rows => {
            result = rows[0];
        });
        if (usuario == result.usuario && senha == result.senha) {
            return true;
        } else return false;
    }

    /**
     * Verifica se usuario e senha bate com usuario e senha da tabela cliente no banco
     * @param {String} usuario
     * @param {String} senha
     */
    verificarCliente(conta, digito, senha) {
        const result = sqlite.run(`SELECT * FROM conta WHERE numero = ${conta}`);
        if (result.length > 0) {
            if (senha == result[0].senha && digito == result[0].digito) return true;
        }
        return false;
    }

    /**
     * Insere novo cliente no banco
     * @param {Object} cliente
     */
    insertCliente(cliente) {
        let id = sqlite.insert("cliente", {
            nome: cliente.nome,
            apelido: cliente.apelido
        });
        return id;
    }

    /**
     * Insere nova conta no banco
     * @param {Object} cliente
     */
    insertConta(conta) {
        console.log(conta);
        let id = sqlite.insert("conta", {
            cliente: conta.cliente.id,
            numero: conta.numero,
            digito: conta.digito,
            senha: conta.senha,
            saldo: conta.saldo,
            cheque_especial: conta.chequeEspecial
        });
        return id >= 0;
    }

    /**
     * Remove conta do banco
     * @param {Integer} idConta
     */
    removerConta(idConta) {
        let conta = this.getData("conta", "id", idConta);
        let cliente = this.getData("cliente", "id", conta.cliente);
        const resultCliente = sqlite.delete("cliente", {
            id: cliente.id
        });
        const resultConta = sqlite.delete("conta", {
            id: conta.id
        });
        return resultCliente >= 0 && resultConta >= 0;
    }

    /**
     * Atualiza tabela no banco de dados
     * @param {String} tabela
     * @param {Integer} id
     * @param {String} campo
     * @param {String} novoValor
     */
    update(tabela, id, campo, novoValor) {
        let obj = {};
        obj[campo] = novoValor;
        const result = sqlite.update(tabela, obj, { id: id });
        return result >= 0;
    }

    /**
     * Retorna objeto do banco de dados
     * @param {String} tabela
     * @param {String} campo
     * @param {String} valor
     */
    getData(tabela, campo, valor) {
        const result = sqlite.run(`SELECT * FROM ${tabela} WHERE ${campo} = ${valor}`);
        if (result.length == 0) {
            return null;
        }
        return result[0];
    }

    /**
     * Select all
     */
    selectAll(tabela) {
        const result = sqlite.run(`SELECT * FROM ${tabela}`);
        if (result.length == 0) return false;
        return true;
    }

    /**
     * Criar banco
     */
    criarBanco(valor) {
        const result = sqlite.insert("banco", {
            nome: "Banco Seguro do Brasil",
            lastro: valor
        });
        return result >= 0;
    }

    /**
     * Criar gerente
     */
    criarGerente(gerente) {
        const result = sqlite.insert("gerente", gerente);
        return result >= 0;
    }
}

module.exports = Database;
