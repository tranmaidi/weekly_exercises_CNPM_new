import fs from "fs";
import path from "path";
import { Sequelize, DataTypes, Dialect } from "sequelize";
import process from "process";

// Lấy môi trường hiện tại
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

// Import config.ts thay vì config.json
import configFile from "../config/config";

// Lấy config theo env
const config = (configFile as any)[env];

// Khởi tạo sequelize
let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect as Dialect,
    logging: false,
  });
}

// Tạo đối tượng db
const db: any = {};

// Đọc tất cả các file model trong folder hiện tại
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      (file.slice(-3) === ".ts" || file.slice(-3) === ".js") && // hỗ trợ TS & JS
      file.indexOf(".test.") === -1
    );
  })
  .forEach((file) => {
    const modelModule = require(path.join(__dirname, file));

    // Lấy hàm init model (default export)
    const modelFn = modelModule.default || modelModule;

    const model = modelFn(sequelize, DataTypes);
    db[model.name] = model;
  });

// Gọi associate nếu có
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Gắn Sequelize instance
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
