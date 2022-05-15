const util = require('node:util');

const insert = async (db, params) => util.promisify(db.insert).bind(db)(params);
const findOne = async (db, params) => util.promisify(db.find).bind(db)(params);
const update = async (db, query, params) => util.promisify(db.update).bind(db)(query, params);

export default { insert, findOne, update };