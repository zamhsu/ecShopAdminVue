import mitt from "mitt";
import { alertEventModel } from "@/models/alertEventModel";

export const emitter = mitt<alertEventModel>();