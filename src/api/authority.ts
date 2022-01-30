import { LoginModel } from "@/models/loginModel";
import { RequestData } from "@/models/requestData";
import { ResponseData } from "@/models/responseData";
import axios from "@/utils/http";

export default {
    /**
     * 管理員登入
     * @param param 登入資料
     * @returns 
     */
    async login(param: RequestData<LoginModel>): Promise<ResponseData<string>> {
        const { data } = await axios.post("admin/login", param);

        return data;
    },

    /**
     * 檢查登入狀態
     * @returns 
     */
     async checkLogin(): Promise<ResponseData<string>> {
        const { data } = await axios.get("admin/login/check");

        return data;
    }
}