/**
 * 格式化手机号, 只允许数字
 * @param { String } val 手机号
 * @returns String
 */
export const phoneNumber = val => {
    return val ? val.replace(/[^0-9]/g, '') : ''
}
