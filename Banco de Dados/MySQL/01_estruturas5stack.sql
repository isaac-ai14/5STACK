USE fivestack;


-- 1. RANK
CREATE TABLE `rank` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_patente VARCHAR(50) NOT NULL,
    divisao INT,
    tier_nivel INT NOT NULL UNIQUE,
    icone_url VARCHAR(255),

    CONSTRAINT chk_rank_tier
        CHECK (tier_nivel BETWEEN 1 AND 25),

    CONSTRAINT chk_rank_divisao
        CHECK (
            (nome_patente = 'Radiante' AND divisao IS NULL)
            OR
            (nome_patente <> 'Radiante' AND divisao BETWEEN 1 AND 3)
        )
);


-- 2. FUNCAO
CREATE TABLE funcao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_funcao VARCHAR(30) NOT NULL UNIQUE
);


-- 3. USUARIO
CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    puuid VARCHAR(78) UNIQUE,
    game_name VARCHAR(50),
    tag_line VARCHAR(10),
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    rank_id INT,
    rr_atual INT,
    reputacao_media DECIMAL(3,2),
    atualizado_em TIMESTAMP NULL,

    CONSTRAINT fk_usuario_rank
        FOREIGN KEY (rank_id) REFERENCES `rank`(id),

    CONSTRAINT chk_usuario_rr
        CHECK (rr_atual >= 0),

    CONSTRAINT chk_usuario_reputacao
        CHECK (reputacao_media BETWEEN 1 AND 5),

    CONSTRAINT chk_usuario_riot
        CHECK (
            (puuid IS NULL AND game_name IS NULL AND tag_line IS NULL)
            OR
            (puuid IS NOT NULL AND game_name IS NOT NULL AND tag_line IS NOT NULL)
        )
);


-- 4. USUARIO_FUNCAO
CREATE TABLE usuario_funcao (
    usuario_id INT NOT NULL,
    funcao_id INT NOT NULL,
    eh_principal BOOLEAN NOT NULL DEFAULT FALSE,

    PRIMARY KEY (usuario_id, funcao_id),

    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (funcao_id) REFERENCES funcao(id)
);


CREATE TABLE lobby (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lider_id INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    vagas_totais INT NOT NULL DEFAULT 5,
    rank_min_id INT,
    rank_max_id INT,
    reputacao_minima DECIMAL(3,2),
    status VARCHAR(20) NOT NULL DEFAULT 'ABERTO',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (lider_id) REFERENCES usuario(id),
    FOREIGN KEY (rank_min_id) REFERENCES `rank`(id),
    FOREIGN KEY (rank_max_id) REFERENCES `rank`(id),

    CONSTRAINT chk_lobby_vagas
        CHECK (vagas_totais BETWEEN 1 AND 5),

    CONSTRAINT chk_lobby_reputacao
        CHECK (reputacao_minima BETWEEN 1 AND 5),

    CONSTRAINT chk_lobby_status
        CHECK (status IN ('ABERTO', 'PROCURANDO', 'FECHADO'))
);


