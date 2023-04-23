import api from './index'
// axios
import request from '@/utils/request'

// 联通合作信息提交
export const submitEnterpriseUnicomInfo = d => {
    return request({
        url: api.Cooperate.submitEnterpriseUnicomInfo,
        method: 'post',
        ...d
    })
}
