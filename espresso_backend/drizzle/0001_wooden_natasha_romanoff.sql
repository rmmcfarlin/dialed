CREATE TYPE "public"."targetRatioType" AS ENUM('ristretto', 'standard', 'lungo', 'custom');--> statement-breakpoint
ALTER TABLE "brewing_profile" ADD COLUMN "target_ratio_type" "targetRatioType";--> statement-breakpoint
ALTER TABLE "brewing_profile" ADD COLUMN "target_ratio_min" numeric;--> statement-breakpoint
ALTER TABLE "brewing_profile" ADD COLUMN "target_ratio_max" numeric;--> statement-breakpoint
ALTER TABLE "brewing_profile" ADD COLUMN "target_flow_min" numeric;--> statement-breakpoint
ALTER TABLE "brewing_profile" ADD COLUMN "target_flow_max" numeric;