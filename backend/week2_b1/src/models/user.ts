import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// 1. Khai báo kiểu attributes của User
interface UserAttributes {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  gender: boolean;
  image: string;
  roleId: string;
  positionId: string;
}

// 2. Khai báo những trường có thể null khi tạo (id sẽ được tự tăng)
type UserCreationAttributes = Optional<UserAttributes, "id">;

// 3. Tạo class User
export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName!: string;
  public address!: string;
  public phoneNumber!: string;
  public gender!: boolean;
  public image!: string;
  public roleId!: string;
  public positionId!: string;

  // timestamps mặc định Sequelize sẽ thêm nếu bật
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // Định nghĩa mối quan hệ tại đây
    // Ví dụ: this.hasMany(models.Order, { foreignKey: "userId" });
  }
}

// 4. Hàm init model
export default function initUser(sequelize: Sequelize): typeof User {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gender: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      roleId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      positionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users", // nếu bảng trong DB tên Users
    }
  );

  return User;
}
