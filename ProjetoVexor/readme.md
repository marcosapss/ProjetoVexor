# 📄 Documentação Completa dos Arquivos do Projeto Vexor

Este documento fornece uma descrição detalhada de cada arquivo no projeto Vexor, explicando seu propósito e funcionalidade.

---

## 📂 Estrutura de Arquivos

/Vexor
├── css/
├── db/
├── img/
├── js/
├── *.html
└── readme.md

---

## 🌐 Páginas HTML

As páginas HTML são a espinha dorsal do site, estruturando o conteúdo que o usuário vê.

* **`index.html`**: A página inicial (homepage) do e-commerce. Apresenta uma seção de "herói", banners promocionais, uma introdução aos diferenciais da loja e uma vitrine com produtos em destaque.
* **`product.html`**: A página de listagem de produtos. Exibe todos os mouses disponíveis em formato de grade, com funcionalidades de filtro, ordenação e paginação.
* **`product-page.html`**: Página de detalhes de um produto específico. Contém uma galeria de imagens, descrição completa, especificações técnicas, preço e botões de ação (comprar, adicionar ao carrinho, favoritar).
* **`cart.html`**: A página do carrinho de compras. Lista os produtos adicionados, permitindo que o usuário ajuste quantidades, remova itens e veja o total da compra.
* **`favorite.html`**: Exibe a lista de produtos que o usuário marcou como favoritos, oferecendo um atalho para a página do produto ou a remoção da lista.
* **`login.html`**: Formulário para que usuários existentes possam entrar em suas contas. Inclui links para a página de cadastro e um menu oculto para gerenciamento de cadastros locais (simulação).
* **`register.html`**: Formulário de cadastro para novos usuários, com múltiplos campos e validações em tempo real.
* **`usuario.html`**: O painel do usuário, acessível após o login. Funciona como um hub central com navegação para perfil, favoritos, carrinho e configurações.
* **`config.html`**: Uma página de exemplo dentro do painel do usuário para alterar dados da conta (simulação).
* **`mouse.html`**: Página institucional que conta a "História do Mouse" através de uma timeline interativa e visual.
* **`contact.html`**: Página de contato com informações como e-mail, telefone, redes sociais e um formulário para envio de mensagens.
* **`policy-privacy.html`**: Página com o texto da Política de Privacidade do site, formatada em um acordeão para fácil leitura.
* **`delivery-policy.html`**: Detalha a Política de Entregas, incluindo informações sobre prazos, custos e métodos de envio.
* **`tracking.html`**: Página que permite ao usuário inserir um código de rastreamento para verificar o status de um pedido (simulação).
* **`base-page.html`**: Um template HTML básico que serve como esqueleto para a criação de novas páginas, já incluindo as estruturas principais como `head` e os contêineres para `navbar` e `footer`.

---

## 🎨 Folhas de Estilo (CSS)

Os arquivos CSS são responsáveis por toda a aparência visual do site, desde o layout geral até os detalhes de cada componente.

* **`styles.css`**: O arquivo de estilo principal. Define variáveis de tema (claro/escuro), estilos globais (tipografia, cores), e os estilos da `navbar` e `footer`, além de regras de responsividade gerais.
* **`auth.css`**: Estiliza as páginas de `login.html` e `register.html`, criando o layout dos formulários, os cards de autenticação e o fundo animado.
* **`cart.css`**: Contém os estilos para a página do carrinho, definindo a aparência dos itens, do resumo da compra e da mensagem de carrinho vazio.
* **`contact.css`**: Estiliza a página de contato, incluindo os cards de informação e o formulário de mensagem.
* **`favorite.css`**: Define o visual da página de favoritos, os cards dos produtos e a mensagem de "sem favoritos".
* **`index.css`**: Estilos específicos para a página `index.html`, incluindo a seção de herói com vídeo, a seção "Por que escolher a Vexor?" e a seção de gamificação.
* **`mouse.css`**: CSS para a página `mouse.html`, focado na estilização da timeline da história do mouse.
* **`policy.css`**: Estilos para as páginas de políticas (`policy-privacy.html` e `delivery-policy.html`), formatando os títulos e o componente de acordeão.
* **`product.css`**: Estilização da página de listagem de produtos, incluindo os cards de produto, o banner de promoção, os controles de filtro/ordenação e o menu offcanvas de filtros.
* **`product-page.css`**: Estilos para a página de detalhes do produto, focando na galeria de imagens, no painel de informações, na caixa de preço e nas abas de descrição/especificações.
* **`promotion.css`**: Define os estilos especiais para os cards de produtos em promoção, incluindo a borda animada com gradiente RGB e o efeito de "skeleton loading".
* **`users.css`**: CSS para o painel do usuário (`usuario.html`), definindo o layout da sidebar lateral e da área de conteúdo principal.

