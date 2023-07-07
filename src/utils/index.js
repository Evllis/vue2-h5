/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
            time = parseInt(time)
        }
        if (typeof time === 'number' && time.toString().length === 10) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
    if (('' + time).length === 10) {
        time = parseInt(time) * 1000
    } else {
        time = +time
    }
    const d = new Date(time)
    const now = Date.now()

    const diff = (now - d) / 1000

    if (diff < 30) {
        return '刚刚'
    } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
        return '1天前'
    }
    if (option) {
        return parseTime(time, option)
    } else {
        return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
    }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
    const search = url.split('?')[1]
    if (!search) {
        return {}
    }
    return JSON.parse(
        '{"' +
            decodeURIComponent(search)
                .replace(/"/g, '\\"')
                .replace(/&/g, '","')
                .replace(/=/g, '":"')
                .replace(/\+/g, ' ') +
            '"}'
    )
}

/**
 * 格式化数字，最多保留2位小数
 * @param { String } val 要格式化的数字
 * @returns String
 */
const formatterNumberBase = val => {
    if (val !== '' && val.substr(0, 1) === '.') {
        val = ''
    }
    val = val.replace(/^0*(0\.|[1-9])/, '$1')
    val = val.replace(/[^\d.]/g, '')
    val = val.replace(/\.{2,}/g, '.')
    val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    val = val.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
    if (val.indexOf('.') < 0 && val !== '') {
        if (val.substr(0, 1) === '0' && val.length === 2) {
            val = val.substr(1, val.length)
        }
    }
    return val
}
export const formatterNumberZero = val => {
    return formatterNumberBase(val)
}
export const formatterNumber = val => {
    const num = formatterNumberBase(val)
    if (num <= 0) return ''
    return num
}

// 大于0正整数
export const formatterGtZeroInteger = value => {
    if (!/^[1-9]\d*$/.test(value)) {
        return ''
    }
    return value
}

/**
 * 姓名脱敏
 * 张*        王**        A****
 * @param { String } name 姓名字符串
 * @returns String
 */
export const hideName = name => {
    if (!name) {
        return name
    }
    return name.replace(/(^.{1})(.+)$/g, (...args) => {
        let tempStr = ''
        if (args[2] && args[2].length) {
            tempStr = Array.from({
                length: args[2].length + 1
            }).join('*')
        }
        return args[1] + tempStr
    })
}

/**
 * 证件号码脱敏
 * keepWord是要传入的不脱敏的位数
 * @param { String } idCard 身份证号
 * @param { String || Number } start 前脱敏位数，默认0，不脱敏
 * @param { String || Number } start 后脱敏位数，默认0，不脱敏
 * @returns String
 */
export const hideIdCard = (idCard, start = 0, end = 0) => {
    if (!idCard) {
        return idCard
    }

    let reg = new RegExp(`(^\\w{${start}})(\\w+)(\\w{${end}}$)`, 'g')

    return idCard.replace(reg, function (...args) {
        let tempStr = ''

        if (args[2] && args[2].length) {
            for (let i = 0, len = args[2].length; i < len; i++) {
                tempStr += '*'
            }
        }

        return args[1] + tempStr + args[3]
    })
}

/**
 * 手机号码脱敏
 * 137****9050
 * @param { String } phone 手机号
 */
export const hidePhone = phone => {
    let reg = /(\d{3})\d*(\d{4})/
    return phone ? phone.replace(reg, '$1****$2') : ''
}

/**
 * 银行卡卡号脱敏
 * 622*********1496
 * @param { String } bankAccount 银行卡号
 */
export const hideBankAccount = bankAccount => {
    let reg = /(\d{3})(\d+)(\d{4})/
    var strLength = bankAccount.match(reg)[2].length
    let strValue = ''
    for (let i = 0; i < strLength; i++) {
        strValue += '*'
    }
    return bankAccount.replace(reg, '$1' + strValue + '$3')
}
