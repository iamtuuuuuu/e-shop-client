<template>
<div id="product-details" class="container-lg container-fluid">
    <h2 class="mb-4">
        <router-link :to="{ name: 'admin.orders.index' }" class="text-secondary">
            Orders
        </router-link>
        <span class="text-muted">/</span>
        {{ order._id }}
    </h2>

    <v-alert v-if="success" class="mb-4" type="alert-success">
        Order updated
    </v-alert>

    <v-loader v-if="isLoading" />
    <v-alert v-else-if="error.message">
        {{ error.message }}
    </v-alert>

    <form @submit.prevent="updateOrder(order)">
        <v-form-input
            v-model="order.status"
            inputId="status"
            label="Status"
            autofocus
            :errors="error.errors ? error.errors.name : undefined"
        />        
        
        <div class="col-lg-4 col-md-6 col-sm-8 col-12 mx-auto mt-4 p-0">
            <button type="submit" class="btn btn-dark btn-block">
                Update
            </button>
        </div>
    </form>
</div>
</template>

<script>
import { defineAsyncComponent, ref } from 'vue'
import useOrders from "@/composables/useOrders";

import VFormInput from '@/components/VFormInput'
import VFormTextarea from '@/components/VFormTextarea'

export default {
    name: 'Product Details',
    components: {
        VFormInput,
        VFormTextarea,
        VLoader: defineAsyncComponent(() => import(/* webpackChunkName: "loader-component" */ '@/components/utils/VLoader')),
        VAlert: defineAsyncComponent(() => import(/* webpackChunkName: "message-component" */ '@/components/utils/VAlert'))
    },
    setup() {
        const { success, order, setOrder, updateOrder, isLoading, error } = useOrders()

        setOrder()

        return {
            success,
            order: ref(order.value),
            updateOrder,
            isLoading,
            error
        }
    }
}
</script>

<style scoped lang="scss">
#product-details {
    form .grid {
        display: grid;
        grid-template-columns: 9fr 3fr;
        grid-gap: 1rem;
    }
}

@media (max-width: 767px) {
    #product-details {
        form .grid {
            grid-template-columns: 8fr 4fr;
        }
    }
}

@media (max-width: 575px) {
    #product-details {
        form .grid {
            grid-template-columns: 1fr;
            grid-gap: 0;
        }
    }
}
</style>
