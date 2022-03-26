export type alertEventModel = {
    alertEvent: alertMessageModel
}

export interface alertMessageModel {
    id?: string,
    message: string,
    status: "primary" | "success" | "warning" | "danger",
    icon?: string,
    timestamp?: number
}