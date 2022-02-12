import { OrderCouponDetailModel } from "./couponModel";
import { OrderDetailModel } from "./orderDetailModel";
import { PaginationModel } from "./PaginationModel";

export interface OrderDisplayDetailModel {
    guid: string,
    name: string,
    email: string,
    phone: string,
    address: string,
    total: number,
    paymentMethodId: number,
    paymentMethodString: string,
    paidDate: Date,
    statusId: number,
    statusString: string,
    createDate: Date,
    orderDetails: OrderDetailModel[],
    couponDetail: OrderCouponDetailModel[]
}

export interface OrderDisplayModel {
    guid: string,
    name: string,
    email: string,
    phone: string,
    address: string,
    total: number,
    paymentMethodId: number,
    paymentMethodString: string,
    paidDate: Date,
    statusId: number,
    statusString: string,
    createDate: Date
}

export interface OrderPagedDisplayModel {
    orderDisplays: OrderDisplayModel[],
    pagination: PaginationModel
}