import serverless from 'serverless-http';
import { buildServer } from '../../src/server';

let serverlessHandler: any;

async function getHandler() {
  if (!serverlessHandler) {
    const app = await buildServer();
    await app.ready();
    serverlessHandler = serverless(app.server);
  }
  return serverlessHandler;
}

export const handler = async (event: any, context: any) => {
  const h = await getHandler();
  return h(event, context);
};
