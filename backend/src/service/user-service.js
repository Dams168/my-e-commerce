import { PrismaClient } from "@prisma/client";
import { validate } from "../validation/validation.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loginValidation, registerValidation } from "../validation/user-validation.js";
const prisma = new PrismaClient();

const register = async (request) => {
    const registerRequest = validate(registerValidation, request);
    const totalUserWithSameEmail = await prisma.user.count({
        where: {
            email: registerRequest.email
        }
    })

    if (totalUserWithSameEmail > 0) {
        throw new ResponseError(400, 'Email is already registered');
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);
    const user = await prisma.user.create({
        data: registerRequest,
    })

    return user;
}

const login = async (request) => {
    const loginRequest = validate(loginValidation, request);

    const user = await prisma.user.findFirst({
        where: {
            email: loginRequest.email
        },
        select: {
            id: true,
            email: true,
            password: true,
        }
    })

    if (!user) {
        throw new ResponseError(400, 'Email or password is incorrect');
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(400, 'Email or password is incorrect');
    }

    const accessToken = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { user, accessToken };
}

export default { register, login }
