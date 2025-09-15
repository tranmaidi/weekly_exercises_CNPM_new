require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const white_lists = [
        "/v1/api/",
        "/v1/api/register",
        "/v1/api/login",
        "/v1/api/elasticsearch/index/products",
        "/v1/api/elasticsearch/search"
    ];
    const urlWithoutQuery = req.originalUrl.split("?")[0];
    if (white_lists.includes(urlWithoutQuery)) {
        console.log("✅ Bypass auth:", urlWithoutQuery);
        return next();
    } else {
        if (req?.headers?.authorization?.split(' ')?.[1]) {
            const token = req.headers.authorization.split(' ')[1];

            //verify token
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = {
                    email: decoded.email,
                    name: decoded.name,
                    role: decoded.role,
                    createdBy: "holdanit"
                }
                console.log(">>> check token: ", decoded)
                next();
            } catch (error) {
                return res.status(401).json({
                    message: "Token đã hết hạn/hoặc không hợp lệ"
                })
            }

        } else {
            return res.status(401).json({
                message: "Bạn chưa truyền Access Token ở header/hoặc token đã hết hạn"
            })
        }
    }
}

module.exports = auth;