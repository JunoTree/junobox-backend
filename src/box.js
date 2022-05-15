import Router from "@koa/router";
import Nedb from 'nedb';
import dbHelper from "./utils/dbHelper";
import RESPONSE_CODE from "./utils/responsCode";
import { v4 } from 'uuid';
import _ from "lodash";

const router = new Router({prefix: '/box'});

router.post('/create', async (ctx) => {
  const body = ctx.request.body;
  const { creator, boxes } = body;
  console.log('body: ', body);
  const boxStore = new Nedb({ filename: 'box.db', autoload: true });

  const boxGroupId = v4();
  await dbHelper.insert(boxStore, { boxGroupId, creator, boxes });

  const data = { boxGroupId }
  console.log('data: ', data);
  ctx.body = { code: RESPONSE_CODE.SUCCESS, data };
});

router.post('/get', async (ctx) => {
  const body = ctx.request.body;
  const { viewer, boxGroupId } = body;
  const boxStore = new Nedb({ filename: 'box.db', autoload: true });
  
  // 从链上取得状态数据，返回一个未被接收的红包
  // 过滤掉已成交的红包
  // 如果红包查看者是当前用户，返回这个红包
  // 优先返回查看者为空，并在记录查看者
  // 如果没有查看者为空的红包,返回很久未领取的红包，并返回空
  // 先简化，返回viewer为空的红包

  const [foundBoxGroup] = await dbHelper.findOne(boxStore, { boxGroupId });
  if (!foundBoxGroup) {
    ctx.body = { code: RESPONSE_CODE.NOTFOUND };
  }
  console.log('foundBoxGroup: ', foundBoxGroup);

  const { boxes } = foundBoxGroup;
  console.log("boxes: ", boxes);
  console.log("viewer: ", viewer);

  const foundBox = _.find(boxes, { viewer });
  console.log('foundBox: ', foundBox);

  if (foundBox) {
    ctx.body = { code: RESPONSE_CODE.RECEIVED };
    return;
  }

  const unViewBox = _.find(boxes, ({ viewer }) => _.isEmpty(viewer));
  console.log('unViewBox: ', unViewBox);
  unViewBox.viewer = viewer;

  console.log('foundBoxGroup: ', JSON.stringify(foundBoxGroup));

  const updatedBox = await dbHelper.update(boxStore, { boxGroupId: foundBoxGroup.boxGroupId }, foundBoxGroup);
  console.log('updatedBox: ', updatedBox);

  ctx.body = { code: RESPONSE_CODE.SUCCESS, data: unViewBox };
});

export default router;
