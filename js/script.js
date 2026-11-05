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
async function login() {
  let myUser = document.getElementById("nomeUsuario").value;
  let senha = document.getElementById("senha").value;

  // autenticar utilizador no Supabase
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: myUser,
    password: senha
  });

  if (error) {
    alert("Email ou palavra-passe incorretos!");
    return false;
  }

  // recuperar informacoes deixadas em login anterior
  usuarioAtual = data.user.id;

  await carregarDespesas();
  filtroCategoria();

  document.getElementById("mensagemVazia").textContent =
    listaDespesas.length === 0 ? "Nenhuma despesa registada." : "";

  // login de facto
  localStorage.setItem("nomeUsuario", myUser);

  document.getElementById("saudacao").textContent = "Olá, " + myUser + "!";

  document.getElementById("secaoLogin").classList.add("hidden");

  document.getElementById("areaApp").classList.remove("hidden");
  return true;
}
// escutar o form
document
  .getElementById("formLogin")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    let resultado = await login();

    if (resultado) {
      this.reset();
    }
  });

//********************************
//* funcao verificar sessao  
//* persistencia do utilizador
//********************************
async function verificarSessao() {
  const { data, error } = await supabaseClient.auth.getSession();

  if (error || !data.session) {
    document.getElementById("secaoLogin").classList.remove("hidden");
    return;
  }

  let myUserSaved = data.session.user.email;

  usuarioAtual = data.session.user.id;

  await carregarDespesas();
  filtroCategoria();

  document.getElementById("saudacao").textContent = "Olá, " + myUserSaved + "!";

  document.getElementById("secaoLogin").classList.add("hidden");
  document.getElementById("areaApp").classList.remove("hidden");
}

verificarSessao();


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
async function loggout() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert("Erro ao terminar sessão: " + error.message);
    return;
  }
  localStorage.removeItem("nomeUsuario");

  usuarioAtual = null;
  listaDespesas = [];

  listarDespesas(listaDespesas);
  calcularTotalDespesas();
  filtroCategoria();

  document.getElementById("mensagemVazia").textContent =
    "Nenhuma despesa registada.";

  document.getElementById("formLogin").reset();  
  document.getElementById("secaoLogin").classList.remove("hidden");
  document.getElementById("areaApp").classList.add("hidden");
}
document.getElementById("btnSair").addEventListener("click", loggout);



 //*******************************
 //* funcao registar despesa
 //*******************************
let usuarioAtual = null;
let listaDespesas = [];

async function registrarDespesa() {
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
    const { data, error } = await supabaseClient
      .from("despesas")
      .insert({
        user_id: usuarioAtual,
        descricao: descricao,
        valor: valor,
        categoria: categoria
      })
      .select();

    if (error) {
      alert("Erro ao guardar despesa: " + error.message);
      return false;
    }

    listaDespesas.push(data[0]);
    return true;
  }
}

document
  .getElementById("formDespesa")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    if (await registrarDespesa()) {
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
async function editarDespesa(index) {
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
  let novaCategoria = prompt(
    "Escolha a nova categoria:\n" +
    "1 - Alimentação\n" +
    "2 - Transportes\n" +
    "3 - Habitação\n" +
    "4 - Saúde\n" +
    "5 - Educação\n" +
    "6 - Lazer\n" +
    "7 - Outros"
  );

  let categorias = [
    "Alimentação",
    "Transportes",
    "Habitação",
    "Saúde",
    "Educação",
    "Lazer",
    "Outros"
  ];

  if (novaCategoria !== null && novaCategoria >= 1 && novaCategoria <= 7) {
    listaDespesas[index].categoria = categorias[novaCategoria - 1];
  }
  } else if (resposta.toUpperCase() === "V") {
    let respostaValor = prompt("Digite o novo valor:");

    if (respostaValor !== null && respostaValor.trim() !== "") {
      let novoValor = Number(respostaValor.replace(",", "."));

      if (Number.isFinite(novoValor) && novoValor >= 0) {
        listaDespesas[index].valor = novoValor;
      }
    }
  }

   const { error } = await supabaseClient
    .from("despesas")
    .update({
      descricao: listaDespesas[index].descricao,
      categoria: listaDespesas[index].categoria,
      valor: listaDespesas[index].valor
    })
    .eq("id", listaDespesas[index].id);

  if (error) {
    alert("Erro ao atualizar despesa: " + error.message);
    await carregarDespesas();
    filtroCategoria();
    return;
  }

  calcularTotalDespesas();
  filtroCategoria();
}


//*******************************
// funcao excluir despesa
//*******************************
async function excluirDespesa(index) {
  let resposta = prompt(
    "Tem certeza de que deseja excluir esta despesa? Digite 'SIM' para confirmar.",
  );

  if (resposta !== null && resposta.toUpperCase() === "SIM") {
    const { error } = await supabaseClient
      .from("despesas")
      .delete()
      .eq("id", listaDespesas[index].id);

    if (error) {
      alert("Erro ao excluir despesa: " + error.message);
      return;
    }

    listaDespesas.splice(index, 1);

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

  document.getElementById("totalDespesas").textContent = total.toFixed(2) + "€";
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

      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`,
      )
        .then((response) => response.json())
        .then((data) => {
          let temperatura = data.current.temperature_2m;
          let codigoEstado = data.current.weather_code;
          let estado = "";

          switch (codigoEstado) {
            case 0:
              estado = "Céu limpo";
              break;
            case 1:
              estado = "Predominantemente limpo";
              break;
            case 2:
              estado = "Parcialmente nublado";
              break;
            case 3:
              estado = "Céu nublado";
              break;
            case 45:
            case 48:
              estado = "Nevoeiro";
              break;
            case 51:
            case 53:
            case 55:
              estado = "Chuvisco";
              break;
            case 61:
            case 63:
            case 65:
              estado = "Chuva";
              break;
            case 71:
            case 73:
            case 75:
              estado = "Neve";
              break;
            case 80:
            case 81:
            case 82:
              estado = "Aguaceiros";
              break;
            case 95:
            case 96:
            case 99:
              estado = "Trovoada";
              break;
            default:
              estado = "Estado indisponível";
          }

          console.log("Temperatura:", temperatura);
          console.log("Código do estado:", estado);

          document.getElementById("temperaturaAPI").textContent =
            "Temperatura: " + temperatura + "ºC";

          document.getElementById("estadoAPI").textContent =
            "Estado: " + estado;

          fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10`,
          )
            .then((resposta1) => resposta1.json())
            .then((data) => {
              let cidade =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.municipality;

              console.log(cidade);

              document.getElementById("cidadeAPI").textContent =
                "Cidade: " + cidade;
            });
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
document.getElementById("btnAtualizarAPI").addEventListener("click", mostrarTemperatura);


//*******************************
//* registar utilizador Supabase
//*******************************
async function registarUtilizador() {
  let email = document.getElementById("nomeUsuario").value;
  let senha = document.getElementById("senha").value;

  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: senha
  });

  if (error) {
    alert("Erro no registo: " + error.message);
  } else {
    alert("Utilizador registado com sucesso!");
    document.getElementById("formLogin").reset();
  }
}

// escutar o botão de registo
document.getElementById("btnRegistar").addEventListener("click", registarUtilizador);


//*******************************
//* carregar despesas do Supabase
//*******************************
async function carregarDespesas() {
  const { data, error } = await supabaseClient
    .from("despesas")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    alert("Erro ao carregar despesas: " + error.message);
    return;
  }

  listaDespesas = data;

  listarDespesas(listaDespesas);
  calcularTotalDespesas();
}