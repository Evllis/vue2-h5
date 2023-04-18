<template>
    <div></div>
</template>

<script setup>
import { unref, getCurrentInstance } from 'vue'
import Router from 'vue-router'

const instance = getCurrentInstance()
const router = new Router()

const { params, query } = unref(instance.proxy.$route)
const { path, _redirect_type = 'path' } = params

Reflect.deleteProperty(params, '_redirect_type')
Reflect.deleteProperty(params, 'path')

const _path = Array.isArray(path) ? path.join('/') : path

if (_redirect_type === 'name') {
    router.replace({
        name: _path,
        query,
        params
    })
} else {
    router.replace({
        path: _path.startsWith('/') ? _path : '/' + _path,
        query
    })
}
</script>
