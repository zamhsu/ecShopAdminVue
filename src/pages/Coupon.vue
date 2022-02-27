<template>
  <div>
    <Loading v-model:active="isLoading" />
    <div class="text-end">
      <button class="btn btn-primary mt-4" @click="openEditModal(true)">
        建立新優惠券
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <td>優惠碼</td>
          <th>折扣百分比</th>
          <th>生效日</th>
          <th>到期日</th>
          <th>數量</th>
          <th>已使用</th>
          <th>狀態</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in coupons" :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.code }}</td>
          <td>{{ item.discountPercentage }}</td>
          <td>{{ fullDateTime(item.startDate) }}</td>
          <td>{{ fullDateTime(item.expiredDate) }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.used }}</td>
          <td>
            <span
              v-if="item.statusString"
              :class="{
                'text-success': item.statusId === 1,
                'text-danger': item.statusId === 2,
              }"
              >{{ item.statusString }}</span
            >
          </td>
          <td>
            <div class="btn-group">
              <button
                class="btn btn-outline-primary btn-sm"
                @click="openEditModal(false, item)"
              >
                編輯
              </button>
              <button
                class="btn btn-outline-danger btn-sm ms-2"
                @click="openDeleteModal(item)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <Pagination
      :pages="pagination"
      @emitPage="getCoupons"
      v-if="pagination"
    ></Pagination>

    <!-- delProductModal -->
    <DeleteModal
      :itemName="deleteModel.name"
      :visibaleModal="showDeleteModal"
      :errorMessage="deleteErrorMessage"
      @delete="deleteCoupon()"
      @close="closeDeleteModal()"
    />
  </div>
</template>

<script lang="ts">
import Pagination from "@/components/Pagination.vue";
import FlatPickr from "@/components/inputs/FlatPickr.vue";
import DeleteModal from "@/components/DeleteModal.vue";
import { CouponDisplayModel } from "@/models/couponModel";
import { PaginationModel } from "@/models/PaginationModel";
import { DeleteModel } from "@/models/generalModel";
import { fullDateTime } from "@/utils/filter";
import { emitter } from "@/utils/eventBus";
import couponApi from "@/api/coupon";
import { defineComponent, ref } from "vue";

export default defineComponent({
  components: {
    DeleteModal,
    Pagination,
    //FlatPickr,
  },
  setup() {
    const pageSize = 10;
    let coupons = ref<CouponDisplayModel[]>([]);
    let pagination = ref<PaginationModel>();
    //let isNewCoupon = ref<boolean>(false);
    let isLoading = ref<boolean>(false);
    let deleteModel = ref<DeleteModel>({
      guid: "",
      name: "",
    });
    let deleteErrorMessage = ref<string>("");
    let showDeleteModal = ref<boolean>(false);

    getCoupons();

    function getCoupons(page = 1) {
      isLoading.value = true;
      couponApi.getPaged(pageSize, page).then((response) => {
        if (response.isSuccess) {
          coupons.value = response.data.couponDisplays;
          pagination.value = response.data.pagination;

          isLoading.value = false;
        }
      });
    }

    function deleteCoupon() {
      isLoading.value = true;

      couponApi.deleteOne(deleteModel.value.guid).then((response) => {
        if (response.isSuccess) {
          getCoupons();
          emitter.emit("alertEvent", {
            message: "刪除成功",
            status: "success",
          });
        } else {
          emitter.emit("alertEvent", {
            message: `刪除失敗，${response.message}`,
            status: "warning",
          });
        }

        isLoading.value = false;
      });
      showDeleteModal.value = false;
    }

    function openDeleteModal(coupon: CouponDisplayModel): void {
      deleteModel.value = {
        guid: coupon.id.toString(),
        name: `${coupon.title} (${coupon.code})`,
      };

      deleteErrorMessage.value = "";
      showDeleteModal.value = true;
    }

    function closeDeleteModal() {
      showDeleteModal.value = false;
    }

    return {
      isLoading,
      coupons,
      pagination,
      deleteModel,
      showDeleteModal,
      deleteErrorMessage,
      getCoupons,
      deleteCoupon,
      openDeleteModal,
      closeDeleteModal,
      fullDateTime,
    };
  },
});
</script>
