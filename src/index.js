import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import box from './box';

const app = new Koa();

// Middlewares
app.use(bodyParser());

// Routes
app.use(box.routes(), box.allowedMethods());

app.listen(3000);
