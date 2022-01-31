import { LoginModel } from "@/models/loginModel";
import { RequestData } from "@/models/requestData";
import { ResponseData } from "@/models/responseData";
import axios from "@/utils/http";
import stringUtils from "@/utils/stringUtils";

export default {
    /**
     * 管理員登入
     * @param param 登入資料
     * @returns 
     */
    async login(param: LoginModel): Promise<ResponseData<string>> {
        const requestData: RequestData<LoginModel> = {
            data: param,
            timeZone: stringUtils.getClientTimeZone()
        };

        const { data } = await axios.post("admin/login", requestData);

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