CREATE TABLE "grinder" (
	"grinder_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "grinder_grinder_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"grinder_name" varchar(255),
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "machine" (
	"machine_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "machine_machine_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"machine_name" varchar(255),
	"user_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "brewing_profile" DROP COLUMN "machine";--> statement-breakpoint
ALTER TABLE "brewing_profile" ADD COLUMN "machine_id" integer REFERENCES "machine"("machine_id");--> statement-breakpoint
ALTER TABLE "brewing_profile" DROP COLUMN "grinder";--> statement-breakpoint
ALTER TABLE "brewing_profile" ADD COLUMN "grinder_id" integer REFERENCES "grinder"("grinder_id");--> statement-breakpoint
ALTER TABLE "brewing_profile" DROP CONSTRAINT "brewing_profile_user_id_user_user_id_fk";
--> statement-breakpoint
ALTER TABLE "grinder" ADD CONSTRAINT "grinder_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "machine" ADD CONSTRAINT "machine_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brewing_profile" ADD CONSTRAINT "brewing_profile_machine_id_machine_machine_id_fk" FOREIGN KEY ("machine_id") REFERENCES "public"."machine"("machine_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brewing_profile" ADD CONSTRAINT "brewing_profile_grinder_id_grinder_grinder_id_fk" FOREIGN KEY ("grinder_id") REFERENCES "public"."grinder"("grinder_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
