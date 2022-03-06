<template>
  <div>
    <Navbar />
    <AlertMessage />
    <div class="container-fluid">
      <div class="row">
        <Sidebar />
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Navbar from "@/components/wrappers/Navbar.vue";
import Sidebar from "@/components/wrappers/Sidebar.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    Navbar,
    Sidebar,
    AlertMessage,
  },
  name: "MainLayout",
});
</script>

<style lang="scss">
body {
  font-size: 0.875rem;
}

.feather {
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
}
</style>