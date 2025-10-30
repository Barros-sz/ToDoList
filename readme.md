EsToDoList - Aplicação de Gerenciamento de Tarefas
O EsToDoList é uma aplicação web de lista de tarefas (To-Do List) que serve como um artefato de portfólio para demonstrar proficiência em tecnologias frontend essenciais. O projeto foca em JavaScript puro, manipulação direta do DOM, gestão de estado e persistência de dados, evitando frameworks de view complexos.

Tecnologias e Relevância de Mercado
O projeto evidencia habilidades técnicas cruciais e valorizadas no mercado de desenvolvimento frontend:

JavaScript Puro (ES6+): Implementação de toda a lógica de aplicação (CRUD, filtros, ordenação) sem frameworks. Demonstra domínio em DOM Manipulation, arquitetura de estado em JS puro e práticas de clean code.

Tailwind CSS: Construção do layout responsivo e design utilitário. Demonstra agilidade e competência na criação de interfaces modernas e manutenção de estilos.

Local Storage API: Utilizada para persistência das tarefas e da preferência de tema do usuário. Demonstra conhecimento em APIs de armazenamento web, gestão de estado e serialização de dados (JSON).

CSS Puro: Criação de estilos complexos (como o efeito visual "Sketch") e controle de temas. Demonstra proficiência em CSS para design system adaptativo (Dark Mode) e customização de componentes.

Funcionalidades e Arquitetura
O sistema é construído sobre uma arquitetura de estado simples gerenciada inteiramente pelo JavaScript puro:

Gestão de Dados Persistente (CRUD): As tarefas são armazenadas em um array (tarefas) e a persistência é gerenciada pela função salvarTarefas utilizando o Local Storage.

Pipeline de Renderização: A função central exibirTarefas coordena o fluxo de dados e visualização: Pesquisa → Filtro por Estado (concluído/não concluído) → Ordenação por Data → Atualização do DOM.

Controle de Tema: O toggle entre Dark Mode e Light Mode é realizado pela alternância da classe .dark no elemento <html>, garantindo que toda a interface se adapte. O tema escolhido é salvo e carregado automaticamente.

Estrutura de Arquivos
index.html: Estrutura semântica da aplicação.

style.css: Regras CSS customizadas, incluindo o efeito visual "Sketch" (.sketch-border) e a adaptação dos estilos de tema.

script.js: Contém toda a lógica de frontend da aplicação, incluindo as funções de gerenciamento de dados e interações.

Este projeto é uma demonstração sólida de desenvolvimento frontend e proficiência em tecnologias base.