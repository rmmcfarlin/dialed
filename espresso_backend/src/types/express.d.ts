import { type BrewProfile } from "./brew_data_types.ts";

export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
      };
      brewProfile?: BrewProfile
    }
  }
}
