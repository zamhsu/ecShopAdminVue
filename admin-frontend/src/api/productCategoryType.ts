import { ProductCategoryTypeDisplayModel } from "@/models/productCategoryTypeModel";
import { ResponseData } from "@/models/responseData";
import axios from "@/utils/http";

export default {
    /**
     * 取得產品分類資料
     * @returns 
     */
    async getAll(): Promise<ResponseData<ProductCategoryTypeDisplayModel[]>> {
        const { data } = await axios.get("productCategoryType");

        return data;
    },
}