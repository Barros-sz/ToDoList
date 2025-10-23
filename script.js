// =============================================================
//  EsToDoList - CRUD, Filtros, Pesquisa, Ordenação e Dark Mode
//  Modelo de programação refatorado.
// =============================================================

// -------------------------------
// 1. Seleção dos Elementos do DOM
// -------------------------------
const listaTarefasEl = document.getElementById('task-list'); // Contêiner da lista de tarefas
const inputNovaTarefa = document.getElementById('new-task-input'); // Campo de texto para nova tarefa
const botaoAdicionarTarefa = document.getElementById('add-task-btn'); // Botão para adicionar tarefa
const inputPesquisa = document.getElementById('search-input'); // Campo de pesquisa
const botoesFiltro = document.querySelectorAll('.filter-btn'); // Botões de filtro (todos, concluídos, ativos)
const botoesOrdenacao = document.querySelectorAll('.sort-btn'); // Botões de ordenação (mais novo, mais antigo)
const botaoAlternarModo = document.getElementById('toggle-mode'); // Botão para alternar Dark/Light Mode
const elementoHtml = document.documentElement; // Elemento <html> para controle do Dark Mode

// Ícones SVG para Dark Mode (Sol e Lua)
const iconeSol = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.585 7.034a.75.75 0 0 0-1.25-.92l-1.442 1.053a.75.75 0 0 0 .92 1.25l1.442-1.053ZM18.331 6.098a.75.75 0 0 0-1.135-.297l-1.393 1.132a.75.75 0 0 0 .964 1.183l1.393-1.132a.75.75 0 0 0 .19-.924ZM12 6a6 6 0 1 1 0 12 6 6 0 0 1 0-12ZM3.75 12a.75.75 0 0 0 0 1.5h2.25a.75.75 0 0 0 0-1.5H3.75ZM18 12a.75.75 0 0 0 0 1.5h2.25a.75.75 0 0 0 0-1.5H18ZM7.034 16.415a.75.75 0 0 0 1.25.92l1.442-1.053a.75.75 0 0 0-.92-1.25l-1.442 1.053ZM16.415 17.034a.75.75 0 0 0 1.25.92l1.442-1.053a.75.75 0 0 0-.92-1.25l-1.442 1.053ZM12 18.75a.75.75 0 0 0-.75.75v2.25a.75.75 0 0 0 1.5 0v-2.25a.75.75 0 0 0-.75-.75Z" /></svg>`;
const iconeLua = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M9.546 1.096A10.5 10.5 0 0 0 12 21.5a10.5 10.5 0 0 0 10.454-10.454C22.094 6.784 18.498 3.188 13.954 3.962A7.5 7.5 0 0 1 10.5 7.5c0 4.004-3.528 7.272-7.854 7.424C4.188 18.498 7.784 22.094 12 22.5c5.786 0 10.5-4.714 10.5-10.5S17.786 1.5 12 1.5c-2.486 0-4.793.85-6.685 2.296C6.678 3.197 9.17 1.282 9.546 1.096Z" clip-rule="evenodd" /></svg>`;

// Array principal que armazena todas as tarefas e variáveis de estado
let tarefas = []; // Array principal
let filtroAtual = 'all'; // Estado atual do filtro
let ordenacaoAtual = 'newest'; // Estado atual da ordenação

// -------------------------------
// 2. Funções de Persistência e Modo (Local Storage)
// -------------------------------

/** Atualiza o ícone do botão Dark Mode (sol/lua). */
function atualizarIconeModo() {
    const isDark = elementoHtml.classList.contains('dark');
    botaoAlternarModo.innerHTML = isDark ? iconeSol : iconeLua;
}

/** Salva o modo preferido (dark/light) no Local Storage. */
function salvarPreferenciaModo() {
    const isDark = elementoHtml.classList.contains('dark');
    localStorage.setItem('esToDoListMode', isDark ? 'dark' : 'light');
}

/** Carrega o modo preferido do Local Storage. */
function carregarPreferenciaModo() {
    const modoPreferido = localStorage.getItem('esToDoListMode');
    if (modoPreferido === 'dark') {
        elementoHtml.classList.add('dark');
    } else {
        elementoHtml.classList.remove('dark');
    }
    atualizarIconeModo();
}

/** Salva as tarefas no Local Storage. */
function salvarTarefas() {
    localStorage.setItem('esToDoListTasks', JSON.stringify(tarefas));
}

