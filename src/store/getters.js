const getters = {
    userName: state => state.app.userName,
    token: state => state.app.token,
    enterpriseId: state => state.app.enterpriseId,
    role: state => state.app.role
}
export default getters
