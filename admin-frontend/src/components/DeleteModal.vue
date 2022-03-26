<template>
  <div
    class="modal fade"
    id="deleteModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="deleteModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title" id="deleteModalLabel">刪除</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeModal()"
          ></button>
        </div>
        <div class="modal-body">
          <p>
            您是否要刪除
            <strong class="text-danger"> {{ itemName }} </strong>
            ？刪除後將無法恢復。
          </p>
          <p class="text-danger">{{ errorMessage }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" @click="deleteData()">
            刪除
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="closeModal()"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Modal } from "bootstrap";
import { defineComponent, onMounted, onUnmounted, watch } from "vue";
export default defineComponent({
  name: "deleteModal",
  props: {
    visibaleModal: Boolean,
    itemName: String,
    errorMessage: String,
  },
  emits: ["delete", "close"],
  setup(props, ctx) {
    let modal: Modal;
    onMounted(() => {
      modal = new Modal(document.getElementById("deleteModal") as HTMLElement);
      controlModalVisibility(props.visibaleModal);
    });
    onUnmounted(() => {
      modal.dispose();
    });
    watch(props, (val) => {
      controlModalVisibility(val.visibaleModal);
    });
    function controlModalVisibility(visibale: boolean): void {
      if (visibale) {
        modal.show();
      } else {
        modal.hide();
      }
    }
    function closeModal() {
      ctx.emit("close");
    }
    function deleteData() {
      ctx.emit("delete");
    }
    return {
      controlModalVisibility,
      closeModal,
      deleteData,
    };
  },
});
</script>