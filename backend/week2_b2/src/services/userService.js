require("dotenv").config();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const saltRounds = 10;

// ===== Tạo user mới =====
const createUserService = async (name, email, password, role = "Admin") => {
    try {
        // Kiểm tra user tồn tại
        const userExist = await User.findOne({ email });
        if (userExist) {
            console.log(`>>> User exist, chọn email khác: ${email}`);
            return null;
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, saltRounds);

        // Lưu user vào DB
        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role
        });

        // Trả về object đầy đủ
        return {
            email: user.email,
            name: user.name,
            role: user.role
        };
    } catch (error) {
        console.log(error);
        return null;
    }
};

// ===== Login =====
const loginService = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return null;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return null;
        }

        return user; // trả document gốc
    } catch (error) {
        console.log(error);
        return null;
    }
};

// ===== Lấy danh sách user =====
const getUserService = async () => {
    try {
        const result = await User.find({}).select("-password");
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
};

module.exports = {
    createUserService,
    loginService,
    getUserService
};
