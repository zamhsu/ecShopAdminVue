import { ProductPagedDisplayModel } from "@/models/productModel";
import { RequestData } from "@/models/requestData";
import { ResponseData } from "@/models/responseData";
import axios from "@/utils/http";
import stringUtils from "@/utils/stringUtils";

export default {
    /**
     * 取得分頁後的產品資料
     * @pageSize 資料筆數，預設10
     * @page 頁數，預設1
     * @returns 
     */
    async getPaged(pageSize = 10, page = 1): Promise<ResponseData<ProductPagedDisplayModel>> {
        const { data } = await axios.get(`product?pageSize=${pageSize}&page=${page}`);

        return data;
    },
}