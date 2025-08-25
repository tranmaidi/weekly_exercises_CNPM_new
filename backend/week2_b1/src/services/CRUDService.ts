import bcrypt from "bcryptjs";
import db from "../models"; // Sequelize models đã export từ index.ts
import { User } from "../models/user"; // import model nếu bạn có file user.ts riêng

const salt = bcrypt.genSaltSync(10);

// Hàm hash password
const hashUserPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, salt);
};

// Hàm tạo user
const createNewUser = async (data: any): Promise<string> => {
  const hashPasswordFromBcrypt = await hashUserPassword(data.password);

  await db.User.create({
    email: data.email,
    password: hashPasswordFromBcrypt,
    firstName: data.firstName,
    lastName: data.lastName,
    address: data.address,
    phoneNumber: data.phoneNumber,
    gender: data.gender === "1" ? true : false,
    roleId: data.roleId,
  });

  return "OK create a new user successful!";
};

// Lấy tất cả user
const getAllUser = async (): Promise<User[]> => {
  const users = await db.User.findAll({ raw: true });
  return users;
};

// Lấy user theo id
const getUserInfoById = async (userId: number): Promise<User | null> => {
  const user = await db.User.findOne({
    where: { id: userId },
    raw: true,
  });
  return user;
};

// Update user
const updateUser = async (data: any): Promise<User[] | undefined> => {
  const user = await db.User.findOne({ where: { id: data.id } });

  if (user) {
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.address = data.address;
    await user.save();

    const allUsers = await db.User.findAll();
    return allUsers;
  }

  return undefined;
};

// Xóa user
const deleteUserById = async (userId: number): Promise<void> => {
  const user = await db.User.findOne({ where: { id: userId } });
  if (user) {
    await user.destroy();
  }
};

export default {
  createNewUser,
  getAllUser,
  getUserInfoById,
  updateUser,
  deleteUserById,
  hashUserPassword,
};
