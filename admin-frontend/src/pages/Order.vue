<template>
  <div>
    <Loading v-model:active="isLoading" />
    <table class="table mt-4">
      <thead>
        <tr>
          <th>購買時間</th>
          <th>Email</th>
          <th>應付金額</th>
          <th>付款狀態</th>
          <th>詳細</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in orderDisplays" :key="index">
          <td>{{ fullDateTime(item.createDate) }}</td>
          <td>{{ item.email }}</td>
          <td>{{ currency(item.total) }}</td>
          <td>
            <span>{{ item.statusString }}</span>
          </td>
          <td>
            <button
              class="btn btn-outline-primary btn-sm"
              @click="openDetailModal(item.guid)"
            >
              查看
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <Pagination
      :pages="pagination"
      @emitPage="getOrderDisplays"
      v-if="pagination"
    ></Pagination>

    <!-- detialModal -->
    <div
      class="modal fade"
      id="detailModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="detailModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header">
            <h5 class="modal-title" id="detailModalLabel">
              <span>詳細資料</span>
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <template v-if="orderDisplayDetail">
              <div>
                <h5>商品</h5>
                <table class="table mt-4">
                  <thead>
                    <tr>
                      <th>項次</th>
                      <th>名稱</th>
                      <th>數量</th>
                      <th>金額</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="!orderDisplayDetail.orderDetails">
                      <td colspan="4">
                        <p class="text-center">沒有商品</p>
                      </td>
                    </tr>
                    <tr
                      v-else
                      v-for="(item, index) in orderDisplayDetail.orderDetails"
                      :key="index"
                    >
                      <td>{{ item.itemNo }}</td>
                      <td>{{ item.productName }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>
                        <span>{{ currency(item.total) }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h5>優惠券</h5>
                <table class="table mt-4">
                  <thead>
                    <tr>
                      <th>項次</th>
                      <th>優惠碼</th>
                      <th>數量</th>
                      <th>金額</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="!orderDisplayDetail.couponDetail">
                      <td colspan="4">
                        <p class="text-center">沒有使用優惠券</p>
                      </td>
                    </tr>
                    <tr v-else>
                      <td>{{ orderDisplayDetail.couponDetail.itemNo }}</td>
                      <td>{{ orderDisplayDetail.couponDetail.couponCode }}</td>
                      <td>{{ orderDisplayDetail.couponDetail.quantity }}</td>
                      <td>
                        <span>
                          -{{
                            currency(orderDisplayDetail.couponDetail.total * -1)
                          }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h5>個人資料</h5>
              <div class="row">
                <div class="row">
                  <div class="mb-3 col-md-4">
                    姓名：{{ orderDisplayDetail.name }}
                  </div>
                  <div class="mb-3 col-md-4">
                    Email：{{ orderDisplayDetail.email }}
                  </div>
                  <div class="mb-3 col-md-4">
                    電話：{{ orderDisplayDetail.phone }}
                  </div>
                </div>
                <div class="row">
                  <div class="mb-3 col-md-12">
                    地址：{{ orderDisplayDetail.address }}
                  </div>
                </div>
              </div>

              <h5>付款資料</h5>
              <div class="row">
                <div class="row">
                  <div class="mb-3 col-md-6">
                    訂單狀態：{{ orderDisplayDetail.statusString }}
                  </div>
                  <div class="mb-3 col-md-6">
                    購買時間：{{ fullDateTime(orderDisplayDetail.createDate) }}
                  </div>
                </div>
                <div class="row">
                  <div class="mb-3 col-md-6">
                    付款方式：{{ orderDisplayDetail.paymentMethodString }}
                  </div>
                  <div class="mb-3 col-md-6">
                    付款時間：{{ fullDateTime(orderDisplayDetail.paidDate) }}
                  </div>
                </div>
              </div>
            </template>
            <template> 沒有資料 </template>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              data-bs-dismiss="modal"
            >
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Modal } from "bootstrap";
import Pagination from "@/components/Pagination.vue";
import { PaginationModel } from "@/models/paginationModel";
import {
  OrderDisplayDetailModel,
  OrderDisplayModel,
} from "@/models/orderModel";
import orderApi from "@/api/order";
import { defineComponent, onBeforeUnmount, onMounted, ref } from "vue";
import { currency, fullDateTime } from "@/utils/filter";

export default defineComponent({
  components: {
    Pagination,
  },

  setup() {
    const pageSize = 10;
    let orderDisplays = ref<OrderDisplayModel[]>([]);
    let pagination = ref<PaginationModel>();
    let orderDisplayDetail = ref<OrderDisplayDetailModel>();
    let isLoading = ref<boolean>(false);
    let detailModal: Modal;

    getOrderDisplays();

    onMounted(() => {
      detailModal = new Modal(
        document.getElementById("detailModal") as HTMLElement
      );
    });

    onBeforeUnmount(() => {
      detailModal.dispose();
    });

    function getOrderDisplays(page = 1) {
      isLoading.value = true;

      orderApi.getPaged(pageSize, page).then((response) => {
        if (response.isSuccess) {
          orderDisplays.value = response.data.orderDisplays;
          pagination.value = response.data.pagination;
        }

        isLoading.value = false;
      });
    }

    function getOneDetail(guid: string) {
      isLoading.value = true;

      orderApi.getOne(guid).then((response) => {
        if (response.isSuccess) {
          orderDisplayDetail.value = response.data;
        }

        isLoading.value = false;
      });
    }

    function openDetailModal(guid: string) {
      getOneDetail(guid);

      detailModal.show();
    }

    function closeDetailModal() {
      detailModal.hide();
    }

    return {
      orderDisplays,
      pagination,
      orderDisplayDetail,
      isLoading,
      getOrderDisplays,
      openDetailModal,
      closeDetailModal,
      currency,
      fullDateTime,
    };
  },
});
</script>
