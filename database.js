const sqlite = require('sqlite-sync');
class Database {

    constructor() {
        sqlite.connect('db.db');
    }

    /**
     * Verifica se usuario e senha bate com usuario e senha da tabela gerente no banco
     * @param {String} usuario 
     * @param {String} senha 
     */
    verificarGerente(usuario, senha) {
        console.log('Autenticando...');
        var result;
        sqlite.run("SELECT * FROM gerente;", (rows) => {
            result = rows[0];
        });
        if (usuario == result.usuario && senha == result.senha) {
            return true;
        }
        else return false;
    }

    async insertCliente(cliente) {
        var id;
        sqlite.insert(
            'cliente',
            {
                nome: cliente.getNome(),
                apelido: cliente.getApelido(),
            },
            id = await async function (res) {
                if (res.error)
                    throw res.error;
                return res;
            }
        );
        return id;
    }

    async insertConta(conta, cliente) {
        console.log(cliente);
        console.log(conta);
        var id;
        sqlite.insert(
            'conta',
            {
                cliente: cliente.getId(),
                numero: conta.getConta(),
                digito: conta.getDigito(),
                senha: conta.getSenha(),
            },
            id = await async function (res) {
                if (res.error)
                    throw res.error;
                return res;
            }
        );
        return id;
    }


}

module.exports = Database;