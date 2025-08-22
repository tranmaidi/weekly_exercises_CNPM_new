import bcrypt from 'bcryptjs'; // import thư viện bcryptjs
import db from '../models/index'; // import database

const salt = bcrypt.genSaltSync(10); // thuật toán hash password

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
}

// hàm tạo user với tham số data
let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId
            });
            resolve('OK create a new user successful!');
        } catch (e) {
            reject(e);
        }
    });
}

// lấy tất cả findAll CRUD
let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true, // hiển thị dữ liệu gốc
            });
            resolve(users); // hàm trả về kết quả
        } catch (e) {
            reject(e);
        }
    });
}

// lấy findOne CRUD
let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }, // query điều kiện cho tham số
                raw: true
            });
            if (user) {
                resolve(user); // hàm trả về kết quả
            } else {
                resolve([]); // hàm trả về kết quả rỗng
            }
        } catch (e) {
            reject(e);
        }
    });
}

// hàm put CRUD
let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id } // query điều kiện cho tham số
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                // lấy danh sách user
                let allusers = await db.User.findAll();
                resolve(allusers);
            } else {
                resolve(); // hàm trả về kết quả rỗng
            }
        } catch (e) {
            reject(e);
        }
    });
}

// hàm xóa user
let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            });
            if (user) {
                await user.destroy();
            }
            resolve(); // là return
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUser: updateUser,
    deleteUserById: deleteUserById,
    hashUserPassword: hashUserPassword
};