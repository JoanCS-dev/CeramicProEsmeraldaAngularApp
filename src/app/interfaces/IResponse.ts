export interface IResponse<T> {
    data: T;
    type: string;
    ok: boolean;
    title: string;
    message: string;
    info: any;
}