import { OrderDisplayDetailModel, OrderPagedDisplayModel } from "@/models/orderModel";
import { ResponseData } from "@/models/responseData";
import axios from "@/utils/http";

export default {
    /**
     * 取得分頁後的訂單資料
     * @param pageSize 資料筆數，預設10
     * @param page 頁數，預設1
     * @returns 
     */
    async getPaged(pageSize = 10, page = 1): Promise<ResponseData<OrderPagedDisplayModel>> {
        const { data } = await axios.get(`admin/order?pageSize=${pageSize}&page=${page}`);

        return data;
    },

    /**
     * 取得一筆訂單資料
     * @param guid 訂單GUID
     * @returns 
     */
    async getOne(guid: string): Promise<ResponseData<OrderDisplayDetailModel>> {
        const { data } = await axios.get(`admin/order/${guid}`);

        return data;
    },
}