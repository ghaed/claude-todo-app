import { Client } from "@elastic/elasticsearch";

declare global {
  // eslint-disable-next-line no-var
  var __esClient: Client | undefined;
}

function getClient(): Client {
  if (!globalThis.__esClient) {
    globalThis.__esClient = new Client({ node: process.env.ELASTICSEARCH_URL! });
  }
  return globalThis.__esClient;
}

const INDEX = "todos";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
}

interface TodoSource {
  text: string;
  completed: boolean;
  created_at: string;
}

export async function ensureIndex(): Promise<void> {
  const client = getClient();
  const { body: exists } = await client.indices.exists({ index: INDEX });
  if (!exists) {
    await client.indices.create({
      index: INDEX,
      body: {
        mappings: {
          properties: {
            text: { type: "text" },
            completed: { type: "boolean" },
            created_at: { type: "date" },
          },
        },
      },
    });
  }
}

export async function getAllTodos(q?: string): Promise<Todo[]> {
  await ensureIndex();
  const client = getClient();
  const { body } = await client.search({
    index: INDEX,
    body: {
      query: q ? { match: { text: q } } : { match_all: {} },
      sort: [{ created_at: { order: "desc" } }],
      size: 100,
    },
  });
  const hits = (body as { hits: { hits: Array<{ _id: string; _source: TodoSource }> } }).hits.hits;
  return hits.map((hit) => ({ id: hit._id, ...hit._source }));
}

export async function createTodo(text: string): Promise<Todo> {
  await ensureIndex();
  const client = getClient();
  const created_at = new Date().toISOString();
  const { body } = await client.index({
    index: INDEX,
    refresh: true,
    body: { text, completed: false, created_at },
  });
  return { id: body._id, text, completed: false, created_at };
}

export async function toggleTodo(id: string): Promise<Todo> {
  const client = getClient();
  await client.update({
    index: INDEX,
    id,
    refresh: true,
    body: {
      script: {
        source: "ctx._source.completed = !ctx._source.completed",
        lang: "painless",
      },
    },
  });
  const { body } = await client.get({ index: INDEX, id });
  const doc = body as { _id: string; _source: TodoSource };
  return { id: doc._id, ...doc._source };
}

export async function deleteTodo(id: string): Promise<void> {
  const client = getClient();
  await client.delete({ index: INDEX, id, refresh: true });
}
