const Cliente = require('./cliente');
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
}

module.exports = Database;