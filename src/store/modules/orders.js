import axios from 'axios'
import actionHandler from '../actionHandler'

const initialSingleOrderState = () => ({
    _id: '',
    user: '',
    orderItems: [],
    shippingAddress: {},
    phone: '',
    status: '',
    totalPrice: 0
})

const state = {
    orders: [],
    order: initialSingleOrderState()
}

const getters = {
    getAllOrders: state => state.orders,
    getSingleOrder: state => state.order
}

const actions = {
    /*
     * @desc        Fetch all orders
     * @access      Admin
     */
    fetchAllOrders: actionHandler(async ({ commit, rootState }) => {
        commit('resetAllOrders')

        const { data } = await axios.get('/orders', {
            headers: { Authorization: `Bearer ${rootState.users.loggedUser.token}` }
        })
        console.log("lalala")
        console.log(data.data)
        commit('setAllOrders', data.data)
    }),
    
    /*
     * @desc        Fetch the logged in user orders
     * @access      Private
     */
    fetchMyOrders: actionHandler(async ({ commit, rootState }) => {
        commit('resetAllOrders')
        
        const { data } = await axios.get(`/orders/get/userorders/${rootState.users.loggedUser._id}`, {
            headers: { Authorization: `Bearer ${rootState.users.loggedUser.token}` }
        })

        commit('setAllOrders', data.data)
    }),

    fetchUserOrders: actionHandler(async ({ commit, rootState }, userId) => {
        commit('resetAllOrders')
        
        const { data } = await axios.get(`/orders/get/userorders/${userId}`, {
            headers: { Authorization: `Bearer ${rootState.users.loggedUser.token}` }
        })

        commit('setAllOrders', data.data)
    }),
    
    /*
     * @desc        Fetch a user order by id
     * @access      Private
     */
    fetchSingleOrder: actionHandler(async ({ commit, rootState }, orderId) => {
        commit('resetSingleOrder')

        const { data } = await axios.get(`/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${rootState.users.loggedUser.token}` }
        })

        commit('setSingleOrder', data.data)
    }),
    
    /*
     * @desc        Creates a new user order
     * @access      Private
     */
    createOrder: actionHandler(async ({ commit, rootState }, phone) => {
        const { items: orderItems, shippingAddress } = rootState.cart

        const { data } = await axios.post('/orders', {
            user: rootState.users.loggedUser._id,
            orderItems: orderItems.map(item => {
                return {
                    product: item.product,
                    quantity: item.quantity
                }
            }),
            shippingAddress: Object.keys(shippingAddress).map(key => `${key}=${shippingAddress[key]}`).join("&"),
            phone
        }, {
            headers: { Authorization: `Bearer ${rootState.users.loggedUser.token}` }
        })

        commit('setSingleOrder', data.data)
    }),

    updateOrderStatus: actionHandler(async ({ commit, rootState }, order) => {        
        const { _id, status } = order
        const { data } = await axios.patch(`/orders/${_id}`,
            { status },
            { headers: { Authorization: `Bearer ${rootState.users.loggedUser.token}` }}
        )

        commit('resetSingleOrder')
        commit('setSingleOrder', data.data)
    }),

    deleteOrder: actionHandler(async ({ dispatch, rootState }, orderId) => {
        await axios.delete(`/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${rootState.users.loggedUser.token}` }
        })

        dispatch('fetchAllOrders')
    })
}

const mutations = {
    resetAllOrders: state => state.orders = [],
    setAllOrders: (state, orders) => state.orders = orders,
    
    resetSingleOrder: state => state.order = initialSingleOrderState(),
    setSingleOrder: (state, order) => Object.keys(order).forEach(key => state.order[key] = order[key])
}

export default {
    state,
    getters,
    actions,
    mutations
}
