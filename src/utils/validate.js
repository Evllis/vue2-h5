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
