import { type BrewProfile, TargetRatioType } from "./brew_data_types.ts";

export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
      };
      brewProfile?: BrewProfile;
          
      brewProfileUpdate?: {
          profileId: string,
          targetRatioType?: TargetRatioType, 
          targetRatioMin: number,
          targetRatioMax: number, 
          targetFlowMin: number,
          targetFlowMax: number
      };
    }
  }
}
