//*******************************
//* modo noturno
//*******************************
function changeMode() {
  if (document.body.classList.contains("light")) {
    document.body.classList.remove("light");
    document.body.classList.add("dark");
    document.getElementById("btnTema").textContent = "Modo claro";

    localStorage.setItem("modo", "dark");
  } else {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
    document.getElementById("btnTema").textContent = "Modo escuro";

    localStorage.setItem("modo", "light");
  }
}

// "escutar" clique do botao
document.getElementById("btnTema").addEventListener("click", changeMode);

// persistencia do modo
let modoGuardado = localStorage.getItem("modo");

if (modoGuardado === "dark") {
  document.body.classList.remove("light");
  document.body.classList.add("dark");
  document.getElementById("btnTema").textContent = "Modo claro";
} else {
  document.body.classList.remove("dark");
  document.body.classList.add("light");
  document.getElementById("btnTema").textContent = "Modo escuro";
}

//*******************************
//* funcao login
//*******************************
function login() {
  let myUser = document.getElementById("nomeUsuario").value;

  // recuperar informacoes deixadas em login anterior
  usuarioAtual = myUser;

  listaDespesas =
    JSON.parse(localStorage.getItem("despesas_" + usuarioAtual)) || [];

  filtroCategoria();
  calcularTotalDespesas();

  document.getElementById("mensagemVazia").textContent =
    listaDespesas.length === 0 ? "Nenhuma despesa registada." : "";

  // login de facto
  localStorage.setItem("nomeUsuario", myUser);

  document.getElementById("saudacao").textContent = "Olá, " + myUser + "!";

  document.getElementById("secaoLogin").classList.add("hidden");

  document.getElementById("areaApp").classList.remove("hidden");
}
// escutar o form
document
  .getElementById("formLogin")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    login();
    this.reset();
  });
// persistencia do utilizador
let myUserSaved = localStorage.getItem("nomeUsuario");

if (myUserSaved) {
  document.getElementById("saudacao").textContent = "Olá, " + myUserSaved + "!";

  document.getElementById("secaoLogin").classList.add("hidden");
  document.getElementById("areaApp").classList.remove("hidden");
}

//*******************************
// funcao mostrar data e hora
//*******************************
function showDateAndTime() {
  let agora = new Date();
  document.getElementById("dataHora").textContent = agora.toLocaleString();
}
showDateAndTime();

//*******************************
// funcao loggout
//*******************************
function loggout() {
  localStorage.removeItem("nomeUsuario");

  usuarioAtual = null;
  listaDespesas = [];

  listarDespesas(listaDespesas);
  calcularTotalDespesas();
  filtroCategoria();

  document.getElementById("mensagemVazia").textContent =
    "Nenhuma despesa registada.";

  document.getElementById("secaoLogin").classList.remove("hidden");
  document.getElementById("areaApp").classList.add("hidden");
}
document.getElementById("btnSair").addEventListener("click", loggout);

//*******************************
//* funcao registar despesa
//*******************************
let usuarioAtual = localStorage.getItem("nomeUsuario");

let listaDespesas = usuarioAtual
  ? JSON.parse(localStorage.getItem("despesas_" + usuarioAtual)) || []
  : [];

function registrarDespesa() {
  let descricao = document.getElementById("descricao").value;
  let valor = parseFloat(document.getElementById("valor").value);
  let categoria = document.getElementById("categoria").value;
  
if (
  descricao.trim() === "" ||
  categoria.trim() === "" ||
  isNaN(valor) ||
  valor <= 0
) {
  alert("Despesa não pode ser registada. Verifique os campos!");
  return false;
} else {
  listaDespesas.push({ descricao, valor, categoria });
  guardarDespesas();
  return true;
}
}
document
  .getElementById("formDespesa")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    if (registrarDespesa()) {
    filtroCategoria();
    document.getElementById("mensagemVazia").textContent = "";
    this.reset();
    calcularTotalDespesas();
    }
  });

//*******************************
//* funcao listar despesas
//*******************************
function listarDespesas(parametroLista) {
  let listaHTML = document.getElementById("listaDespesas");

  listaHTML.innerHTML = "";

  parametroLista.forEach(function (despesa, index) {
    let indexOriginal = listaDespesas.indexOf(despesa);

    let tr = document.createElement("tr");

    let tdDescricao = document.createElement("td");
    tdDescricao.textContent = despesa.descricao;

    let tdCategoria = document.createElement("td");
    tdCategoria.textContent = despesa.categoria;

    let tdValor = document.createElement("td");
    tdValor.textContent = despesa.valor;

    let tdAcoes = document.createElement("td");
    tdAcoes.innerHTML = `
      <button class="btnEditar">Editar</button>
      <button class="btnExcluir">Excluir</button>
    `;

    // botao editar
    let btnEditar = tdAcoes.querySelector(".btnEditar");

    btnEditar.addEventListener("click", function () {
      editarDespesa(indexOriginal);
    });

    // botao excluir
    let btnExcluir = tdAcoes.querySelector(".btnExcluir");

    btnExcluir.addEventListener("click", function () {
      excluirDespesa(indexOriginal);
    });

    // adicionar celulas na linha
    tr.appendChild(tdDescricao);
    tr.appendChild(tdCategoria);
    tr.appendChild(tdValor);
    tr.appendChild(tdAcoes);

    // adicionar linha na tabela
    listaHTML.appendChild(tr);
  });
}

