module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Пользователь не авторизован')
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }н
    static validationError(errors = []){
        let message;
        if(errors.length){
            let {msg, param}=errors[errors.length-1]
            message=`${msg} ${param}`
        }
        return new ApiError(400, message, errors);
    }
}