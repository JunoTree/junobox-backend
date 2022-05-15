import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import box from './box';
import cwHelper from './utils/cwHelper';

const main = async () => {
  await cwHelper.initialize();

  const app = new Koa();
  
  // Middlewares
  app.use(bodyParser());
  app.use(cors());
  
  // Routes
  app.use(box.routes(), box.allowedMethods());
  
  app.listen(3500);
}

main();