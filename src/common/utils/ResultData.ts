export enum ResultCode {
    SUCCESS = 200,
    ERROR = 500
}

export class ResultData {
    static ok(data: any) {
        return {
            code: ResultCode.SUCCESS,
            message: '操作成功',
            data
        }
    }

    static page(list: any[], total: number) {
        return {
            code: ResultCode.SUCCESS,
            message: '操作成功',
            list,
            total
        }
    }
}
