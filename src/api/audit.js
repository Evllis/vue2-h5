import api from './index'
// axios
import request from '@/utils/request'

// 审核结果查询
export const queryAudit = d => {
    return request({
        url: api.Audit.queryAudit,
        method: 'post',
        ...d
    })
}

// 审核驳回状态下页面提交接口
export const auditStatusFourSubmit = d => {
    return request({
        url: api.Audit.auditStatusFourSubmit,
        method: 'post',
        ...d
    })
}