-- 6. LOBBY_MEMBRO
CREATE TABLE lobby_membro (
    lobby_id INT NOT NULL,
    usuario_id INT NOT NULL,
    entrou_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (lobby_id, usuario_id),

    FOREIGN KEY (lobby_id) REFERENCES lobby(id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);


-- 7. FUNCAO_DESEJADA_LOBBY
CREATE TABLE funcao_desejada_lobby (
    lobby_id INT NOT NULL,
    funcao_id INT NOT NULL,
    quantidade INT NOT NULL,

    PRIMARY KEY (lobby_id, funcao_id),

    FOREIGN KEY (lobby_id) REFERENCES lobby(id),
    FOREIGN KEY (funcao_id) REFERENCES funcao(id),

    CONSTRAINT chk_funcao_quantidade
        CHECK (quantidade > 0)
);


-- 8. CONVITE
CREATE TABLE convite (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lobby_id INT NOT NULL,
    remetente_id INT NOT NULL,
    destinatario_id INT NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (lobby_id) REFERENCES lobby(id),
    FOREIGN KEY (remetente_id) REFERENCES usuario(id),
    FOREIGN KEY (destinatario_id) REFERENCES usuario(id),

    CONSTRAINT chk_convite_tipo
        CHECK (tipo IN ('CONVITE', 'SOLICITACAO')),

    CONSTRAINT chk_convite_status
        CHECK (status IN (
            'PENDENTE', 'ACEITO', 'RECUSADO', 'CANCELADO'
        )),

    CONSTRAINT chk_convite_usuarios
        CHECK (remetente_id <> destinatario_id)
);


-- 9. MENSAGEM_CHAT
CREATE TABLE mensagem_chat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lobby_id INT NOT NULL,
    usuario_id INT NOT NULL,
    conteudo TEXT NOT NULL,
    enviado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (lobby_id, usuario_id)
        REFERENCES lobby_membro(lobby_id, usuario_id),

    CONSTRAINT chk_mensagem_conteudo
        CHECK (CHAR_LENGTH(TRIM(conteudo)) > 0)
);


-- 10. SESSAO_JOGO
CREATE TABLE sessao_jogo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lobby_id INT NOT NULL,
    iniciada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    encerrada_em TIMESTAMP NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'EM_ANDAMENTO',

    FOREIGN KEY (lobby_id) REFERENCES lobby(id),

    CONSTRAINT chk_sessao_status
        CHECK (status IN (
            'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'
        )),

    CONSTRAINT chk_sessao_datas
        CHECK (
            encerrada_em IS NULL
            OR encerrada_em >= iniciada_em
        )
);


-- 11. SESSAO_PARTICIPANTE
CREATE TABLE sessao_participante (
    sessao_id INT NOT NULL,
    usuario_id INT NOT NULL,

    PRIMARY KEY (sessao_id, usuario_id),

    FOREIGN KEY (sessao_id) REFERENCES sessao_jogo(id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);


-- 12. AVALIACAO
CREATE TABLE avaliacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sessao_id INT NOT NULL,
    avaliador_id INT NOT NULL,
    avaliado_id INT NOT NULL,
    nota INT NOT NULL,
    tag_comportamento VARCHAR(50),
    comentario TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (sessao_id, avaliador_id)
        REFERENCES sessao_participante(sessao_id, usuario_id),

    FOREIGN KEY (sessao_id, avaliado_id)
        REFERENCES sessao_participante(sessao_id, usuario_id),

    CONSTRAINT chk_avaliacao_nota
        CHECK (nota BETWEEN 1 AND 5),

    CONSTRAINT chk_avaliacao_usuarios
        CHECK (avaliador_id <> avaliado_id),

    CONSTRAINT uq_avaliacao_unica
        UNIQUE (sessao_id, avaliador_id, avaliado_id)
);


-- INSERINDO AS PATENTES DO VALORANT
INSERT INTO `rank` (nome_patente, divisao, tier_nivel)
VALUES
('Ferro', 1, 1),
('Ferro', 2, 2),
('Ferro', 3, 3),
('Bronze', 1, 4),
('Bronze', 2, 5),
('Bronze', 3, 6),
('Prata', 1, 7),
('Prata', 2, 8),
('Prata', 3, 9),
('Ouro', 1, 10),
('Ouro', 2, 11),
('Ouro', 3, 12),
('Platina', 1, 13),
('Platina', 2, 14),
('Platina', 3, 15),
('Diamante', 1, 16),
('Diamante', 2, 17),
('Diamante', 3, 18),
('Ascendente', 1, 19),
('Ascendente', 2, 20),
('Ascendente', 3, 21),
('Imortal', 1, 22),
('Imortal', 2, 23),
('Imortal', 3, 24),
('Radiante', NULL, 25);

-- INSERINDO AS FUNCOES DOS AGENTES
INSERT INTO funcao (nome_funcao)
VALUES
('Duelista'),
('Iniciador'),
('Controlador'),
('Sentinela');
