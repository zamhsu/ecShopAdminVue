<template>
  <div class="form-signin">
    <form>
      <h1 class="h3 mb-3 fw-normal">ecShop後台管理系統</h1>

      <div class="form-floating">
        <input
          type="text"
          class="form-control"
          id="floatingInput"
          placeholder="您的帳號"
          v-model="account"
        />
        <label for="floatingInput">帳號</label>
      </div>
      <div class="form-floating">
        <input
          type="password"
          class="form-control"
          id="floatingPassword"
          placeholder="您的密碼"
          v-model="pwd"
        />
        <label for="floatingPassword">密碼</label>
      </div>

      <div class="checkbox mb-3">
        <span class="text-danger">{{ errorMessage }}</span>
      </div>
      <button
        class="w-100 btn btn-lg btn-primary"
        type="button"
        @click="login()"
      >
        Sign in
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import router from "@/router";
import { defineComponent, ref } from "vue";
import authApi from "@/api/authority";
import { LoginModel } from "@/models/loginModel";
import { RequestData } from "@/models/requestData";
import authService from "@/services/authService";
import stringUtils from "@/utils/stringUtils";

export default defineComponent({
  setup() {
    let account = ref<string>("");
    let pwd = ref<string>("");
    let errorMessage = ref<string>("");

    function login() {
      errorMessage.value = "";
      let loginModel: LoginModel = {
        account: account.value,
        password: pwd.value,
      };

      let requestData: RequestData<LoginModel> = {
          data: loginModel,
          timeZone: stringUtils.getClientTimeZone()
      };

      authApi.login(requestData).then((response) => {
        if (response.isSuccess) {
          authService.setAccessToken(response.data);
          router.push({ name: "Welcome" });
        } else {
          errorMessage.value = response.message;
        }
      });
    }

    return {
      account,
      pwd,
      errorMessage,
      login,
    };
  },
});
</script>


<style scoped>
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-floating:focus-within {
  z-index: 2;
}
.form-signin input[type="text"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>