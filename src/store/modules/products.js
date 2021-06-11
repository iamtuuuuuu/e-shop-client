import axios from 'axios'
import actionHandler from '@/store/actionHandler'

const initialSingleProductState = () => ({
    name: '',
    description: '',
    richDescription: '',
    image: '',
    brand: '',
    category: '',
    countInStock: 0,
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    price: 0,
})

const state = {
    products: [],
    product: initialSingleProductState()
}

const getters = {
    getAllProducts: state => state.products,
    getSingleProduct: state => state.product
}

const actions = {
    /*
     * @desc        Fetch all products
     * @access      Public
     */
    fetchAllProducts: actionHandler(async ({ commit }) => {
        const { data } = await axios.get('/products')

        commit('setAllProducts', data.data)
    }),

    /*
     * @desc        Fetch a single products by id
     * @access      Public
     */
    fetchSingleProduct: actionHandler(async ({ commit }, productId) => {
        commit('resetSingleProduct')
        
        const { data } = await axios.get(`/products/${productId}`)

        commit('setSingleProduct', data.data)
    }),
    
    /*
     * @desc        Create a new product with sample data
     * @access      Admin
     */
    createProduct: actionHandler(async ({ rootState }) => {
        const { data } = await axios.post('/products', {}, {
            headers: { Authorization: `Bearer ${rootState.users.loggedUser.token}` }
        })

        return data.data._id
    }),
    
    /*
     * @desc        Update product data by id
     * @access      Admin
     */
    updateProduct: actionHandler(async ({ commit, rootState }, product) => {
        const { _id, name, image, brand, category, description, price, countInStock } = product

        const { data } = await axios.put(`/products/${_id}`,
            { name, image, brand, category, description, price, countInStock },
            { headers: { Authorization: `Bearer ${rootState.users.loggedUser.token}` }}
        )

        commit('resetSingleProduct')
        commit('setSingleProduct', data.data)
    }),
    
    /*
     * @desc        Delete product by id
     * @access      Admin
     */
    deleteProduct: actionHandler(async ({ dispatch, rootState }, productId) => {
        await axios.delete(`/products/${productId}`, {
            headers: { Authorization: `Bearer ${rootState.users.loggedUser.token}` }
        })

        dispatch('fetchAllProducts')
    })
}

const mutations = {
    setAllProducts: (state, products) => state.products = products,

    resetSingleProduct: (state) => state.product = initialSingleProductState(),
    setSingleProduct: (state, newProduct) => Object.keys(newProduct).forEach(key => state.product[key] = newProduct[key])
}

export default {
    state,
    getters,
    actions,
    mutations
}
