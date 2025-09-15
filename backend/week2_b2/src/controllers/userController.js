const { createUserService, loginService, getUserService } = require("../services/userService");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body; // thêm role
        const user = await createUserService(name, email, password, role);

        // Tạo token kèm role
        const access_token = jwt.sign(
            {
                email: user.email,
                name: user.name,
                role: user.role // thêm role vào payload
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        return res.status(200).json({
            EC: 0,
            access_token,
            user: {
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await loginService(email, password);

        if (!user) {
            return res.status(401).json({ EC: 1, EM: "Email/Password không hợp lệ" });
        }

        const access_token = jwt.sign(
            {
                email: user.email,
                name: user.name,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        return res.status(200).json({
            EC: 0,
            access_token,
            user: {
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const data = await getUserService();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAccount = async (req, res) => {
    return res.status(200).json(req.user);
};

module.exports = {
    createUser,
    handleLogin,
    getUser,
    getAccount
};
