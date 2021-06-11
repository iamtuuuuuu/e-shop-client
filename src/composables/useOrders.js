import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

export default function useOrders() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const success = ref(false)
    const orders = computed(() => store.getters['getAllOrders'])
    const order = computed(() => store.getters['getSingleOrder'])

    const fetchAllOrders = () => store.dispatch('fetchAllOrders')
    const fetchMyOrders = () => store.dispatch('fetchMyOrders')
    const fetchUserOrders = userId => store.dispatch('fetchUserOrders', userId)
    const fetchSingleOrder = orderId => store.dispatch('fetchSingleOrder', orderId)
    const setOrder = () => store.dispatch('fetchSingleOrder', route.params.id)

    const deleteOrder = orderId => {
        if (window.confirm(`Do you really want to remove the product ${orderId}`))
            store.dispatch('deleteOrder', orderId)
    }

    const updateOrder = async order => {
        success.value = await store.dispatch('updateOrderStatus', order)
    }

    const placeOrder = async phone => {
        if (await store.dispatch('createOrder', phone)) router.push({ name: 'orders.show', params: { id: order.value._id } })
    }


    return {
        success,
        orders,
        order,

        fetchAllOrders,
        fetchMyOrders,
        fetchUserOrders,
        fetchSingleOrder,
        setOrder,
        deleteOrder,
        updateOrder,
        placeOrder,

        isLoading: computed(() => store.getters['utils/isLoading']),
        error: computed(() => store.getters['utils/getError'])
    }
}
