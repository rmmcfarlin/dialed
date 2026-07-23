import { targetRatioTypeEnum } from "../db/schema.js"

export type TargetRatioType = typeof targetRatioTypeEnum.enumValues[number]

export type BrewProfile = {
    profileName: string,
    bean: string,
    machine: string,
    grinder: string,
    targetRatioType: TargetRatioType,
    targetRatioMin?: number,
    targetRatioMax?: number,
    targetFlowMin?: number,
    targetFlowMax?: number
}

