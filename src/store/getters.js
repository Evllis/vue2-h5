const getters = {
    source: state => state.source,
    customerId: state => state.customerId,
    phone: state => state.phone,
    scrollTopMap: state => {
        return key => (key ? state.scrollTopMap[key] : state.scrollTopMap)
    }
}

export default getters
