
const abrirConvites = document.getElementById("abrir-convites");
const modal = document.getElementById("modal-convites");
const fecharModal = document.getElementById("fechar-modal");
const listaJogadores = document.getElementById("lista-jogadores");
const notificacao = document.getElementById("notificacao-convite");

// Lista de jogadores fictícios
const jogadores = [
    { nome: "Rafael", elo: "Ouro" },
    { nome: "Bruno", elo: "Platina" },
    { nome: "Matheus", elo: "Diamante" },
    { nome: "Pedro", elo: "Prata" }
];

// Abre a janela de convites
abrirConvites.addEventListener("click", () => {
    modal.style.display = "flex";
    notificacao.textContent = "";
});

// Exibe os jogadores disponíveis
jogadores.forEach(jogador => {
    const item = document.createElement("div");
    item.className = "jogador-disponivel";

    const informacao = document.createElement("span");
    informacao.textContent = `${jogador.nome} - Elo ${jogador.elo}`;

    const botao = document.createElement("button");
    botao.textContent = "Convidar";

    botao.addEventListener("click", () => {
        notificacao.textContent =
            `Convite enviado com sucesso para ${jogador.nome}!`;
    });

    item.append(informacao, botao);
    listaJogadores.appendChild(item);
});

// Fecha a janela pelo botão X
fecharModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Fecha ao clicar fora da janela
modal.addEventListener("click", evento => {
    if (evento.target === modal) {
        modal.style.display = "none";
    }
});



// Formulário de Contato

const formularioContato = document.getElementById("formulario-contato");

if (formularioContato) {
    formularioContato.addEventListener("submit", function(evento) {
        evento.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const assunto = document.getElementById("assunto").value;
        const mensagem = document.getElementById("mensagem").value.trim();

        if (!formularioContato.checkValidity()) {
            formularioContato.reportValidity();
            return;
        }

        if (!nome || !email || !assunto || !mensagem) {
            document.getElementById("mensagem-status").textContent =
                "Preencha todos os campos.";
            return;
        }

        document.getElementById("mensagem-status").textContent =
            "Mensagem enviada com sucesso! Obrigado pelo contato.";

        formularioContato.reset();
    });
}
