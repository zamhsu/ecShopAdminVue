import { PaginationModel } from "./PaginationModel";

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
    startDate: Date,
    expiredDate: Date,
    quantity: number,
    used: number,
    discountPercentage: number,
    statusId: number,
    statusString: string
}

export interface CouponPagedDisplayModel {
    couponDisplays: CouponDisplayModel[],
    pagination: PaginationModel
}

export interface CouponDetailModel {
    id: number,
    title: string,
    code: string,
    startDate: Date,
    expiredDate: Date,
    quantity: number,
    used: number,
    discountPercentage: number,
    statusId: number,
    statusString: string
}