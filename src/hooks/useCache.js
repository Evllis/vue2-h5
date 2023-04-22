/**
 * 配置浏览器本地存储的方式，可直接存储对象数组。
 */

import WebStorageCache from 'web-storage-cache'

export const useCache = (CacheType = 'sessionStorage') => {
    const wsCache = new WebStorageCache({
        storage: CacheType
    })

    return {
        wsCache
    }
}
