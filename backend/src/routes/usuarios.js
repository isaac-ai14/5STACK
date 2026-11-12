import { Router } from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';

const router = Router();

// GET /usuarios
router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT id, game_name, tag_line, email, rank_id, rr_atual, reputacao_media, atualizado_em FROM usuario'
    );

    res.json(resultado.rows);

  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      mensagem: 'Erro ao buscar usuários'
    });
  }
});

// GET /usuarios/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      `SELECT id, game_name, tag_line, email, rank_id,
              rr_atual, reputacao_media, atualizado_em
       FROM usuario WHERE id = $1`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Usuário não encontrado'
      });
    }

    res.json(resultado.rows[0]);

  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      mensagem: 'Erro ao buscar usuário'
    });
  }
});


// POST /usuarios
router.post('/', async (req, res) => {
  const { game_name, tag_line, email, senha, rank_id, rr_atual } = req.body;

  try {
    if (!game_name || !tag_line || !email || !senha) {
      return res.status(400).json({
        mensagem: 'Preencha os campos obrigatórios'
      });
    }

    const senha_hash = await bcrypt.hash(senha, 10);

    const resultado = await pool.query(
      `INSERT INTO usuario
       (game_name, tag_line, email, senha_hash, rank_id, rr_atual)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, game_name, tag_line, email, rank_id, rr_atual`,
      [
        game_name,
        tag_line,
        email,
        senha_hash,
        rank_id ?? null,
        rr_atual ?? null
      ]
    );

    res.status(201).json(resultado.rows[0]);

  } catch (erro) {
    console.error(erro);

    if (erro.code === '23505') {
      return res.status(409).json({
        mensagem: 'Este e-mail já está cadastrado'
      });
    }

    res.status(500).json({
      mensagem: 'Erro ao cadastrar usuário'
    });
  }
});

// PUT /usuarios/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  const { game_name, tag_line, rank_id, rr_atual } = req.body;

  try {
    const resultado = await pool.query(
      `UPDATE usuario
       SET game_name = $1,
           tag_line = $2,
           rank_id = $3,
           rr_atual = $4
       WHERE id = $5
       RETURNING id, game_name, tag_line, rank_id, rr_atual`,
      [game_name, tag_line, rank_id, rr_atual, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Usuário não encontrado'
      });
    }

    res.json(resultado.rows[0]);

  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      mensagem: 'Erro ao atualizar usuário'
    });
  }
});

// DELETE /usuarios/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      'DELETE FROM usuario WHERE id = $1 RETURNING id',
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Usuário não encontrado'
      });
    }

    res.status(200).json({
      mensagem: 'Usuário excluído com sucesso'
    });

  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      mensagem: 'Erro ao excluir usuário'
    });
  }
});

export default router;