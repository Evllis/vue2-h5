// import types from './mutations-type'
// import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
// export default {
//     computed: {
//         ...mapState('order', ['模块中state对象']),
//         ...mapGetters('order', ['模块中state对象']),
//         ...mapState(['user']),
//         ...mapGetters(['user']),
//         order() {
//             // 模块
//             return this.$store.state.order.oderInfo
//         },
//         user() {
//             // 公共
//             return this.$store.state.user
//         }
//     },
//     methods: {
//         ...mapActions('order', ['模块中actions方法']),
//         ...mapActions(['getUser']),
//         getUser() {
//             this.getUser(data)
//         },
//         order() {
//             this.$store.dispatch('order/getOrder', data) // 调用方法
//         },
//         user() {
//             this.$store.dispatch('user') // 调用方法

//             this.$store.dispatch('user').then(() => {})

//             this.$store.commit('mutations 中的方法', data)

//             this.$store.commit(types.GET_USER, data)
//         }
//     }
// }
