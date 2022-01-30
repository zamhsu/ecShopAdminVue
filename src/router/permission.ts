import authService from "@/services/authService";
import router from "@/router";

// 導航守衛 Navigation Guards
router.beforeEach(async (to, from, next) => {
    if (to.meta.requiredAuth) {
        const checkResult = await authService.isLogin();
        // 驗證是否已經登入
        if (checkResult) {
            // 已登入，繼續執行
            next();
        }
        else {
            // 未登入，轉到登入頁
            next({
                name: 'Login'
            });
        }
    } else {
        // 不用驗證，繼續執行
        next();
    }
});