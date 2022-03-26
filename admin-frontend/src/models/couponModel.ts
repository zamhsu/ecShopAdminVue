import { fullDateTime } from "@/utils/filter";
import { PaginationModel } from "./paginationModel";

export interface OrderCouponDetailModel {
    itemNo: number,
    couponCode: string,
    quantity: number,
    total: number
}

export interface CouponDisplayModel {
    id: number,
    title: string,
    code: string,
    startDate: Date | string,
    expiredDate: Date | string,
    quantity: number,
    used: number,
    discountPercentage: number,
    statusId: number,
    statusString: string
}

export function emptyCouponDisplayModel(): CouponDisplayModel {
    return {
        id: 0,
        title: "",
        code: "",
        startDate: fullDateTime(new Date(Date.now())),
        expiredDate: fullDateTime(new Date(Date.now())),
        quantity: 0,
        used: 0,
        discountPercentage: 0,
        statusId: 0,
        statusString: ""
    }
}

export interface CouponPagedDisplayModel {
    couponDisplays: CouponDisplayModel[],
    pagination: PaginationModel
}

export interface CouponDetailModel {
    id: number,
    title: string,
    code: string,
    startDate: Date | string,
    expiredDate: Date | string,
    quantity: number,
    used: number,
    discountPercentage: number,
    statusId: number,
    statusString: string
}