const openModal = () => document.getElementById('modal') // aqui ele faz abrir o modal
    .classList.add('active')

// e aqui ele vai fecahr o modal
const closeModal = () => {
    clearFields(); // limpando informações para quando entrar nao estar preenchidas
    document.getElementById('modal').classList.remove('active')

}



// aqui faz comunicação com local storage **
// pega oque ta no banco armazena no db cliente, transforma em jason e envia para variavel db client, - estou colocando o parse porque eu envie em string e tenho que volta ele para o valor
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? [] //se a aplicaçao nao for valido manda o array vazio, aqui ele esta lendo oque ja esta no banco para adicionar outro na frete com o push
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient)); // enviando informação para localstorage - //JSON.stringify: transformando meu objeto em string

// crud create
const createClient = (client) => {
    const dbClient = getLocalStorage() // quando eu quiser trazer os cliente faca isso
    dbClient.push(client); // adicionando mais um cliente  
    setLocalStorage(dbClient);

}

// crud read
 const readClient = () => getLocalStorage(); 


 /* const VisualizarClient = () => { // recebendo o index para saber qual pessoa ta selecionado  

    openModal();

} */

//crud update
const updateClient = (index, client) => { // recebendo o index para saber qual pessoa ta selecionado
    const dbClient = readClient(); // lendo os cliente do banco e colocando nesta variavel
    dbClient[index] = client; // pegando os dados att do cliente
    setLocalStorage(dbClient);

}

// CRUD DELETE

const deleteClient = (index) => {
    const dbClient = readClient() // lendo os clientes
    dbClient.splice(index, 1);
    setLocalStorage(dbClient); // atualizando o banco depois de ter deletado
}

// a partir daqui sera feito o crud relacioando ao layout

const isValidFields = () => {
    return document.getElementById('form').reportValidity();
    // pega o form e verifica se os campo seguem as regras

}

// limpando todos os campos
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field'); //pegando todos os arrays (campos) que achar
    fields.forEach(field => field.value = ""); // pega cada campo pega o valor dele e iguala a vazio
    //vare campo por campo foreach
}

const saveClient = () => {
    if (isValidFields()) { // se as info tiver correto faca
        const client = {  // dados do form, 
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            cidade: document.getElementById('cidade').value,
        }
        const index = document.getElementById('nome').dataset.index // aqui consigo saber se o campo sera salvo ou editado
        if (index == 'new') {
            createClient(client); //salvando
            updateTable(); // atualizando tabls
            closeModal(); // quando apertar em salvar fechar modal

        } else {
            updateClient(index, client);
            updateTable();
            closeModal();
        }

    }
} 


const createRow = (client, index) => { // criando nova linha dentro da tabela - pegando o index de cada elkemento
    const newRow = document.createElement('tr'); // criando uma linha vazia // preenchendo as linhas com os tds
    newRow.innerHTML = ` 
                    <td>${client.nome}</td>
                    <td>${client.email}</td>
                    <td>${client.telefone}</td>
                    <td>${client.cidade}</td>
                    <td>
                        <button type="button" class="button green" id="edit-${index}">Editar</button>
                       
                        <button type="button" class="button red" id="delete-${index}">Excluir</button>
                                            
                    </td>        
    ` //  coloquei o index apara saber em qul index eu estou clicando para alterar ou excluir da tabela
    // inserindo no html a linha
    document.querySelector('#tbClient>tbody').appendChild(newRow); // inserindo ela no tbody

}
const clearTable = () => {
    const rows = document.querySelectorAll('#tbClient>tbody tr') //pegando todas as linhas da tabela
    rows.forEach(row => row.parentNode.removeChild(row)) // pegando o pai e remove o filho de cada um dos elemetos e exclue
}

const updateTable = () => {
    const dbClient = readClient() // lendo os clientes armazendos
    clearTable();
    dbClient.forEach(createRow); // pega todos os cliente  e cria uma linha para cada
}

updateTable(); // quando for acionada

const fillFields = (client) => { // função para preencher os campo quando forem alterados
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('telefone').value = client.telefone
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index //
}

const editClient = (index) => {
    const client = readClient()[index] // esta lendo os cliente e colocando index para saber quem esta clicando
    client.index = index;
    fillFields(client); // preenchendo os campo
    openModal(); // abrindo o modal para alterar cliente
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-');
        // primeiro a acao e depois o elemento a ser alterado
        // colocando o array em duas posiçoes

        if (action == 'edit') {
            editClient(index);

        } else {
            const client = readClient()[index];
            const response = confirm(`Deseja realmente Excluir este cliente ${client.nome} ?`);

            if (response) {
                deleteClient(index);
                updateTable(); // atualizando tabela
            }

        }
    }
}


document.getElementById('cadastrarCliente') // quando eu clicar no botao cadastrar ele vai abrir o modal
    .addEventListener('click', openModal);

/* document.getElementById('visualizar') // quando eu clicar no botao cadastrar ele vai abrir o modal
    .addEventListener('click', VisualizarClient); */

document.getElementById('modalClose') // quiando eu clicar no x ele vai fechar o modal
    .addEventListener('click', closeModal);

document.getElementById('salvar')
    .addEventListener('click', saveClient);


document.querySelector('#tbClient>tbody')
    .addEventListener('click', editDelete)

    document.getElementById('cancelar') // botao cancelar fecha app
    .addEventListener('click', closeModal)