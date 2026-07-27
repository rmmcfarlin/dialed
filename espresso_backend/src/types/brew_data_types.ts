import { targetRatioTypeEnum } from "../db/schema.js"

export type TargetRatioType = typeof targetRatioTypeEnum.enumValues[number]

export type BrewProfile = {
    profileName: string,
    beanId: number,
    machineId: number,
    grinderId: number,
    targetRatioType: TargetRatioType,
    targetRatioMin: number,
    targetRatioMax: number,
    targetFlowMin: number,
    targetFlowMax: number
}

