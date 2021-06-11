import axios from 'axios'
import actionHandler from '../actionHandler'
import router from '@/router'

const initialUserState = () => (JSON.parse(localStorage.getItem('user')) ?? {
    _id: "",
    authGoogleID: null,
    authFacebookID: null,
    authType: "local",
    street: "",
    isAdmin: false,
    apartment: "",
    city: "",
    zip: "",
    country: "",
    name: "",
    email: "",
    phone: "",
    token: null,
})

const state = {
    loggedUser: initialUserState(),
    userDetails: {},

    users: []
}

const getters = {
    getLoggedUser: state => state.loggedUser,
    getUserDetails: state => state.userDetails,
    
    getAllUsers: state => state.users
}

const actions = {
    /* 
     * @desc        Authenticate user & get token
     * @access      Public
     */
    loginUser: actionHandler(async ({ commit }, { email, password }) => {
        const { data } = await axios.post('/users/signin', { email, password })

        localStorage.setItem('user', JSON.stringify(data.data))
        commit('setUser', { user: data.data, statePiece: 'loggedUser' })
    }),
    
    /* 
     * @desc        Sign out logged user
     * @access      Private
     */
    logoutUser({ commit }) {
        localStorage.removeItem('user')
        commit('resetLoggedUser')

        router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath.slice(1) } })
    },

    /* 
     * @desc        Register a new user
     * @access      Public
     */
    registerUser: actionHandler(async ({ commit }, { name, email, phone, password }) => {
        const { data } = await axios.post('/users/signup', { name, email, phone, password })

        localStorage.setItem('user', JSON.stringify(data.data))
        commit('setUser', { user: data.data, statePiece: 'loggedUser' })
        
    }),

    /* 
     * @desc        Get User logged in
     * @access      Private || Admin
     */
    fetchUserLoggedIn: actionHandler(async ({ commit, state }) => {
        commit('resetUserDetails')
        
        const { data } = await axios.get(`/users/profile/${state.loggedUser._id}`, {
            headers: { Authorization: `Bearer ${state.loggedUser.token}` }
        })
        commit('setUser', { user: data.data, statePiece: 'userDetails' })


    }),

    fetchUserById: actionHandler(async ({ commit, state }, userId ) => {
        commit('resetUserDetails')

        const { data } = await axios.get(`/users/profile/${userId}`, {
            headers: { Authorization: `Bearer ${state.loggedUser.token}` }
        })
        commit('setUser', { user: data.data, statePiece: 'userDetails' })
    }),
    
    /* 
     * @desc        Update logged in or by id user data
     * @access      Private || Admin
     */
    updateUserDetails: actionHandler(async ({ commit, state }, { user, route }) => {
        const { _id, name, email, phone, password, isAdmin } = user
       
        
        if (route === 'profile') {
            const { data } = await axios.patch(`/users/profile/${_id}`,
                { name, email, phone, password, isAdmin },
                { headers: { Authorization: `Bearer ${state.loggedUser.token}` }}
            )

            localStorage.setItem('user', JSON.stringify(data.data))
            commit('setUser', { user: data.data, statePiece: 'loggedUser' })
        } else {
            const { data } = await axios.patch(`/users/${_id}`,
                { name, email, isAdmin },
                { headers: { Authorization: `Bearer ${state.loggedUser.token}` }}
            )
            commit('resetUserDetails')
            commit('setUser', { user: data.data, statePiece: 'userDetails' })
        }
        
    }),

    /* 
     * @desc        Get all registered users
     * @access      Admin
     */
    fetchAllUsers: actionHandler(async ({ commit, state }) => {
        commit('resetAllUsers')
        
        const { data } = await axios.get('/users', {
            headers: { Authorization: `Bearer ${state.loggedUser.token}` }
        })

        commit('setAllUsers', data.data)
    }),
    
    /* 
     * @desc        Delete user by id
     * @access      Admin
     */
    deleteUser: actionHandler(async ({ dispatch, state }, userId ) => {
        await axios.delete(`/users/${userId}`, {
            headers: { Authorization: `Bearer ${state.loggedUser.token}` }
        })

        dispatch('fetchAllUsers')
    })
}

const mutations = {
    resetLoggedUser: state => state.loggedUser = initialUserState(),
    resetUserDetails: state => state.userDetails = {},
    
    setUser: (state, { user, statePiece }) => Object.keys(user).forEach(key => state[statePiece][key] = user[key]),

    resetAllUsers: state => state.users = [],
    setAllUsers: (state, users) => state.users = users
}

export default {
    state,
    getters,
    actions,
    mutations
}