/** Carrega tarefas salvas no navegador. */
function carregarTarefasSalvas() {
    const tarefasArmazenadas = localStorage.getItem('esToDoListTasks');
    if (tarefasArmazenadas) {
        // Converte o texto JSON em array
        tarefas = JSON.parse(tarefasArmazenadas).map(tarefa => ({
            ...tarefa,
            timestamp: new Date(tarefa.timestamp) // Converte a string de data em objeto Date
        }));
    } else {
        // Tarefas iniciais se não houver nada salvo
        const agora = Date.now();
        tarefas = [
            { id: agora + 1, texto: "Fazer o desafio EsToDoList funcional", concluida: true, timestamp: new Date(agora - 86400000) },
            { id: agora + 2, texto: "Corrigir os estilos para Light Mode", concluida: false, timestamp: new Date(agora) }
        ];
    }
}

// -------------------------------
// 3. Funções de Renderização e Filtros/Ordenação
// -------------------------------

/** Cria o elemento HTML para uma única tarefa. */
function criarElementoTarefa(tarefa) {
    const classeTarefa = tarefa.concluida ? 'done' : 'todo';
    const classeTexto = tarefa.concluida ? 'text-gray-500 line-through dark:text-gray-400' : 'text-black dark:text-white';

    const divTarefa = document.createElement('div');
    divTarefa.className = `task-item bg-white dark:bg-gray-800 p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 ${classeTarefa}`;
    divTarefa.dataset.id = tarefa.id;

    // Estrutura HTML da tarefa com checkbox, texto, e botões (edit/delete)
    divTarefa.innerHTML = `
        <div class="flex items-center space-x-4">
            <input type="checkbox" id="task-${tarefa.id}" ${tarefa.concluida ? 'checked' : ''} data-id="${tarefa.id}">
            <label for="task-${tarefa.id}" class="text-xl ${classeTexto}">${tarefa.texto}</label>
        </div>
        <div class="flex items-center space-x-3">
            <button class="text-yellow-600 hover:text-yellow-700 edit-btn" data-id="${tarefa.id}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 17.25H5.75V12.416l10.92-10.92Z" />
                </svg>
            </button>
            <button class="text-red-500 hover:text-red-600 delete-btn" data-id="${tarefa.id}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9.497-.365 7.3a1.5 1.5 0 0 1-1.493 1.353H9.118a1.5 1.5 0 0 1-1.493-1.353l-.366-7.3m10.875 0V7.5A2.25 2.25 0 0 0 18 5.25h-4.5V3.75a1.5 1.5 0 0 0-3 0v1.5H6A2.25 2.25 0 0 0 3.75 7.5v1.997m-.75 0 1.954 11.666A3.75 3.75 0 0 0 8 22.5h8.5a3.75 3.75 0 0 0 3.546-2.837L21.75 9.497" />
                </svg>
            </button>
        </div>
    `;
    return divTarefa;
}


/**
 * Aplica Pesquisa, Filtro e Ordenação e exibe as tarefas na tela.
 */
function exibirTarefas() {
    let tarefasProcessadas = tarefas;
    const termoPesquisa = inputPesquisa.value.toLowerCase().trim();

    // 1. Pesquisa: Filtra por termo
    if (termoPesquisa.length > 0) {
        tarefasProcessadas = tarefasProcessadas.filter(tarefa =>
            tarefa.texto.toLowerCase().includes(termoPesquisa)
        );
    }

    // 2. Filtragem: Filtra por estado (todos, concluídos, ativos)
    if (filtroAtual === 'completed') {
        tarefasProcessadas = tarefasProcessadas.filter(tarefa => tarefa.concluida);
    } else if (filtroAtual === 'uncompleted') {
        tarefasProcessadas = tarefasProcessadas.filter(tarefa => !tarefa.concluida);
    }

    // 3. Ordenação: Ordena por data (mais novo ou mais antigo)
    tarefasProcessadas.sort((a, b) => {
        if (ordenacaoAtual === 'newest') {
            return b.timestamp - a.timestamp;
        } else if (ordenacaoAtual === 'oldest') {
            return a.timestamp - b.timestamp;
        }
        return 0;
    });

    // 4. Renderização no DOM: Limpa a lista e insere os novos elementos
    listaTarefasEl.innerHTML = '';
    if (tarefasProcessadas.length === 0) {
         listaTarefasEl.innerHTML = `<p class="text-gray-500 dark:text-gray-400 text-center mt-8">Nenhuma tarefa encontrada. 😢</p>`;
    } else {
        tarefasProcessadas.forEach(tarefa => {
            listaTarefasEl.appendChild(criarElementoTarefa(tarefa));
        });
    }
}


