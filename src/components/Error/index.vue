<template>
    <div class="flex justify-center">
        <div class="text-center">
            <img width="350" :src="errorMap[type].url" alt="" />
            <div class="text-14px text-[var(--el-color-info)]">{{ errorMap[type].message }}</div>
            <div class="mt-20px">
                <VanButton type="primary" @click="btnClick">{{ errorMap[type].buttonText }}</VanButton>
            </div>
        </div>
    </div>
</template>
<script>
import pageError from '@/assets/svgs/404.svg'
import networkError from '@/assets/svgs/500.svg'
import noPermission from '@/assets/svgs/403.svg'

export default {
    name: 'NoFind404',
    props: {
        type: {
            type: String,
            validator: t => {
                return ['404', '500', '403'].includes(t)
            },
            default: '404'
        }
    },
    data() {
        return {
            errorMap: {
                404: {
                    url: pageError,
                    message: '抱歉，您访问的页面不存在。',
                    buttonText: '返回首页'
                },
                500: {
                    url: networkError,
                    message: '抱歉，服务器报告错误。',
                    buttonText: '返回首页'
                },
                403: {
                    url: noPermission,
                    message: '抱歉，您无权访问此页面。',
                    buttonText: '返回首页'
                }
            },
            active: this.defaultActive
        }
    },
    methods: {
        btnClick() {
            this.$emit('errorClick', this.type)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
</style>
