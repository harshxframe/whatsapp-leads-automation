export function responseBody(
    code,
    error,
    success,
    message,
    data
) {
    return {
        code: code,
        error: error,
        success: success,
        message: message,
        data: data,
        timestamp:new Date().toISOString()
    }
}
