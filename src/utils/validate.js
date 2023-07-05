/**
 * @param {string} path
 * @returns {Boolean}
 */
export const isExternal = path => /^(https?:|mailto:|tel:)/.test(path)

/**
 * @param {string} str
 * @returns {Boolean}
 */
export const validUsername = str => {
    const valid_map = ['admin', 'editor']
    return valid_map.indexOf(str.trim()) >= 0
}

/**
 * 判断是否正确的手机号
 * @param { String or Number } phone 手机号
 * @returns Boolean
 */
export const isPhone = phone => /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(phone)

/**
 * 判断是否6位正整数
 * @param { Number } number 数字
 * @returns Boolean
 */
export const digitInteger = number => /^\d{6}$/g.test(number)

/**
 * 禁止输入表情符号、特殊符号
 */
export const nonCharacter = val => /^(?!_)(?!.*?_$)[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(val)

/**
 * 法人姓名
 */
export const isName = val => /^[\u4E00-\u9FA5]{2,50}$/gi.test(val)

/**
 * 法人身份证
 * @param { String } val 15-18位身份证号
 * @returns Boolean
 */
export const isIdCard = val => /(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(val)

/**
 * 是否为字母+数字
 * @param { String } val 当前输入的值
 * @returns Boolean
 */
export const isLetterNumber = val => /^[A-Za-z0-9]+$/.test(val)

/**
 * 只能输入中文+数字，长度4-50个字符
 * @returns Boolean
 */
export const isCnNumerals = val => /^[\u4E00-\u9FA50-9]{4,50}$/.test(val)

/**
 * 判断是否合法的地址
 * @param { String } val 当前地址
 * @returns Boolean
 */
export const isAddress = val => /^(?!_)(?!.*?_$)[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(val)
