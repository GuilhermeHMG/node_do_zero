import pkg from "pg";
import { randomUUID } from "node:crypto";
import { config } from "dotenv";
const { Client } = pkg;

// Carregar as variáveis de ambiente do arquivo .env
config();

export class DatabasePostgres {
  #client;

  constructor() {
    this.#client = new Client({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: process.env.DB_PORT,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    this.#client.connect();
  }

  async list(search) {
    try {
      const query = search
        ? `SELECT * FROM videos WHERE title ILIKE $1 OR description ILIKE $1`
        : `SELECT * FROM videos`;
      const values = search ? [`%${search}%`] : [];
      const res = await this.#client.query(query, values);
      return res.rows;
    } catch (err) {
      console.error("Erro ao listar vídeos:", err);
      throw err;
    }
  }

  async create(video) {
    try {
      const { title, description, duration } = video;
      const id = randomUUID();
      const query = `INSERT INTO videos (id, title, description, duration) VALUES ($1, $2, $3, $4) RETURNING *`;
      const values = [id, title, description, duration];
      const res = await this.#client.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error("Erro ao criar vídeo:", err);
      throw err;
    }
  }

  async update(id, video) {
    try {
      const { title, description, duration } = video;
      const query = `
        UPDATE videos
        SET title = $1, description = $2, duration = $3
        WHERE id = $4
        RETURNING *`;
      const values = [title, description, duration, id];
      const res = await this.#client.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error("Erro ao atualizar vídeo:", err);
      throw err;
    }
  }

  async delete(id) {
    try {
      const query = `DELETE FROM videos WHERE id = $1 RETURNING *`;
      const values = [id];
      const res = await this.#client.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error("Erro ao deletar vídeo:", err);
      throw err;
    }
  }
}
