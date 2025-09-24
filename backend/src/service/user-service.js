import { PrismaClient } from "@prisma/client";
import { validate } from "../validation/validation.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from 'bcrypt';
import { registerValidation } from "../validation/user-validation.js";
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

export default { register }
