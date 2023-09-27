const toString = Object.prototype.toString

export const is = (val, type) => {
    return toString.call(val) === `[object ${type}]`
}

export const isString = val => {
    return is(val, 'String')
}

export const isBrowser = () => {
    let uaFlag = navigator.userAgent.toLowerCase()
    return {
        edg: uaFlag.match(/edg\/([\d.]+)/) ? uaFlag.match(/edg\/([\d.]+)/)[1] : false,
        firefox: uaFlag.match(/firefox\/([\d.]+)/) ? uaFlag.match(/firefox\/([\d.]+)/)[1] : false,
        chrome: uaFlag.match(/chrome\/([\d.]+)/) ? uaFlag.match(/chrome\/([\d.]+)/)[1] : false,
        opera: uaFlag.match(/opera.([\d.]+)/) ? uaFlag.match(/opera.([\d.]+)/)[1] : false,
        safari: uaFlag.match(/version\/([\d.]+).*safari/) ? uaFlag.match(/version\/([\d.]+).*safari/)[1] : false,
        weixin: uaFlag.match(/MicroMessenger/i) == 'micromessenger',
        mobile: !!uaFlag.match(
            /phone|pad|pod|iphone|ipod|ios|ipad|android|mobile|blackberry|iemobile|mqqbrowser|juc|fennec|wosbrowser|browserng|webos|symbian|windows phone/i
        ),
        android: !!uaFlag.match(/android/i)
    }
}