// -------------------------------
// 4. Funções CRUD (Criação, Leitura, Atualização, Exclusão)
// -------------------------------

/** Adiciona uma nova tarefa ao array. */
function adicionarTarefa() {
    const texto = inputNovaTarefa.value.trim();
    if (texto === "") return;

    // Cria o objeto da nova tarefa com ID único e timestamp
    const novaTarefa = {
        id: Date.now(),
        texto: texto,
        concluida: false,
        timestamp: new Date()
    };

    tarefas.push(novaTarefa);
    inputNovaTarefa.value = '';
    salvarTarefas();
    exibirTarefas();
}

/** Exclui uma tarefa pelo ID. */
function excluirTarefa(id) {
    const confirmar = window.confirm('Tem certeza que deseja excluir esta tarefa?')

    if (confirmar) {
        // Cria um novo array excluindo a tarefa com o ID fornecido
        tarefas = tarefas.filter(tarefa => tarefa.id !== id);
        salvarTarefas();
        exibirTarefas();
    }
}

/** Altera o status de conclusão de uma tarefa. */
function alternarConclusao(id) {
    const tarefa = tarefas.find(tarefa => tarefa.id === id);
    if (tarefa) {
        tarefa.concluida = !tarefa.concluida;
        salvarTarefas();
        exibirTarefas();
    }
}

/** Edita o texto de uma tarefa pelo ID. */
function editarTarefa(id) {
    const tarefa = tarefas.find(tarefa => tarefa.id === id);
    if (!tarefa) return;

    const novoTexto = prompt("Edite a tarefa:", tarefa.texto); // Usa prompt para obter o novo texto

    // Atualiza o texto se for válido
    if (novoTexto && novoTexto.trim() !== "" && novoTexto.trim() !== tarefa.texto) {
        tarefa.texto = novoTexto.trim();
        salvarTarefas();
        exibirTarefas();
    }
}


// -------------------------------
// 5. Configuração de Event Listeners (Interações do Usuário)
// -------------------------------

// Adicionar Tarefa (click e tecla Enter)
botaoAdicionarTarefa.addEventListener('click', adicionarTarefa);
inputNovaTarefa.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') adicionarTarefa();
});

// Pesquisa (dispara a renderização a cada input)
inputPesquisa.addEventListener('input', exibirTarefas);

// Delegação de Eventos (captura click no checkbox, editar ou deletar)
listaTarefasEl.addEventListener('click', (e) => {
    const id = parseInt(e.target.dataset.id || e.target.closest('button')?.dataset.id);
    if (!id) return;

    if (e.target.type === 'checkbox') {
        alternarConclusao(id);
    } else if (e.target.closest('.delete-btn')) {
        excluirTarefa(id);
    } else if (e.target.closest('.edit-btn')) {
        editarTarefa(id);
    }
});

// Filtragem (alterna o filtro e atualiza o estilo do botão ativo)
botoesFiltro.forEach(botao => {
    botao.addEventListener('click', () => {
        const novoFiltro = botao.dataset.filter;
        if (filtroAtual === novoFiltro) {
            filtroAtual = 'all';
        } else {
            filtroAtual = novoFiltro;
        }

        botoesFiltro.forEach(btn => btn.classList.remove('active-filter'));
        if (filtroAtual === 'all') {
            document.getElementById('filter-all').classList.add('active-filter');
        } else {
             botao.classList.add('active-filter');
        }

        exibirTarefas();
    });
});

// Ordenação (define o tipo de ordenação e atualiza o estilo)
botoesOrdenacao.forEach(botao => {
    botao.addEventListener('click', () => {
        ordenacaoAtual = botao.dataset.sort;

        botoesOrdenacao.forEach(btn => btn.classList.remove('active-sort'));
        botao.classList.add('active-sort');

        exibirTarefas();
    });
});

// Alternar Modo (Dark/Light)
botaoAlternarModo.addEventListener('click', () => {
    elementoHtml.classList.toggle('dark');
    salvarPreferenciaModo();
    atualizarIconeModo();
    exibirTarefas();
});


// -------------------------------
// 6. Inicialização da Aplicação
// -------------------------------

/** Função executada ao carregar a página. */
window.onload = function iniciar() {
    carregarPreferenciaModo(); // Carrega o modo Dark/Light
    carregarTarefasSalvas(); // Busca as tarefas salvas
    exibirTarefas(); // Exibe as tarefas na tela
};