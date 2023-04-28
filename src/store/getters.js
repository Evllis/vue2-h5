const getters = {
    userName: state => state.app.userName,
    token: state => state.app.token,
    enterpriseId: state => state.app.enterpriseId,
    role: state => state.app.role,
    step: state => state.app.step,
    editAudit: state => state.app.editAudit
}
export default getters
