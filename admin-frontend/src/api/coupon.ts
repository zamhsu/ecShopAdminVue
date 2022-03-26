import { CouponDisplayModel, CouponPagedDisplayModel } from "@/models/couponModel";
import { RequestData } from "@/models/requestData";
import { ResponseData } from "@/models/responseData";
import axios from "@/utils/http";
import stringUtils from "@/utils/stringUtils";

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
     * 新增一筆優惠券
     * @param coupon 優惠券資料
     * @returns 
     */
    async createOne(coupon: CouponDisplayModel): Promise<ResponseData<boolean>> {
        const requestData: RequestData<CouponDisplayModel> = {
            data: coupon,
            timeZone: stringUtils.getClientTimeZone()
        };

        const { data } = await axios.post("admin/coupon", requestData);

        return data;
    },

    /**
     * 更新一筆優惠券
     * @param coupon 優惠券資料
     * @returns 
     */
    async updateOne(coupon: CouponDisplayModel): Promise<ResponseData<boolean>> {
        const requestData: RequestData<CouponDisplayModel> = {
            data: coupon,
            timeZone: stringUtils.getClientTimeZone()
        };

        const { data } = await axios.put(`admin/coupon/${coupon.id}`, requestData);

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