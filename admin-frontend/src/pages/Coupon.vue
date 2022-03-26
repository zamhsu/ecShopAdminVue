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

    <!-- couponModal -->
    <div
      class="modal fade"
      id="couponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="couponModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header">
            <h5 class="modal-title" id="couponModalLabel">
              <span>編輯優惠券</span>
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div>
              <span class="text-danger">* 編輯時只會修改【名稱】欄位</span>
            </div>
            <div class="row">
              <div class="col-sm-12">
                <div class="row">
                  <div class="mb-3 col-md-6">
                    <label for="title" class="form-label">名稱</label>
                    <input
                      type="text"
                      class="form-control"
                      id="title"
                      v-model="tempCoupon.title"
                      placeholder="請輸入名稱"
                    />
                  </div>
                  <div class="mb-3 col-md-6">
                    <label for="code" class="form-label">優惠碼</label>
                    <input
                      type="text"
                      class="form-control"
                      id="code"
                      v-model="tempCoupon.code"
                      placeholder="請輸入優惠碼"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="mb-3 col-md-6">
                    <label for="discountPercentage" class="form-label"
                      >折扣百分比</label
                    >
                    <input
                      type="number"
                      class="form-control"
                      id="discountPercentage"
                      v-model="tempCoupon.discountPercentage"
                      placeholder="請輸入折扣百分比"
                    />
                    <span>範例：80 = 價格 * 80%（相當於八折）</span>
                  </div>
                  <div class="mb-3 col-md-6">
                    <label for="quantity" class="form-label">數量</label>
                    <input
                      type="number"
                      class="form-control"
                      id="quantity"
                      v-model="tempCoupon.quantity"
                      placeholder="請輸入數量"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="mb-3 col-md-6">
                    <label for="startDate" class="form-label">生效日</label>
                    <FlatPickr
                      :elementId="'startDate'"
                      :config="generalFpConfig"
                      v-model:datetime="tempCoupon.startDate"
                      class="form-control"
                    ></FlatPickr>
                  </div>
                  <div class="mb-3 col-md-6">
                    <label for="expiredDate" class="form-label">到期日</label>
                    <FlatPickr
                      :elementId="'expiredDate'"
                      :config="generalFpConfig"
                      v-model:datetime="tempCoupon.expiredDate"
                      class="form-control"
                    ></FlatPickr>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              data-bs-dismiss="modal"
            >
              取消
            </button>
            <button type="button" class="btn btn-primary" @click="submitEdit()">
              確認
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- delCouponModal -->
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
import {
  CouponDetailModel,
  CouponDisplayModel,
  emptyCouponDisplayModel,
} from "@/models/couponModel";
import { PaginationModel } from "@/models/PaginationModel";
import { DeleteModel } from "@/models/generalModel";
import { fullDateTime } from "@/utils/filter";
import { emitter } from "@/utils/eventBus";
import couponApi from "@/api/coupon";
import { defineComponent, onBeforeUnmount, onMounted, ref } from "vue";
import { Options } from "flatpickr/dist/types/options";
import { Modal } from "bootstrap";

export default defineComponent({
  components: {
    DeleteModal,
    Pagination,
    FlatPickr,
  },
  setup() {
    const pageSize = 10;
    let coupons = ref<CouponDisplayModel[]>([]);
    let pagination = ref<PaginationModel>();
    let tempCoupon = ref<CouponDetailModel>(emptyCouponDisplayModel());
    let isNewCoupon = ref<boolean>(false);
    let isLoading = ref<boolean>(false);
    let deleteModel = ref<DeleteModel>({
      guid: "",
      name: "",
    });
    let deleteErrorMessage = ref<string>("");
    let showDeleteModal = ref<boolean>(false);
    let couponModal: Modal;
    let generalFpConfig = ref<Options>();

    getCoupons();
    initFpConfig();

    onMounted(() => {
      couponModal = new Modal(
        document.getElementById("couponModal") as HTMLElement
      );
    });

    onBeforeUnmount(() => {
      couponModal.dispose();
    });

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

    function createCoupon() {
      isLoading.value = true;

      tempCoupon.value.startDate = new Date(tempCoupon.value.startDate);
      tempCoupon.value.expiredDate = new Date(tempCoupon.value.expiredDate);

      couponApi.createOne(tempCoupon.value).then((response) => {
        if (response.isSuccess) {
          getCoupons();
          closeEditModal();
          emitter.emit("alertEvent", {
            message: "新增成功",
            status: "success",
          });
        } else {
          closeEditModal();
          emitter.emit("alertEvent", {
            message: `新增失敗，${response.message}`,
            status: "warning",
          });
        }

        isLoading.value = false;
      });
    }

    function updateCoupon() {
      isLoading.value = true;

      tempCoupon.value.startDate = new Date(tempCoupon.value.startDate);
      tempCoupon.value.expiredDate = new Date(tempCoupon.value.expiredDate);

      couponApi.updateOne(tempCoupon.value).then((response) => {
        if (response.isSuccess) {
          getCoupons();
          closeEditModal();
          emitter.emit("alertEvent", {
            message: "修改成功",
            status: "success",
          });
        } else {
          closeEditModal();
          emitter.emit("alertEvent", {
            message: `修改失敗，${response.message}`,
            status: "warning",
          });
        }

        isLoading.value = false;
      });
    }

    function submitEdit() {
      if (isNewCoupon.value) {
        createCoupon();
      } else {
        updateCoupon();
      }
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

    function openEditModal(isNew: boolean, coupon?: CouponDisplayModel) {
      if (isNew) {
        tempCoupon.value = emptyCouponDisplayModel();
        isNewCoupon.value = true;
      } else {
        tempCoupon.value = Object.assign({}, coupon);
        isNewCoupon.value = false;
      }

      tempCoupon.value.startDate = fullDateTime(tempCoupon.value.startDate);
      tempCoupon.value.expiredDate = fullDateTime(tempCoupon.value.expiredDate);

      couponModal.show();
    }

    function closeEditModal() {
      tempCoupon.value = emptyCouponDisplayModel();
      couponModal.hide();
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

    function initFpConfig() {
      generalFpConfig.value = {
        enableTime: true,
        enableSeconds: true,
        allowInput: true,
        dateFormat: "Y-m-d H:i:S",
      };
    }

    return {
      isLoading,
      coupons,
      pagination,
      tempCoupon,
      isNewCoupon,
      deleteModel,
      showDeleteModal,
      deleteErrorMessage,
      generalFpConfig,
      getCoupons,
      submitEdit,
      deleteCoupon,
      openEditModal,
      closeEditModal,
      openDeleteModal,
      closeDeleteModal,
      fullDateTime,
    };
  },
});
</script>
