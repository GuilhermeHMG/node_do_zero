import pkg from "pg";
const { Client } = pkg;

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "123456",
  database: "postgres",
});

client.connect();

client.query("DROP TABLE IF EXISTS videos;", (err, res) => {
  if (err) {
    console.error("Erro ao apagar a tabela:", err);
  } else {
    console.log("Tabela apagada com sucesso!");
  }
});

client.query(
  "CREATE TABLE videos ( id TEXT PRIMARY KEY, title TEXT, description TEXT, duration INTEGER );",
  (err, res) => {
    if (err) {
      console.error("Erro ao criar a tabela:", err);
    } else {
      console.log("Tabela criada com sucesso!");
    }
    client.end();
  }
);