---

## 🛠️ Scripts (JavaScript)

Os arquivos JavaScript dão vida ao site, adicionando interatividade, lógica de negócios e manipulação dinâmica do conteúdo.

* **`navbar.js`**: Injeta dinamicamente o código da barra de navegação dupla (principal e de links) em todas as páginas. Controla seu comportamento responsivo e a animação de ocultar/mostrar durante o scroll. Também inicializa a funcionalidade de busca e a atualização dos ícones do carrinho e favoritos.
* **`footer.js`**: Injeta dinamicamente o `footer` (rodapé) em todas as páginas, garantindo consistência e facilitando a manutenção.
* **`accessibility.js`**: Gerencia o menu de acessibilidade. Permite ao usuário alternar entre os temas claro e escuro, aumentar, diminuir e resetar o tamanho da fonte. As preferências são salvas no `localStorage` para persistirem entre as visitas. Também controla a visibilidade do botão de acessibilidade quando outros menus (como o de filtros) estão abertos.
* **`product.js`**: Responsável por buscar os produtos do `products-database.json` e renderizá-los dinamicamente na página `product.html`. Controla toda a lógica de filtragem, ordenação e paginação.
* **`product-page.js`**: Busca os dados de um produto específico (baseado no ID da URL) e popula a página `product-page.html` com todas as suas informações: galeria de imagens, detalhes, especificações, etc. Também carrega produtos sugeridos.
* **`promotion.js`**: Na `index.html`, busca produtos que estão em promoção e os exibe de forma aleatória em cards com efeitos visuais especiais, incluindo um "skeleton screen" enquanto os dados são carregados.
* **`search.js`**: Implementa a funcionalidade de busca ao vivo na `navbar`. Conforme o usuário digita, o script filtra os produtos cacheados e exibe os resultados em um dropdown.
* **`login.js`**: Gerencia o processo de autenticação. Ele valida as credenciais do usuário contra o `users-database.json` e os usuários cadastrados localmente. Exibe mensagens de sucesso ou erro e redireciona o usuário após um login bem-sucedido.
* **`login-redirect.js`**: Um script simples que verifica se um usuário comum já está logado e, em caso afirmativo, o redireciona da página de login para o painel do usuário, evitando que ele precise fazer login novamente.
* **`register.js`**: Controla o formulário de registro, implementando validações em tempo real para cada campo (formato, idade, força da senha, etc.), consultando a API ViaCEP para preenchimento de endereço e salvando o novo usuário no `localStorage`.
* **`cart.js`**: Gerencia o estado do carrinho de compras. Ele lê/salva os produtos no `localStorage`, renderiza os itens na página `cart.html`, e permite a alteração de quantidade e a remoção de itens.
* **`favorite.js`**: Lida com a funcionalidade de favoritos. Lê os "likes" do `localStorage`, busca os dados dos produtos favoritados e os exibe na página `favorite.html`, permitindo também a remoção.
* **`user-panel.js`**: Script do painel do usuário. Verifica se há um usuário logado, exibe seu nome e gerencia a navegação interna do painel, carregando dinamicamente o conteúdo de `favorite.html`, `cart.html`, etc., na área principal.
* **`index.js`**: Contém scripts específicos para a `index.html`, como a inicialização das animações de "scroll" que revelam os elementos da página conforme o usuário rola a tela.
* **`mouse.js`**: Ativa as animações de entrada para os itens da timeline na página `mouse.html`, fazendo-os aparecer de forma suave à medida que entram no campo de visão do usuário.
* **`tracking.js`**: Simula a funcionalidade de rastreamento de pedidos na página `tracking.html`. Ele "busca" um pedido com base no código inserido e exibe diferentes status (em trânsito, erro, não encontrado).

---

## 🗂️ Bancos de Dados Simulados (JSON)

Como este é um projeto front-end, arquivos JSON são usados para simular um banco de dados.

* **`products-database.json`**: Contém um array de objetos, onde cada objeto representa um produto com todos os seus detalhes: ID, nome, descrição, preços, marca, especificações, imagens, etc.
* **`users-database.json`**: Armazena um array com usuários e senhas pré-cadastrados para simular uma base de usuários existente para a funcionalidade de login.