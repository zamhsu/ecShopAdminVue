import authApi from "@/api/authority";
import storageService from "./storageService";

const accessTokenName = 'access_token';

export default {
    /**
     * 設定Access Token
     * @param token JWT
     */
    setAccessToken(token: string): void {
        storageService.setSessionStorageValue(accessTokenName, token);
    },

    /**
     * 取得Access Token
     * @returns JWT
     */
    getAccessToken(): string | null {
        return storageService.getSessionStorageValue(accessTokenName);
    },

    /**
     * 是否已經登入
     * @returns true:已登入, false:未登入
     */
    async isLogin(): Promise<boolean> {
        const result = await authApi.checkLogin()
            .then((response) => {
                if (response.isSuccess) {
                    this.setAccessToken(response.data);
                    return true;
                }

                return false;
            })
            .catch(() => {
                return false;
            });

        return result;
    },

    /**
     * 登出
     */
    logout(): void {
        storageService.removeSessionStorageValue(accessTokenName);
    }
}