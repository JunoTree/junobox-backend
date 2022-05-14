import Router from "@koa/router";

const router = new Router({prefix: '/box'});

router.post('/create', async (ctx) => {
  const body = ctx.request.body;
  console.log('body: ', body);
  ctx.body = { code: 0 };
})

export default router;
