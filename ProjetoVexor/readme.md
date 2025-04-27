# Vexor - Documentação Avançada e Completa

Bem-vindo ao projeto **Vexor**!

Este projeto é uma loja virtual focada na venda de mouses gamers. Abaixo você encontra uma descrição extremamente detalhada sobre cada parte do projeto, explicando também o funcionamento interno dos JavaScripts e a estrutura dos CSS.

---

# 📄 HTMLs

- `index.html` - Página principal da loja.
- `base-page.html` - Template base para outras páginas.
- `cart.html` - Página de carrinho de compras.
- `favorite.html` - Página de produtos favoritos.
- `login.html` - Página de login de usuário.
- `register.html` - Página de cadastro de novos usuários.
- `product.html` - Listagem de produtos.
- `product-page.html` - Detalhes de um produto.
- `mouse.html` - Página dedicada exclusivamente para mouses.

Essas páginas se utilizam de componentes dinâmicos como Footer e Navbar, que são gerados por JavaScript para garantir manutenção mais fácil e evitar repetição de código.

---

# 🎨 CSSs

- `styles.css` - Controla o visual global: navbar, rodapé, tipografia, cores principais, responsividade e elementos comuns (botões, inputs, margens, espaçamentos).
- `cart.css` - Estilos aplicados apenas para o carrinho de compras: disposição dos produtos, organização dos preços e botões de remoção.
- `favorite.css` - Estilos para a página de produtos favoritados, semelhante ao carrinho mas com variações visuais específicas.
- `product-page.css` - Estilos para a exibição dos detalhes de produtos individuais: imagens maiores, descrições, preços destacados.
- `promotion.css` - Estilos para cards de promoção: utiliza bordas animadas (efeito RGB) para destacar produtos em oferta.

Cada página importa apenas os CSSs necessários para manter performance otimizada.

---

# 🛠️ JavaScript

## `accessibility.js`
**Objetivo:** Melhorar a acessibilidade geral do site.

- Permite aumentar ou diminuir o tamanho da fonte (`fontSize`) usando `em`, garantindo acessibilidade.
- Alterna entre tema claro e escuro manipulando o atributo `data-theme` diretamente no `<html>`.
- Salva as preferências do usuário (tamanho da fonte, tema) no `localStorage` para persistir entre sessões.
- Permite ocultar o botão de acessibilidade, melhorando a limpeza da interface para usuários que não necessitam.

[Referência](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## `cart.js`
**Objetivo:** Gerenciar produtos no carrinho de compras.

- Armazena os produtos adicionados usando `localStorage`.
- Funções para adicionar (`addToCart`) e remover (`removeFromCart`) produtos.
- Atualiza a exibição visual gerando dinamicamente elementos HTML para cada produto listado no carrinho.
- Se o carrinho estiver vazio, exibe uma mensagem padrão.

## `favorite.js`
**Objetivo:** Gerenciar produtos marcados como favoritos.

- Armazena a lista de produtos favoritados no `localStorage`.
- Permite adicionar/remover produtos favoritos.
- Gera visualmente a lista de favoritos criando cards dinamicamente.

## `footer.js`
**Objetivo:** Criar o rodapé da página de forma dinâmica.

- Gera o HTML do footer usando `innerHTML`.
- As classes aplicadas já são definidas no `styles.css`.
- Permite alterar o conteúdo do rodapé em todas as páginas alterando apenas este arquivo.

**Justificativa Técnica:**
Facilita a manutenção do projeto, economizando tempo e evitando duplicação de código em cada página HTML.

## `login.js`
**Objetivo:** Validação de login de usuários.

- Captura dados de formulário de login.
- Verifica as credenciais usando informações simuladas do arquivo `users-database.json`.
- Se o login for bem-sucedido, o estado é salvo no `localStorage`.

## `navbar.js`
**Objetivo:** Tornar a barra de navegação responsiva ao comportamento do usuário.

- Detecta rolagem (`scroll`) e altera dinamicamente as classes da navbar.
- A navbar diminui de tamanho e altera sua aparência ao rolar a página, melhorando a usabilidade.

[Referência](https://www.w3schools.com/howto/howto_js_navbar_shrink_scroll.asp)

## `password-strength.js`
**Objetivo:** Avaliar a força da senha durante o cadastro.

- Analisa o tamanho da senha e a diversidade de caracteres (letras, números, símbolos).
- Atualiza o nível de força (`fraca`, `média`, `forte`) conforme o usuário digita.
- Exibe avisos dinâmicos para o usuário melhorar sua senha.

[Referência](https://github.com/dropbox/zxcvbn)

## `product-page.js`
**Objetivo:** Exibir os detalhes de um produto individual.

- Obtém o `productId` da URL ou evento.
- Busca informações no `products-database.json`.
- Preenche a página gerando o HTML dinamicamente (imagem, nome, preço, descrição, botões de compra).

## `product.js`
**Objetivo:** Listar os produtos da loja.

- Carrega todos os produtos a partir do banco de dados (`products-database.json`).
- Para cada produto, gera dinamicamente um card HTML contendo imagem, nome, preço e botões.

## `promotion.js`
**Objetivo:** Gerar promoções aleatórias de produtos.

- Seleciona uma quantidade aleatória de produtos para exibição.
- Gera cards especiais de promoções com destaque visual (bordas RGB animadas definidas pelo `promotion.css`).

## `register.js`
**Objetivo:** Registrar novos usuários na plataforma.

- Valida dados do formulário (nome, email, senha).
- Verifica se o email já existe (simulado).
- Se tudo estiver correto, salva o novo usuário no `localStorage`.

---

# 🗂️ Databases (JSON)

- `products-database.json` - Armazena todos os dados de produtos, como nome, preço, imagem, descrição.
- `users-database.json` - Simula um banco de dados de usuários para validação de login.

---

# 🖼️ Imagens

- `banner1.png`, `banner2.png`, `banner3.png` - Imagens promocionais usadas em carrosséis ou seções de destaque.
- `favicon.ico` - Ícone que aparece na aba do navegador.
- `login.png` - Ilustração para página de login.
- `register.png` - Ilustração para página de cadastro.

---

# 🔄 HTML + JS Dinâmico

- **Navbar e Footer:**
  - Implementados via JavaScript (`navbar.js` e `footer.js`) para evitar redundância.
  - Permite que qualquer alteração seja refletida automaticamente em todas as páginas.

- **Produtos, Favoritos, Carrinho:**
  - Todos gerados dinamicamente.
  - Mantém estrutura leve e fácil de atualizar sem alterar manualmente HTMLs individuais.

---

# 📊 Resumo Visual

| Arquivo | Função Principal | Observações |
|:---|:---|:---|
| `accessibility.js` | Acessibilidade do site | Tema, fonte, esconder botão |
| `cart.js` | Carrinho de compras | LocalStorage e HTML dinâmico |
| `favorite.js` | Gerenciar Favoritos | LocalStorage |
| `footer.js` | Rodapé dinâmico | HTML criado via JS |
| `login.js` | Validação de Login | Integração com banco simulado |
| `navbar.js` | Navbar dinâmico | Efeito de scroll |
| `password-strength.js` | Força de senha | Avaliação dinâmica |
| `product-page.js` | Página de Produto | Criação de detalhes via JS |
| `product.js` | Listagem de Produtos | Geração de cards |
| `promotion.js` | Promoções aleatórias | Destaque visual |
| `register.js` | Cadastro de Usuário | LocalStorage |

