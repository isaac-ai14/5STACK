// Elementos da página principal
const abrirConvites = document.getElementById("abrir-convites");
const modal = document.getElementById("modal-convites");
const fecharModal = document.getElementById("fechar-modal");
const listaJogadores = document.getElementById("lista-jogadores");
const notificacao = document.getElementById("notificacao-convite");
const formJogador = document.getElementById("form-jogador");


// Pega os jogadores salvos no navegador
// Se não existir nada salvo, usa essa lista padrão
let jogadores = JSON.parse(localStorage.getItem("jogadores")) || [
    { id: 1, nome: "Rafael", elo: "Ouro" },
    { id: 2, nome: "Bruno", elo: "Platina" },
    { id: 3, nome: "Matheus", elo: "Diamante" },
    { id: 4, nome: "Pedro", elo: "Prata" }
];


// Salva a lista de jogadores no navegador
function salvarJogadores() {
    localStorage.setItem("jogadores", JSON.stringify(jogadores));
}


// Mostra os jogadores na tela
function renderizarJogadores() {
    if (!listaJogadores) {
        return;
    }

    // Limpa a lista antes de montar novamente
    listaJogadores.innerHTML = "";

    jogadores.forEach(jogador => {

        const item = document.createElement("div");
        item.className = "jogador-disponivel";


        // Nome e elo do jogador
        const informacao = document.createElement("span");
        informacao.textContent = `${jogador.nome} - Elo ${jogador.elo}`;


        // Botão de convidar
        const botaoConvidar = document.createElement("button");
        botaoConvidar.textContent = "Convidar";

        botaoConvidar.addEventListener("click", () => {
            if (notificacao) {
                notificacao.textContent =
                    `Convite enviado com sucesso para ${jogador.nome}!`;
            }
        });


        // Botão de editar
        const botaoEditar = document.createElement("button");
        botaoEditar.textContent = "Editar";

        botaoEditar.addEventListener("click", () => {

            const novoNome = prompt(
                "Digite o novo nome:",
                jogador.nome
            );

            // Se cancelar ou deixar vazio, não altera
            if (!novoNome || !novoNome.trim()) {
                return;
            }

            const novoElo = prompt(
                "Digite o novo elo:",
                jogador.elo
            );

            if (!novoElo || !novoElo.trim()) {
                return;
            }

            jogador.nome = novoNome.trim();
            jogador.elo = novoElo.trim();

            salvarJogadores();
            renderizarJogadores();

            if (notificacao) {
                notificacao.textContent =
                    "Jogador atualizado com sucesso!";
            }
        });


        // Botão de excluir
        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";

        botaoExcluir.addEventListener("click", () => {

            const confirmar = confirm(
                `Deseja realmente excluir ${jogador.nome}?`
            );

            if (!confirmar) {
                return;
            }

            jogadores = jogadores.filter(
                jogadorAtual => jogadorAtual.id !== jogador.id
            );

            salvarJogadores();
            renderizarJogadores();

            if (notificacao) {
                notificacao.textContent =
                    "Jogador excluído com sucesso!";
            }
        });


        // Coloca tudo dentro do card do jogador
        item.append(
            informacao,
            botaoConvidar,
            botaoEditar,
            botaoExcluir
        );

        listaJogadores.appendChild(item);
    });
}


// Abre o modal de convites
if (abrirConvites && modal) {
    abrirConvites.addEventListener("click", () => {
        modal.style.display = "flex";

        if (notificacao) {
            notificacao.textContent = "";
        }
    });
}


// Fecha o modal pelo botão X
if (fecharModal && modal) {
    fecharModal.addEventListener("click", () => {
        modal.style.display = "none";
    });
}


// Fecha o modal clicando fora da caixa
if (modal) {
    modal.addEventListener("click", evento => {
        if (evento.target === modal) {
            modal.style.display = "none";
        }
    });
}


// CREATE
// Adiciona um novo jogador
if (formJogador) {

    formJogador.addEventListener("submit", evento => {

        evento.preventDefault();

        const campoNome =
            document.getElementById("nome-jogador-crud");

        const campoElo =
            document.getElementById("elo-jogador-crud");

        const nome = campoNome.value.trim();
        const elo = campoElo.value;

        if (!nome || !elo) {
            return;
        }

        const novoJogador = {
            id: Date.now(),
            nome: nome,
            elo: elo
        };

        jogadores.push(novoJogador);

        salvarJogadores();
        renderizarJogadores();

        formJogador.reset();

        if (notificacao) {
            notificacao.textContent =
                `${nome} foi adicionado com sucesso!`;
        }
    });
}


// READ
// Mostra os jogadores assim que a página carregar
renderizarJogadores();



// ----------------------------------------------------
// FORMULÁRIO DE CONTATO
// ----------------------------------------------------

const formularioContato =
    document.getElementById("formulario-contato");

if (formularioContato) {

    formularioContato.addEventListener(
        "submit",
        function(evento) {

            evento.preventDefault();

            const nome =
                document.getElementById("nome").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const assunto =
                document.getElementById("assunto").value;

            const mensagem =
                document.getElementById("mensagem").value.trim();

            const mensagemStatus =
                document.getElementById("mensagem-status");


            // Usa a própria validação do HTML
            if (!formularioContato.checkValidity()) {
                formularioContato.reportValidity();
                return;
            }


            // Verificação extra dos campos
            if (!nome || !email || !assunto || !mensagem) {

                mensagemStatus.textContent =
                    "Preencha todos os campos.";

                return;
            }


            mensagemStatus.textContent =
                "Mensagem enviada com sucesso! Obrigado pelo contato.";

            formularioContato.reset();
        }
    );
}