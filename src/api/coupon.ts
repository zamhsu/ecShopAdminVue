import { CouponPagedDisplayModel } from "@/models/couponModel";
import { ResponseData } from "@/models/responseData";
import axios from "@/utils/http";

export default {
    /**
     * 取得分頁後的優惠券資料
     * @param pageSize 資料筆數，預設10
     * @param page 頁數，預設1
     * @returns 
     */
    async getPaged(pageSize = 10, page = 1): Promise<ResponseData<CouponPagedDisplayModel>> {
        const { data } = await axios.get(`admin/coupon?pageSize=${pageSize}&page=${page}`);

        return data;
    },

    /**
     * 刪除一筆優惠券
     * @param id 優惠券Id
     * @returns 
     */
    async deleteOne(id: string): Promise<ResponseData<boolean>> {
        const { data } = await axios.delete(`admin/coupon/${id}`);

        return data;
    },
}