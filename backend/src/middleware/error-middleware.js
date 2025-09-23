import { ResponseError } from "../error/response-error";

export const errorMiddleware = (err, req, res, next) => {

    if (!err) {
        next();
        return;
    }

    if (err instanceof ResponseError) {
        return res.status(err.status).json({
            error: {
                message: err.message
            }
        }).end();
    } else {
        res.status(500).json({
            errors: err.message
        }).end();
    }
};
