import { handleRequest } from './routes/routes.config';
import newUUIDv4 from './utils/uuid-gen';
import type { RequestInterface } from './interfaces/custom-request.interface';
import { connectMongo } from './utils/mongo-connector';
import { translate, loadTranslations } from './utils/18n';
import { startServerConsole } from './utils/server-console';

// i18n setup
await loadTranslations();
global.t = translate;
global.conn = await connectMongo();

const server = Bun.serve({
  port: process.env.CUSTOM_PORT || 3000,
  hostname: "0.0.0.0",
  fetch(req: RequestInterface) {
    req.custom = {
      tsStart: performance.now(),
      transactionId: newUUIDv4()
    }
    return handleRequest(req);
  },
});

startServerConsole();