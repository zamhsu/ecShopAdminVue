import { ProductUnitTypeDisplayModel } from "@/models/productUnitTypeModel";
import { ResponseData } from "@/models/responseData";
import axios from "@/utils/http";

export default {
    /**
     * 取得產品單位資料
     * @returns 
     */
    async getAll(): Promise<ResponseData<ProductUnitTypeDisplayModel[]>> {
        const { data } = await axios.get("productUnitType");

        return data;
    },
}