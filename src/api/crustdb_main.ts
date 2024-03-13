/* eslint-disable camelcase */
import request from './request'

export default {
    getPhageList: (page: number, pageSize: number) =>
        request.get('/crustdb_main/', {
            params: {
                page,
                pagesize: pageSize,
            },
        }) as listResponse,
    getPhagedetail: (phageid: string) => request.get(`/crustdb_main/${phageid}`, {}) as any,
}
