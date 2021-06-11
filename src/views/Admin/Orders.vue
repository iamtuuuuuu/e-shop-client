<template>
  <div id="products" class="container-lg container-fluid">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h2 class="mb-0">Orders</h2>
    </div>

    <v-loader v-if="isLoading" />
    <v-alert v-else-if="error.message">
      {{ error.message }}
    </v-alert>

    <div class="table-responsive" v-else>
      <table class="table table-hover table-sm">
        <thead>
          <tr>
            <th>OrderID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone number</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Details</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order._id">
            <td>{{ order._id }}</td>
            <td>{{ order.user.name }}</td>
            <td>{{ order.user.email }}</td>
            <td>{{ order.user.phone }}</td>
            <td>{{ dayjs(order.dateOrdered).format("lll") }}</td>
            <td>
              {{
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(order.totalPrice)
              }}
            </td>
            <td>{{ order.status }}</td>

            <td>
              <router-link
                :to="{ name: 'orders.show', params: { id: order._id } }"
                class="btn btn-link btn-sm"
              >
                <font-awesome-icon :icon="['fas', 'info-circle']" />
              </router-link>
            </td>
            <td>
              <div class="btn-group dropleft">
                <button
                  type="button"
                  class="btn py-0 px-1"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <font-awesome-icon :icon="['fas', 'ellipsis-v']" />
                </button>

                <div class="dropdown-menu">
                  <router-link
                    :to="{
                      name: 'admin.orders.show',
                      params: { id: order._id },
                    }"
                    class="dropdown-item"
                  >
                    <font-awesome-icon :icon="['fas', 'edit']" class="mr-2" />
                    Edit
                  </router-link>

                  <button
                    class="dropdown-item"
                    @click.prevent="deleteOrder(order._id)"
                  >
                    <font-awesome-icon :icon="['fas', 'trash']" class="mr-2" />
                    Remove
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import useOrders from "@/composables/useOrders";

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);

export default {
  name: "Orders",
  components: {
    VLoader: defineAsyncComponent(() =>
      import(
        /* webpackChunkName: "loader-component" */ "@/components/utils/VLoader"
      )
    ),
    VAlert: defineAsyncComponent(() =>
      import(
        /* webpackChunkName: "message-component" */ "@/components/utils/VAlert"
      )
    ),
  },
  setup() {
    const { orders, fetchAllOrders, deleteOrder, isLoading, error } = useOrders();

    fetchAllOrders();

    console.log(orders);
    return {
      orders,
      deleteOrder,
      dayjs,
      isLoading,
      error,
    };
  },
};
</script>

<style scoped lang="scss">
table {
  thead tr th,
  tbody tr td {
    text-align: center;
    vertical-align: middle;

    .btn-group.dropleft {
      > .btn {
        font-size: 1.4em;
      }

      .dropdown-menu {
        max-width: 14rem;

        .dropdown-header,
        .dropdown-item {
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}

@media (max-width: 767px) {
  table thead tr th.min-width {
    min-width: 12rem;
  }
}
</style>
