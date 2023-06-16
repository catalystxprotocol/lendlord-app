export enum HTTP_CODE {
    success = 200,
    FORBIDDEN = 403, // 请求方没有权限调用此接口
    NOT_FOUND = 404, // 请求资源不存在
    INTERNAL_ERROR = 500 // 内部服务错误，当被调用方系统出现未知异常时返回
}
