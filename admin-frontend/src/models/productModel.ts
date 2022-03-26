import { fullDateTime } from "@/utils/filter";
import { PaginationModel } from "./paginationModel";

export interface ProductDisplayModel {
    guid: string,
    title: string,
    categoryId: number,
    categoryString: string,
    unitId: number,
    unitString: string,
    quantity: number,
    originPrice: number,
    price: number,
    description: string,
    startDisplay: Date | string,
    endDisplay: Date | string,
    imageUrl: string,
    memo: string,
    statusId: number,
    statusString: string
}

export interface ProductPagedDisplayModel {
    products: ProductDisplayModel[],
    pagination: PaginationModel
}

export function emptyProductDisplayModel(): ProductDisplayModel {
    return {
        guid: "",
        title: "",
        categoryId: 0,
        categoryString: "",
        unitId: 0,
        unitString: "",
        quantity: 0,
        originPrice: 0,
        price: 0,
        description: "",
        startDisplay: fullDateTime(new Date(Date.now())),
        endDisplay: fullDateTime(new Date(Date.now())),
        imageUrl: "",
        memo: "",
        statusId: 0,
        statusString: ""
    }
}