
# Gestor de Despesas Pessoais

## Descrição do projeto

O Gestor de Despesas Pessoais é uma aplicação web desenvolvida no âmbito do Projeto Final 2 da formação Software Developer do CESAE Digital.

A aplicação permite registar, consultar, editar e eliminar despesas pessoais, organizando-as por categorias e apresentando os respetivos totais.

O objetivo é aplicar conhecimentos de HTML, CSS e JavaScript, incluindo manipulação do DOM, eventos, validação de formulários, consumo de APIs externas e integração com uma base de dados.

## Funcionalidades

- Criação de conta e autenticação de utilizadores.
- Manutenção da sessão após atualizar a página.
- Registo de despesas com descrição, valor e categoria.
- Listagem das despesas registadas.
- Edição e eliminação de despesas.
- Cálculo automático do total de despesas.
- Filtragem por categoria e cálculo do respetivo total.
- Validação dos dados introduzidos.
- Modo claro e escuro com persistência da preferência.
- Apresentação da data e hora.
- Consulta de informação meteorológica através de APIs externas.
- Armazenamento das despesas numa base de dados Supabase.

## Tecnologias utilizadas

- HTML5 — Estrutura da aplicação.
- CSS3 — Estilização e adaptação a diferentes ecrãs.
- JavaScript — Lógica, eventos e manipulação do DOM.
- Supabase — Autenticação e base de dados PostgreSQL.
- Open-Meteo — Informação meteorológica.
- OpenStreetMap Nominatim — Identificação da localidade.
- Git e GitHub — Controlo de versões.
- GitHub Pages — Publicação da aplicação.

## Como utilizar

1. Aceder à aplicação através da ligação indicada abaixo.
2. Criar uma conta com e-mail e palavra-passe.
3. Iniciar sessão.
4. Preencher a descrição, o valor e a categoria da despesa.
5. Clicar em "Adicionar despesa".
6. Consultar a lista de despesas e o total acumulado.
7. Selecionar uma categoria para filtrar os registos.
8. Utilizar os botões "Editar" ou "Excluir" para gerir as despesas.
9. Utilizar o botão de modo claro/escuro para alterar o tema.
10. Permitir o acesso à localização para consultar a informação meteorológica.
11. Clicar em "Sair" para terminar a sessão.

## Armazenamento e segurança

A aplicação utiliza o Supabase para autenticação e armazenamento dos dados numa base de dados PostgreSQL.

Cada despesa está associada ao utilizador autenticado.

Foram configuradas políticas Row Level Security (RLS) para restringir o acesso às despesas do respetivo utilizador.

A preferência pelo modo claro ou escuro é guardada no navegador através do localStorage.

## Estrutura do projeto

```text
gestor_de_despesas/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── script.js
│   └── supabase-config.js
├── .gitignore
└── README.md
```

## Acesso à aplicação

Aplicação publicada no GitHub Pages:

https://robertatramontina.github.io/expense-tracker/

Repositório GitHub:

https://github.com/robertatramontina/expense-tracker

## Projeto académico

Projeto Final 2 — Software Developer

CESAE Digital — 2026
