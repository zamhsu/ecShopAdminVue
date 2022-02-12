<template>
  <div>
    <Loading v-model:active="isLoading" />
    <div class="text-end">
      <button class="btn btn-primary mt-4" @click="openEditModal(true)">
        建立新產品
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th class="w-120px">分類</th>
          <th>產品名稱</th>
          <th class="w-120px">原價</th>
          <th class="w-120px">售價</th>
          <th class="w-100px">是否啟用</th>
          <th class="w-130px">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>{{ item.categoryString }}</td>
          <td>{{ item.title }}</td>
          <td class="text-end">{{ currency(item.originPrice) }}</td>
          <td class="text-end">{{ currency(item.price) }}</td>
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
      @emitPage="getProducts"
      v-if="pagination"
    ></Pagination>

    <!-- productModal -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header">
            <h5 class="modal-title" id="productModalLabel">
              <span>編輯產品</span>
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="mb-3">
                  <label for="image" class="form-label">輸入圖片網址</label>
                  <input
                    type="text"
                    class="form-control"
                    id="image"
                    v-model="tempProduct.imageUrl"
                    placeholder="請輸入圖片連結"
                  />
                </div>
                <img
                  img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
                  class="img-fluid"
                  :src="tempProduct.imageUrl"
                  alt=""
                />
              </div>
              <div class="col-sm-8">
                <div class="mb-3">
                  <label for="title" class="form-label">標題</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    v-model="tempProduct.title"
                    placeholder="請輸入標題"
                  />
                </div>

                <div class="row">
                  <div class="mb-3 col-md-6">
                    <label for="category" class="form-label">分類</label>
                    <select
                      id="category"
                      class="form-control"
                      v-model="tempProduct.categoryId"
                    >
                      <option value="0" disabled>請選擇分類</option>
                      <option
                        v-for="category in categoryTypes"
                        :key="category.id"
                        :value="category.id"
                      >
                        {{ category.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="row">
                  <div class="mb-3 col-md-6">
                    <label for="price" class="form-label">數量</label>
                    <input
                      type="number"
                      class="form-control"
                      id="quantity"
                      v-model="tempProduct.quantity"
                      placeholder="請輸入數量"
                    />
                  </div>
                  <div class="mb-3 col-md-6">
                    <label for="unit" class="form-label">單位</label>
                    <select
                      id="unit"
                      class="form-control"
                      v-model="tempProduct.unitId"
                    >
                      <option value="0" disabled>請選擇單位</option>
                      <option
                        v-for="unit in unitTypes"
                        :key="unit.id"
                        :value="unit.id"
                      >
                        {{ unit.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="row">
                  <div class="mb-3 col-md-6">
                    <label for="origin_price" class="form-label">原價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="origin_price"
                      v-model="tempProduct.originPrice"
                      placeholder="請輸入原價"
                    />
                  </div>
                  <div class="mb-3 col-md-6">
                    <label for="price" class="form-label">售價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="price"
                      v-model="tempProduct.price"
                      placeholder="請輸入售價"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="mb-3 col-md-6">
                    <label for="startDisplay" class="form-label"
                      >上架日期</label
                    >
                    <FlatPickr
                      :elementId="'startDisplay'"
                      :config="generalFpConfig"
                      v-model:datetime="tempProduct.startDisplay"
                      class="form-control"
                    ></FlatPickr>
                  </div>
                  <div class="mb-3 col-md-6">
                    <label for="endDisplay" class="form-label">下架日期</label>
                    <FlatPickr
                      :elementId="'endDisplay'"
                      :config="generalFpConfig"
                      v-model:datetime="tempProduct.endDisplay"
                      class="form-control"
                    ></FlatPickr>
                  </div>
                </div>
                <hr />

                <div class="mb-3">
                  <label for="description" class="form-label">產品描述</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="description"
                    v-model="tempProduct.description"
                    placeholder="請輸入產品描述"
                  ></textarea>
                </div>

                <div class="mb-3">
                  <label for="memo" class="form-label">管理員備註</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="memo"
                    v-model="tempProduct.memo"
                    placeholder="請輸入管理員備註"
                  ></textarea>
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

    <!-- delProductModal -->
    <DeleteModal
      :itemName="deleteModel.name"
      :visibaleModal="showDeleteModal"
      :errorMessage="deleteErrorMessage"
      @delete="deleteProduct()"
      @close="closeDeleteModal()"
    />
  </div>
</template>

<script lang="ts">
import { Modal } from "bootstrap";
import DeleteModal from "@/components/DeleteModal.vue";
import Pagination from "@/components/Pagination.vue";
import FlatPickr from "@/components/inputs/FlatPickr.vue";
import {
  ProductDisplayModel,
  emptyProductDisplayModel,
} from "@/models/productModel";
import { PaginationModel } from "@/models/paginationModel";
import { ProductUnitTypeDisplayModel } from "@/models/productUnitTypeModel";
import { ProductCategoryTypeDisplayModel } from "@/models/productCategoryTypeModel";
import { DeleteModel } from "@/models/generalModel";
import productApi from "@/api/product";
import productUnitTypeApi from "@/api/productUnitType";
import productCategoryTypeApi from "@/api/productCategoryType";
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { emitter } from "@/utils/eventBus";
import { currency, fullDateTime, onlyDate } from "@/utils/filter";
import { Options } from "flatpickr/dist/types/options";

export default defineComponent({
  components: {
    DeleteModal,
    Pagination,
    FlatPickr,
  },
  setup() {
    const pageSize = 10;
    let products = ref<ProductDisplayModel[]>([]);
    let unitTypes = ref<ProductUnitTypeDisplayModel[]>();
    let categoryTypes = ref<ProductCategoryTypeDisplayModel[]>();
    let tempProduct = ref<ProductDisplayModel>(emptyProductDisplayModel());
    let pagination = ref<PaginationModel>();
    let isNewProduct = ref<boolean>(false);
    let isLoading = ref<boolean>(false);
    let deleteModel = ref<DeleteModel>({
      guid: "",
      name: "",
    });
    let deleteErrorMessage = ref<string>("");
    let showDeleteModal = ref<boolean>(false);
    let productModal: Modal;
    let generalFpConfig = ref<Options>();

    getProducts();
    getProductParas();
    initFpConfig();

    onMounted(() => {
      productModal = new Modal(
        document.getElementById("productModal") as HTMLElement
      );
    });

    onUnmounted(() => {
      productModal.dispose();
    });

    function getProducts(page = 1) {
      isLoading.value = true;

      productApi.getPaged(pageSize, page).then((response) => {
        if (response.isSuccess) {
          products.value = response.data.products;
          pagination.value = response.data.pagination;
        }

        isLoading.value = false;
      });
    }

    function getProductParas() {
      productUnitTypeApi.getAll().then((response) => {
        if (response.isSuccess) {
          unitTypes.value = response.data;
        }
      });

      productCategoryTypeApi.getAll().then((response) => {
        if (response.isSuccess) {
          categoryTypes.value = response.data;
        }
      });
    }

    function createProduct() {
      isLoading.value = true;

      tempProduct.value.startDisplay = new Date(tempProduct.value.startDisplay);
      tempProduct.value.endDisplay = new Date(tempProduct.value.endDisplay);

      productApi.createOne(tempProduct.value).then((response) => {
        if (response.isSuccess) {
          getProducts();
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

    function updateProduct() {
      isLoading.value = true;

      tempProduct.value.startDisplay = new Date(tempProduct.value.startDisplay);
      tempProduct.value.endDisplay = new Date(tempProduct.value.endDisplay);

      productApi.updateOne(tempProduct.value).then((response) => {
        if (response.isSuccess) {
          getProducts();
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
      if (isNewProduct.value) {
        createProduct();
      } else {
        updateProduct();
      }
    }

    function deleteProduct() {
      isLoading.value = true;

      productApi.deleteOne(deleteModel.value.guid).then((response) => {
        if (response.isSuccess) {
          getProducts();
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

    function openEditModal(isNew: boolean, product?: ProductDisplayModel) {
      if (isNew) {
        tempProduct.value = emptyProductDisplayModel();
        isNewProduct.value = true;
      } else {
        tempProduct.value = Object.assign({}, product);
        isNewProduct.value = false;
      }

      tempProduct.value.startDisplay = fullDateTime(
        tempProduct.value.startDisplay
      );
      tempProduct.value.endDisplay = fullDateTime(tempProduct.value.endDisplay);

      productModal.show();
    }

    function closeEditModal() {
      productModal.hide();
    }

    function openDeleteModal(product: ProductDisplayModel): void {
      deleteModel.value = {
        guid: product.guid,
        name: product.title,
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
        allowInput: true,
        dateFormat: "Y-m-d H:i:S",
      };
    }

    return {
      products,
      unitTypes,
      categoryTypes,
      tempProduct,
      pagination,
      isNewProduct,
      isLoading,
      deleteModel,
      showDeleteModal,
      deleteErrorMessage,
      generalFpConfig,
      getProducts,
      submitEdit,
      deleteProduct,
      openEditModal,
      closeEditModal,
      openDeleteModal,
      closeDeleteModal,
      currency,
      fullDateTime,
      onlyDate,
    };
  },
});
</script>

<style scoped>
.w-130px {
  width: 130px;
}
.w-120px {
  width: 120px;
}
.w-100px {
  width: 100px;
}
.w-80px {
  width: 80px;
}
</style>