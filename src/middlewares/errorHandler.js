import { responseBody } from "../utils/responseBody.js";

export const lastErrorHandler = ((err, req, res, next) => {
    res.status(err.status || 500).send(
        responseBody(
            500,
            true,
            false,
            err.message || "Internal Server Error",
            {}
        )
    );
});

export const invalidRouteHandler = ((req, res) => {
    res.status(404).send(responseBody(404, true, false, "Invalid Route", {}));
})


