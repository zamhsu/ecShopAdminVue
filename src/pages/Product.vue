<template>
  <div>
    <Loading v-model:active="isLoading"/>
    <div class="text-end">
      <button class="btn btn-primary mt-4" @click="openProductModal(true)">
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
                @click="openProductModal(false, item)"
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
    <!-- <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="productModalLabel">
              <span>新增產品</span>
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input
                    type="text"
                    class="form-control"
                    id="image"
                    v-model="tempProduct.imageUrl"
                    placeholder="請輸入圖片連結"
                  />
                </div>
                <div class="form-group">
                  <label for="customFile"
                    >或 上傳圖片
                    <i
                      class="fas fa-spinner fa-spin"
                      v-if="status.fileUploading"
                    ></i>
                  </label>
                  <input
                    type="file"
                    id="customFile"
                    class="form-control"
                    ref="files"
                    @change="uploadFile()"
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
                <div class="form-group">
                  <label for="title">標題</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    v-model="tempProduct.title"
                    placeholder="請輸入標題"
                  />
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input
                      type="text"
                      class="form-control"
                      id="category"
                      v-model="tempProduct.category"
                      placeholder="請輸入分類"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input
                      type="unit"
                      class="form-control"
                      id="unit"
                      v-model="tempProduct.unit"
                      placeholder="請輸入單位"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="origin_price">原價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="origin_price"
                      v-model="tempProduct.origin_price"
                      placeholder="請輸入原價"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="price"
                      v-model="tempProduct.price"
                      placeholder="請輸入售價"
                    />
                  </div>
                </div>
                <hr />

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="description"
                    v-model="tempProduct.description"
                    placeholder="請輸入產品描述"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="content"
                    v-model="tempProduct.content"
                    placeholder="請輸入產品說明內容"
                  ></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="is_enabled"
                      v-model="tempProduct.is_enabled"
                      :true-value="1"
                      :false-value="0"
                    />
                    <label class="form-check-label" for="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              data-dismiss="modal"
            >
              取消
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="editProduct()"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div> -->

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
import DeleteModal from "@/components/DeleteModal.vue";
import Pagination from "@/components/Pagination.vue";
import { ProductDisplayModel } from "@/models/productModel";
import { PaginationModel } from "@/models/PaginationModel";
import { DeleteModel } from "@/models/generalModel";
import productApi from "@/api/product";
import { defineComponent, ref } from "vue";
import { emitter } from "@/utils/eventBus";
import { currency } from "@/utils/filter";

export default defineComponent({
  components: {
    DeleteModal,
    Pagination,
  },
  setup() {
    const pageSize = 10;
    let products = ref<ProductDisplayModel[]>([]);
    let pagination = ref<PaginationModel>();
    let isNew = ref<boolean>(false);
    let isLoading = ref<boolean>(false);
    let deleteModel = ref<DeleteModel>({
      guid: "",
      name: "",
    });
    let deleteErrorMessage = ref<string>("");
    let showDeleteModal = ref<boolean>(false);

    getProducts();

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

    function deleteProduct() {
      isLoading.value = true;

      productApi.deleteOne(deleteModel.value.guid).then((response) => {
        if (response.isSuccess) {
          getProducts();
          emitter.emit("alertEvent", {
            message: "成功",
            status: "success",
          });
        } else {
          emitter.emit("alertEvent", {
            message: `失敗，${response.message}`,
            status: "warning",
          });
        }

        isLoading.value = false;
      });
      showDeleteModal.value = false;
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

    return {
      products,
      pagination,
      isNew,
      isLoading,
      deleteModel,
      showDeleteModal,
      deleteErrorMessage,
      getProducts,
      deleteProduct,
      openDeleteModal,
      closeDeleteModal,
      currency,
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