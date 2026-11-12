
const API_URL = "http://localhost:3000/usuarios";

const listaUsuarios = document.getElementById("lista-usuarios");
const formCadastro = document.getElementById("form-cadastro");
const mensagemCadastro = document.getElementById("mensagem-cadastro");
const botaoAdicionar = document.getElementById("btn-adicionar");
const botaoSalvar = formCadastro.querySelector(".btn-enviar");

const campoNome = document.getElementById("game_name");
const campoTag = document.getElementById("tag_line");
const campoEmail = document.getElementById("email");
const campoSenha = document.getElementById("senha");
const campoRank = document.getElementById("rank_id");
const campoRR = document.getElementById("rr_atual");

// null = cadastro; número = ID do jogador em edição
let usuarioEmEdicao = null;


// ========================================
// MODO CADASTRO
// ========================================

function modoCadastro() {
    usuarioEmEdicao = null;

    formCadastro.reset();

    campoEmail.disabled = false;
    campoSenha.disabled = false;

    campoEmail.required = true;
    campoSenha.required = true;

    botaoSalvar.textContent = "CADASTRAR JOGADOR";
}


// ========================================
// MODO EDIÇÃO
// ========================================

function modoEdicao(usuario) {
    usuarioEmEdicao = usuario.id;

    campoNome.value = usuario.game_name;
    campoTag.value = usuario.tag_line;
    campoRank.value = usuario.rank_id;
    campoRR.value = usuario.rr_atual ?? 0;

    // O PUT atual não altera e-mail ou senha
    campoEmail.value = "";
    campoSenha.value = "";

    campoEmail.disabled = true;
    campoSenha.disabled = true;

    campoEmail.required = false;
    campoSenha.required = false;

    botaoSalvar.textContent = "SALVAR ALTERAÇÕES";
    mensagemCadastro.textContent = "";

    formCadastro.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ========================================
// READ - LISTAR JOGADORES
// ========================================

async function carregarUsuarios() {
    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP ${resposta.status}`);
        }

        const usuarios = await resposta.json();

        listaUsuarios.innerHTML = "";

        if (usuarios.length === 0) {
            listaUsuarios.textContent =
                "Nenhum jogador cadastrado.";
            return;
        }

        usuarios.forEach(usuario => {
            const jogador = document.createElement("div");
            jogador.className = "jogador-disponivel";

            const informacao = document.createElement("span");

            informacao.textContent =
                `${usuario.game_name}#${usuario.tag_line} - RR: ${usuario.rr_atual ?? 0}`;

            // BOTÃO EDITAR
            const botaoEditar = document.createElement("button");
            botaoEditar.textContent = "Editar";

            botaoEditar.addEventListener("click", () => {
                modoEdicao(usuario);
            });

            // BOTÃO EXCLUIR
            const botaoExcluir = document.createElement("button");
            botaoExcluir.textContent = "Excluir";

            botaoExcluir.addEventListener("click", async () => {
                const confirmar = confirm(
                    `Deseja realmente excluir ${usuario.game_name}#${usuario.tag_line}?`
                );

                if (!confirmar) {
                    return;
                }

                botaoExcluir.disabled = true;

                try {
                    const resposta = await fetch(
                        `${API_URL}/${usuario.id}`,
                        {
                            method: "DELETE"
                        }
                    );

                    if (!resposta.ok) {
                        throw new Error(
                            `Erro ao excluir: HTTP ${resposta.status}`
                        );
                    }

                    // Se o jogador excluído estava em edição,
                    // volta para o modo cadastro
                    if (usuarioEmEdicao === usuario.id) {
                        modoCadastro();
                    }

                    await carregarUsuarios();

                    mensagemCadastro.textContent =
                        "Jogador excluído com sucesso!";

                } catch (erro) {
                    console.error("Erro ao excluir jogador:", erro);

                    mensagemCadastro.textContent =
                        "Não foi possível excluir o jogador.";

                    botaoExcluir.disabled = false;
                }
            });

            jogador.append(
                informacao,
                botaoEditar,
                botaoExcluir
            );

            listaUsuarios.appendChild(jogador);
        });

    } catch (erro) {
        console.error("Erro ao carregar jogadores:", erro);

        listaUsuarios.textContent =
            "Não foi possível carregar os jogadores.";
    }
}


// ========================================
// CREATE E UPDATE
// ========================================

formCadastro.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const editando = usuarioEmEdicao !== null;

    const dadosUsuario = {
        game_name: campoNome.value.trim(),
        tag_line: campoTag.value.trim(),
        rank_id: Number(campoRank.value),
        rr_atual: Number(campoRR.value)
    };

    // E-mail e senha só são enviados no cadastro
    if (!editando) {
        dadosUsuario.email = campoEmail.value.trim();
        dadosUsuario.senha = campoSenha.value;
    }

    const url = editando
        ? `${API_URL}/${usuarioEmEdicao}`
        : API_URL;

    const metodo = editando ? "PUT" : "POST";

    botaoSalvar.disabled = true;
    mensagemCadastro.textContent = "Salvando jogador...";

    try {
        const resposta = await fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosUsuario)
        });

        if (!resposta.ok) {
            if (resposta.status === 409) {
                throw new Error("Este e-mail já está cadastrado.");
            }

            throw new Error(`Erro HTTP ${resposta.status}`);
        }

        modoCadastro();

        await carregarUsuarios();

        mensagemCadastro.textContent = editando
            ? "Jogador atualizado com sucesso!"
            : "Jogador cadastrado com sucesso!";

    } catch (erro) {
        console.error("Erro ao salvar jogador:", erro);

        mensagemCadastro.textContent = erro.message;

    } finally {
        botaoSalvar.disabled = false;
    }
});


// ========================================
// BOTÃO ADICIONAR JOGADOR
// ========================================

botaoAdicionar.addEventListener("click", () => {
    modoCadastro();
    mensagemCadastro.textContent = "";

    formCadastro.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});


// ========================================
// CARREGAR AO ABRIR A PÁGINA
// ========================================

carregarUsuarios();
