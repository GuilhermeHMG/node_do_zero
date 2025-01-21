/**
 * 1. CRIANDO SERVIDOR COM NODE.JS NATIVO
 *
 *
 * Estamos criando neste arquivo um SERVIDOR NATIVO EM NODE, ou seja, um servidor HTTP sem
 * nenhum tipo de framework, apenas com o módulo 'http' do Node.js, para fins de aprendizagem.
 * Mas nenhuma empresa cria um servidor assim, pois é muito trabalhoso e não é escalável. Por isso,
 * criamos servidores com frameworks, que facilitam a criação de servidores HTTP.
 */

// // Importa a função createServer do módulo 'http' do Node.js
// import { createServer } from "node:http";

// // Cria um servidor HTTP
// const server = createServer((request, response) => {
//   // Escreve a resposta "oi" para o cliente
//   response.write("oi");

//   // Finaliza a resposta
//   return response.end();
// });

// // Faz o servidor escutar na porta 3333
// server.listen(3333);

/**
 * 2. CRIANDO SERVIDOR COM FASTIFY (BEM MELHOR)
 *
 *
 */
import { fastify } from "fastify";
// import { databaseMemory } from "./database-memory.js";
import { DatabasePostgres } from "./database-postgres.js";
import { title } from "node:process";

const server = fastify();

const database = new DatabasePostgres();

// GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD
//  Request Body

server.post("/videos", async (request, reply) => {
  const { title, description, duration } = request.body;

  await database.create({
    title: title,
    description: description,
    duration: duration,
  });

  return reply.status(201).send();
});

server.get("/videos", async (request) => {
  const search = request.query.search;

  const videos = await database.list(search);

  return videos;
});

server.put("/videos/:id", (request, reply) => {
  const videoId = request.params.id;
  const { title, description, duration } = request.body;

  database.update(videoId, {
    title: title,
    description: description,
    duration: duration,
  });

  return reply.status(204).send();
});

server.delete("/videos/:id", (request, reply) => {
  const videoId = request.params.id;

  database.delete(videoId);

  return reply.status(204).send();
});

server.listen({
  port: process.env.PORT ?? 3333,
});
