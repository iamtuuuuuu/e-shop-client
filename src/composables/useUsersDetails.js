import { computed, ref } from 'vue'
import { useStore } from 'vuex'

export default function useUsersDetails() {
    const store = useStore()

    const success = ref(false)
    const users = computed(() => store.getters['getAllUsers'])
    const userLoggedIn = computed(() => store.getters['getLoggedUser'])
    const userDetails = computed(() => store.getters['getUserDetails'])

    const fetchAllUsers = () => store.dispatch('fetchAllUsers')
    const fetchUserLoggedIn = () => store.dispatch('fetchUserLoggedIn')
    const fetchUserById = (userId) => store.dispatch('fetchUserById', userId)

    const updateUserProfile = async user => {
        user.password !== user.confirmPassword
            ? store.commit('utils/setError', { message: 'The password confirmation must match' }, { root: true })
            : success.value = await store.dispatch('updateUserDetails', { user, route: 'profile' })
    }
    const updateUserDetails = async user => success.value = await store.dispatch('updateUserDetails', { user })

    const deleteUser = userId => {
        if (window.confirm(`Do you really want to remove the user ${userId}?`)) store.dispatch('deleteUser', userId)
    }
    
    return {
        success,
        users,
        userLoggedIn,
        userDetails,
        
        fetchAllUsers,
        fetchUserLoggedIn,
        fetchUserById,
        updateUserProfile,
        updateUserDetails,
        deleteUser,
        
        isLoading: computed(() => store.getters['utils/isLoading']),
        error: computed(() => store.getters['utils/getError'])
    }
}