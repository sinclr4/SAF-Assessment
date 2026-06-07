import { CosmosClient, Container, Database } from "@azure/cosmos";

let client: CosmosClient | null = null;
let database: Database | null = null;
let container: Container | null = null;

function getClient(): CosmosClient {
  if (!client) {
    const endpoint = process.env.COSMOS_ENDPOINT;
    const key = process.env.COSMOS_KEY;
    if (!endpoint || !key) {
      throw new Error(
        "COSMOS_ENDPOINT and COSMOS_KEY environment variables must be set"
      );
    }
    client = new CosmosClient({ endpoint, key });
  }
  return client;
}

export async function getContainer(): Promise<Container> {
  if (container) return container;

  const dbName = process.env.COSMOS_DATABASE ?? "saf-assessment";
  const containerName = process.env.COSMOS_CONTAINER ?? "submissions";

  const cosmosClient = getClient();

  const { database: db } = await cosmosClient.databases.createIfNotExists({
    id: dbName,
  });
  database = db;

  const { container: c } = await db.containers.createIfNotExists({
    id: containerName,
    partitionKey: { paths: ["/id"] },
  });
  container = c;

  return container;
}
