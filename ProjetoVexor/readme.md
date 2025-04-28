# Vexor - Documentação Oficial do Projeto

Seja bem-vindo à documentação do **Vexor**, uma loja virtual especializada em mouses gamers. Este projeto foi desenvolvido com foco em boas práticas de organização de arquivos, responsividade e experiência do usuário, buscando aprender e aplicar conceitos de HTML, CSS e JavaScript de forma prática.

---

## 📄 Estrutura de Páginas HTML

- `index.html` — Página principal da loja.
- `base-page.html` — Template base para reaproveitamento de layout.
- `cart.html` — Carrinho de compras.
- `favorite.html` — Lista de produtos favoritados.
- `login.html` — Tela de login.
- `register.html` — Tela de cadastro.
- `product.html` — Catálogo de produtos.
- `product-page.html` — Detalhes de um produto específico.
- `mouse.html` — Página dedicada à categoria de mouses.

> Observação: O projeto utiliza componentes dinâmicos para Navbar e Footer, evitando repetição de código.

---

## 🌈 Folhas de Estilo (CSS)

- `styles.css` — Estilos globais (tipografia, navbar, rodapé, responsividade geral).
- `cart.css` — Estilos específicos para o carrinho.
- `favorite.css` — Estilos específicos para a página de favoritos.
- `product-page.css` — Estilização dos detalhes de produto.
- `promotion.css` — Estilos de produtos em promoção (com efeitos especiais).

> Cada página carrega apenas o CSS necessário, visando otimização de desempenho.

---

## 🛠️ Scripts JavaScript

- `accessibility.js` — Permite alterar o tema do site (claro/escuro), ajustar tamanho de fonte e esconder o menu de acessibilidade. As preferências são salvas no `localStorage`.

- `cart.js` — Controla o carrinho de compras, adicionando, listando e removendo produtos usando o `localStorage`.

- `favorite.js` — Gerencia produtos favoritados, permitindo adicionar e remover favoritos de forma persistente.

- `footer.js` — Gera dinamicamente o rodapé em todas as páginas.

- `login.js` — Faz a validação de login, simulando uma autenticação com base em um banco de dados local.

- `navbar.js` — Torna a navbar responsiva, mudando seu comportamento com base no scroll da página.

- `product.js` — Lista os produtos do banco de dados e gera seus respectivos cards na página.

- `product-page.js` — Exibe dinamicamente as informações de um produto individual.

- `promotion.js` — Exibe promoções de produtos aleatoriamente, com efeitos visuais especiais.

- `register.js` — Faz a validação e cadastro de novos usuários localmente.

- `search.js` — Permite a busca de produtos cadastrados de forma simples e eficaz.

> Todos os scripts utilizam boas práticas de DOM manipulation e persistência de dados básica com `localStorage`.

---

## 📂 Banco de Dados Simulados (JSON)

- `products-database.json` — Contém as informações dos produtos (nome, preço, imagem, descrição).
- `users-database.json` — Simula uma base de usuários para fins de login e registro.

---

## 🖼️ Recursos Visuais (Imagens)

- `banner1.png`, `banner2.png`, `banner3.png` — Imagens promocionais principais.
- `favicon.ico` — Ícone do site.
- `login.png`, `register.png` — Ilustrações para as telas de login e cadastro.
- `gamer-mouse.png` — Arte genérica para mouses gamers.
- `mousehist/` — Pasta com imagens sobre a história dos mouses, desde o primeiro modelo com bolinha até os sensores ópticos modernos.

> O projeto preza por imagens otimizadas para manter a performance.

---

## 📊 Resumo Rápido

| Arquivo | Função | Observação |
|:---|:---|:---|
| `accessibility.js` | Acessibilidade | Tema, fonte, menu |
| `cart.js` | Carrinho | `localStorage`, dinâmico |
| `favorite.js` | Favoritos | Gestão de favoritos |
| `footer.js` | Rodapé dinâmico | Atualização automática |
| `login.js` | Login | Simula login local |
| `navbar.js` | Navbar responsiva | Comportamento no scroll |
| `product.js` | Listagem de produtos | Cards dinâmicos |
| `product-page.js` | Detalhes do produto | Info carregadas dinâmicas |
| `promotion.js` | Promoções | Cards aleatórios |
| `register.js` | Cadastro | Validação e criação de usuário |
| `search.js` | Busca de produtos | Filtro dinâmico |
