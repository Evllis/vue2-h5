// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = ({ file }) => {
    return {
        plugins: {
            autoprefixer: {
                overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 8']
            },
            'postcss-px-to-viewport': {
                unitToConvert: 'px', // 要转化的单位
                // viewportWidth: file && file.dirname && file.dirname.includes('vant') ? 375 : 750, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
                viewportWidth: 375,
                viewportHeight: 812,
                propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
                // viewportHeight: 812, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
                unitPrecision: 6, // 指定`px`转换为视窗单位值的小数位数
                viewportUnit: 'vw', //指定需要转换成的视窗单位，建议使用vw
                fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
                selectorBlackList: [], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
                minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
                mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
                replace: true, // 是否转换后直接更换属性值
                exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
                landscape: false // 是否处理横屏情况
            }
        }
    }
}
