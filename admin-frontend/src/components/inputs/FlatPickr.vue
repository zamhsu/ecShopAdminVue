<template>
  <input
    type="text"
    class="flatpickr"
    :id="elementId"
    placeholder="請選擇日期"
    v-model="dt"
    :disabled="disabled"
  />
</template>

<script lang="ts">
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { MandarinTraditional } from "flatpickr/dist/l10n/zh-tw";
import { Options } from "flatpickr/dist/types/options";
import { computed, defineComponent, onMounted, onUnmounted } from "vue";
let datetimeFp: flatpickr.Instance;
export default defineComponent({
  name: "flatPickr",
  props: {
    elementId: String,
    datetime: String,
    config: Object as () => Options,
    disabled: Boolean,
  },
  setup(prop, ctx) {
    onMounted(() => {
      flatpickr.localize(MandarinTraditional);
      datetimeFp = flatpickr(
        `#${prop.elementId}`,
        prop.config
      ) as flatpickr.Instance;
    });
    onUnmounted(() => {
      datetimeFp.destroy();
    });
    let dt = computed({
      get: () => prop.datetime,
      set: (val) => {
        ctx.emit("update:datetime", val);
      },
    });
    return {
      dt,
    };
  },
});
</script>