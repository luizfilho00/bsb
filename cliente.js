const Database = require("./database");
const readline = require("readline");

const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const db = new Database();
let conta, cliente, numeroConta;

console.log("\n########### Módulo Cliente ###########");
const acesso = () => {
    read.question("Conta: ", numeroInput => {
        read.question("Digito verificador: ", digito => {
            read.question("senha: ", senha => {
                console.log("\nAutenticando...\n");
                numeroConta = numeroInput;
                conta = atualizarConta();
                if (conta == null) {
                    console.log("\nConta não encontrada em nosso banco de dados...\n");
                    return acesso();
                }
                cliente = db.getData("cliente", "id", conta.cliente);
                if (db.verificarCliente(numeroInput, digito, senha)) {
                    exibirMenu();
                } else {
                    console.error("Falha na autenticação!");
                    return acesso();
                }
            });
        });
    });
};

acesso();

const atualizarConta = () => {
    conta = db.getData("conta", "numero", numeroConta);
    if (conta == null) return null;
    conta.saldo = Number.parseFloat(conta.saldo);
    conta.cheque_especial = Number.parseFloat(conta.cheque_especial);
    return conta;
};

const exibirMenu = () => {
    conta = atualizarConta();
    console.log("\n################ MENU ################\n");
    printConta();
    console.log("1 - Realizar saque");
    console.log("2 - Depositar dinheiro");
    console.log("3 - Consultar saldo");
    console.log("4 - Alterar Nome");
    read.question("Menu: ", opcao => {
        switch (opcao) {
            case "1":
                read.question("Valor: R$", valor => {
                    sacar(valor);
                });
                break;
            case "2":
                read.question("Valor: R$", valor => {
                    depositar(valor);
                });
                break;
            case "3":
                saldo();
                break;
            case "4":
                read.question("Novo Nome: ", nome => {
                    alterarNome(nome);
                });
                break;
            case "exit":
                process.exit(0);
            default:
                exibirMenu();
        }
    });
};

const sacar = valor => {
    valor = Number.parseFloat(valor);
    if (valor > 1000) {
        console.log("\nPermitido apenas R$1000,00 por saque.");
        return exibirMenu();
    }
    if (valor > conta.saldo + conta.cheque_especial) {
        console.log("\nSaldo insuficiente...");
        return exibirMenu();
    }
    const saldoAtual = conta.saldo - valor;

    if (saldoAtual < 0) {
        conta.cheque_especial += saldoAtual;
        conta.saldo = 0;
    } else {
        conta.saldo = saldoAtual;
    }

    if (db.update("conta", conta.id, "saldo", conta.saldo)) {
        db.update("conta", conta.id, "cheque_especial", conta.cheque_especial);
        console.log(`\nSaque efetuado com sucesso!\n`);
    } else {
        console.log("\nHouve um erro ao processar sua solicitação, por favor tente novamente");
    }
    return exibirMenu();
};

const depositar = valor => {
    valor = Number.parseFloat(valor);
    if (valor > 3000) {
        console.log("Permitido apenas depósitos de até R$3000,00");
        return exibirMenu();
    }
    const novoSaldo = conta.saldo + valor;
    if (db.update("conta", conta.id, "saldo", novoSaldo)) {
        console.log(`\nDepósito efetuado com sucesso!\n`);
        return exibirMenu();
    }
    console.log("\nHouve um erro ao processar sua solicitação, por favor tente novamente");
    return exibirMenu();
};

const saldo = () => {
    console.log(`Saldo: R$${conta.saldo}\nCheque Especial: R$${conta.cheque_especial}\n`);
    return exibirMenu();
};

const alterarNome = nome => {
    if (db.update("cliente", cliente.id, "nome", nome)) {
        cliente.nome = nome;
        console.log("\nNome alterado com sucesso!\n");
    } else {
        console.log("\nErro ao alterar nome, tente novamente.\n");
    }
    return exibirMenu();
};

const printConta = () => {
    console.log(
        `Cliente: ${cliente.nome}\nConta: ${conta.numero}-${conta.digito}\nSaldo: R$${
            conta.saldo
        }\nCheque Especial: R$${conta.cheque_especial}\n`
    );
};
