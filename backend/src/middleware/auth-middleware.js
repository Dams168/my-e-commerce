import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Unauthorized" }).end();
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: "Unauthorized" }).end();
            } else {
                req.user = decoded;
                next();
            }
        })
    }

}