//*******************************
// funcao editar despesa
//*******************************
function editarDespesa(index) {
  let resposta = prompt(
    "O que deseja editar? D - Descrição, C - Categoria, V - Valor ou ENTER para cancelar:",
  );

  if (resposta === null || resposta === "") {
    return;
  }

  if (resposta.toUpperCase() === "D") {
    let novaDescricao = prompt("Digite a nova descrição:");

    if (novaDescricao !== null && novaDescricao.trim() !== "") {
      listaDespesas[index].descricao = novaDescricao;
    }
  } else if (resposta.toUpperCase() === "C") {
    let novaCategoria = prompt("Digite a nova categoria:");

    if (novaCategoria !== null && novaCategoria.trim() !== "") {
      listaDespesas[index].categoria = novaCategoria;
    }
  } else if (resposta.toUpperCase() === "V") {
    let respostaValor = prompt("Digite o novo valor:");

    if (respostaValor !== null && respostaValor.trim() !== "") {
      let novoValor = Number(respostaValor);

      if (Number.isFinite(novoValor) && novoValor >= 0) {
        listaDespesas[index].valor = novoValor;
      }
    }
  }

  guardarDespesas();
  calcularTotalDespesas();
  filtroCategoria();
}

//*******************************
// funcao excluir despesa
//*******************************
function excluirDespesa(index) {
  let resposta = prompt(
    "Tem certeza de que deseja excluir esta despesa? Digite 'SIM' para confirmar",
  );

  if (resposta !== null && resposta.toUpperCase() === "SIM") {
    listaDespesas.splice(index, 1);

    guardarDespesas();
    filtroCategoria();
    calcularTotalDespesas();
  }
}

//*******************************
// funcao calcular total despesas
//*******************************
function calcularTotalDespesas() {
  let total = 0;

  listaDespesas.forEach(function (despesa) {
    total += despesa.valor;
  });

  document.getElementById("totalDespesas").textContent = total.toFixed(2);
}
calcularTotalDespesas();

//*****************************************
// funcao filtrar despesas por categoria
//*****************************************
function filtroCategoria() {
  let categoria = document.getElementById("filtroCategoria").value;
  let totalCategoria = 0;

  if (categoria === "Todas") {
    listarDespesas(listaDespesas);
    document.getElementById("totalCategoria").textContent = "";
  } else {
    let listaDespesaFiltrada = listaDespesas.filter(function (despesa) {
      return despesa.categoria === categoria;
    });

    listarDespesas(listaDespesaFiltrada);

    listaDespesaFiltrada.forEach((despesa) => {
      totalCategoria += despesa.valor;
    });

    document.getElementById("totalCategoria").textContent =
      "Total da categoria " +
      categoria +
      ": " +
      totalCategoria.toFixed(2) +
      " €";
  }
}

// escutar a mudança de categoria
document
  .getElementById("filtroCategoria")
  .addEventListener("change", filtroCategoria);

//*******************************
//* informação meteorológica
//*******************************
function mostrarTemperatura() {
  // receber geolocalizacao do browser
  navigator.geolocation.getCurrentPosition(
    function (posicao) {
      let latitude = posicao.coords.latitude;
      let longitude = posicao.coords.longitude;

      let chaveAPI = CHAVE_API;

      fetch(
        `https://api.weatherapi.com/v1/current.json?key=${chaveAPI}&q=${latitude},${longitude}&lang=pt`,
      )
        .then((response) => response.json())
        .then((data) => {
          let cidade = data.location.name;
          let temperatura = data.current.temp_c;
          let estado = data.current.condition.text;

          document.getElementById("cidadeAPI").textContent =
            "Cidade: " + cidade;

          document.getElementById("temperaturaAPI").textContent =
            "Temperatura: " + temperatura + " °C";

          document.getElementById("estadoAPI").textContent =
            "Estado: " + estado;
        })
        .catch((error) => {
          console.log("Erro na API:", error);
        });
    },
    function (erro) {
      console.log("Erro na localização:", erro.message);
    },
  );
}

// executar ao abrir a página
mostrarTemperatura();

// atualizar ao clicar no botão
document
  .getElementById("btnAtualizarAPI")
  .addEventListener("click", mostrarTemperatura);

// Mostrar despesas guardadas ao abrir a página
listarDespesas(listaDespesas);
calcularTotalDespesas();

if (listaDespesas.length > 0) {
  document.getElementById("mensagemVazia").textContent = "";
}

//*******************************
//* guardar despesas do utilizador
//*******************************
function guardarDespesas() {
  localStorage.setItem(
    "despesas_" + usuarioAtual,
    JSON.stringify(listaDespesas),
  );
}
