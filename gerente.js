const Conta = require("./conta");
const readline = require("readline");
const Database = require("./database");

const db = new Database();
const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const verificarTabelas = () => {
    if (db.selectAll("banco")) {
        if (db.selectAll("gerente")) return acesso();
        else return criarGerente();
    } else {
        if (db.criarBanco(20000)) {
            if (db.selectAll("gerente")) return acesso();
            else return criarGerente();
        }
    }
    console.log("Houve um erro ao acessar o banco de dados, tente novamente mais tarde.");
    process.exit(0);
};

const criarGerente = () => {
    console.log("Não há nenhum gerente, por favor crie um:\n");
    read.question("Login: ", usuario => {
        read.question("Senha: ", senha => {
            const gerente = { usuario, senha };
            if (db.criarGerente(gerente)) {
                console.log("\nGerente criado com sucesso!\n");
                acesso();
            } else {
                console.log(
                    "\nHouve um erro ao tentar criar o gerente, tente novamente mais tarde.\n"
                );
            }
        });
    });
};

const acesso = () => {
    console.log("\n########### Módulo Gerente ###########");
    read.question("login: ", user => {
        read.question("senha: ", pass => {
            if (db.verificarGerente(user, pass)) {
                exibirMenu();
            } else {
                console.error("Falha na autenticação!");
                acesso();
            }
        });
    });
};

verificarTabelas();

const exibirMenu = () => {
    console.log("\n################ MENU ################\n");
    console.log("1 - Criar novo cliente");
    console.log("2 - Alterar apelido de um cliente");
    console.log("3 - Alterar conta de um cliente");
    console.log("4 - Alterar limite de cheque especial");
    console.log("5 - Alterar senha de uma conta");
    console.log("6 - Remover conta");
    read.question("Menu: ", opcao => {
        switch (opcao) {
            case "1":
                criarCliente();
                break;
            case "2":
                alterarApelido();
                break;
            case "3":
                alterarConta();
                break;
            case "4":
                alterarLimite();
                break;
            case "5":
                alterarSenha();
                break;
            case "6":
                removerConta();
                break;
            case "exit":
                process.exit(0);
            default:
                exibirMenu();
        }
    });
};

const criarCliente = () => {
    read.question("Nome: ", nome => {
        read.question("Apelido: ", apelidoInput => {
            let cliente = { nome, apelido: apelidoInput.toLowerCase() };
            let clienteId = db.insertCliente(cliente);
            if (clienteId < 0) {
                console.log("Erro ao inserir novo Cliente.");
                return criarCliente();
            }
            cliente.id = clienteId;
            criarConta(cliente);
        });
    });
};

const criarConta = cliente => {
    read.question("Senha: ", senha => {
        if (senha.length < 4) {
            console.log("A senha deve ter no mínimo 4 dígitos, tente novamente.\n");
            return criarConta();
        }
        read.question("Confirmar senha: ", confirma => {
            if (confirma === senha) {
                let conta = Conta.criarConta(cliente, senha);
                if (db.insertConta(conta)) {
                    console.log("\nConta criada com sucesso!\n" + conta.print() + "\n");
                } else {
                    console.log("Erro ao criar conta, tente novamente.\n");
                }
                return exibirMenu();
            } else {
                console.log("As senhas não conhecidem, tente novamente.");
                return criarConta();
            }
        });
    });
};

const alterarApelido = () => {
    read.question("Número da conta do cliente: ", inputConta => {
        if (inputConta == "exit") return exibirMenu();
        const conta = db.getData("conta", "numero", inputConta);
        const clienteId = conta.cliente;
        if (clienteId == null) {
            return alterarApelido();
        } else {
            read.question("Novo apelido: ", apelido => {
                const result = db.update("cliente", clienteId, "apelido", apelido);
                if (result) console.log("\nApelido alterado com sucesso!\n");
                else console.log("\nErro ao alterar apelido, tente novamente.\n");
                return exibirMenu();
            });
        }
    });
};

const alterarConta = () => {
    read.question("Número da conta do cliente: ", numeroConta => {
        if (numeroConta == "exit") return exibirMenu();
        const conta = db.getData("conta", "numero", numeroConta);
        const cliente = db.getData("cliente", "id", conta.cliente);
        if (cliente == null || conta == null) {
            return alterarConta();
        } else {
            const novaConta = Conta.criarConta(cliente, conta.senha);
            console.log("\nNova conta: " + novaConta.numero + "-" + novaConta.digito);
            const updateNumero = db.update("conta", conta.id, "numero", novaConta.numero);
            const updateDigito = db.update("conta", conta.id, "digito", novaConta.digito);
            if (updateNumero && updateDigito) console.log("\nConta alterada com sucesso!");
            else console.log("\nErro ao alterar apelido, tente novamente.\n");
            return exibirMenu();
        }
    });
};

const alterarLimite = () => {
    read.question("Conta do cliente: ", input => {
        if (input == "exit") return exibirMenu();
        const conta = db.getData("conta", "numero", input);
        if (conta == null) return alterarLimite();
        console.log(`Limite atual: R$${conta.cheque_especial}`);
        read.question("Novo limite: ", input => {
            if (Number.parseFloat(input) < Number.parseFloat(conta.cheque_especial)) {
                console.log("\nNão é permitido abaixar o limite!\n");
            } else {
                let banco = db.getData("banco", "nome", `"Banco Seguro do Brasil"`);
                if (input > 0 && input < banco.lastro) {
                    if (db.update("conta", conta.id, "cheque_especial", input)) {
                        db.update(
                            "banco",
                            banco.id,
                            "lastro",
                            Number.parseFloat(banco.lastro - input)
                        );
                        console.log("\nLimite alterado com sucesso!\nNovo limite: R$" + input);
                    } else {
                        console.error("\nErro ao alterar o limite, tente novamente mais tarde.\n");
                    }
                } else {
                    console.log("\nValor não permitido\n");
                }
            }
            return exibirMenu();
        });
    });
};

const removerConta = () => {
    read.question("Conta que deseja remover: ", input => {
        if (input == "exit") return exibirMenu();
        const conta = db.getData("conta", "numero", input);
        if (conta == null) {
            console.log("\nConta não encontrada!\n");
            return removerConta();
        }
        if (db.removerConta(conta.id)) {
            console.log("\nConta removida com sucesso!\n");
            let banco = db.getData("banco", "nome", `"Banco Seguro do Brasil"`);
            const novoLastro =
                Number.parseFloat(banco.lastro) + Number.parseFloat(conta.cheque_especial);
            db.update("banco", banco.id, "lastro", novoLastro);
        } else console.log("Erro ao remover conta, tente novamente mais tarde...");
        return exibirMenu();
    });
};

const alterarSenha = () => {
    read.question("Número da conta: ", input => {
        if (input == "exit") return alterarSenha();
        const conta = db.getData("conta", "numero", input);
        if (conta == null) return alterarSenha(conta);
        read.question("Senha: ", senha => {
            if (senha.length < 4) {
                console.log("A senha deve ter no mínimo 4 digitos.\n");
                return alterarSenha();
            }
            read.question("Confirme a senha: ", confirma => {
                if (senha === confirma) {
                    if (db.update("conta", conta.id, "senha", senha) >= 0) {
                        console.log("\nSenha alterada com sucesso!\n");
                        return exibirMenu();
                    }
                    console.log("Erro ao modificar senhas, tente novamente\n");
                    return alterarSenha();
                }
                console.log("As senhas não são idênticas, tente novamente\n");
                return alterarSenha();
            });
        });
    });
};
