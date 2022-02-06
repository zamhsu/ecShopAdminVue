import { ProductDisplayModel, ProductPagedDisplayModel } from "@/models/productModel";
import { RequestData } from "@/models/requestData";
import { ResponseData } from "@/models/responseData";
import axios from "@/utils/http";
import stringUtils from "@/utils/stringUtils";

export default {
    /**
     * 取得分頁後的產品資料
     * @param pageSize 資料筆數，預設10
     * @param page 頁數，預設1
     * @returns 
     */
    async getPaged(pageSize = 10, page = 1): Promise<ResponseData<ProductPagedDisplayModel>> {
        const { data } = await axios.get(`product?pageSize=${pageSize}&page=${page}`);

        return data;
    },

    /**
     * 更新一筆產品
     * @param product 產品資料
     * @returns 
     */
     async updateOne(product: ProductDisplayModel): Promise<ResponseData<boolean>> {
        const requestData: RequestData<ProductDisplayModel> = {
            data: product,
            timeZone: stringUtils.getClientTimeZone()
        };

        const { data } = await axios.put(`admin/product/${product.guid}`, requestData);

        return data;
    },

    /**
     * 刪除一筆產品
     * @param guid 產品Guid
     * @returns 
     */
     async deleteOne(guid: string): Promise<ResponseData<boolean>> {
        const { data } = await axios.delete(`admin/product/${guid}`);

        return data;
    },
}