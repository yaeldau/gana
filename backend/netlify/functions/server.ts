import serverless from 'serverless-http';
import { buildServer } from '../../src/server';

let handler: any;

async function getHandler() {
  if (!handler) {
    const app = await buildServer();
    await app.ready();
    handler = serverless(app.server);
  }
  return handler;
}

export const handler = async (event: any, context: any) => {
  const h = await getHandler();
  return h(event, context);
};
