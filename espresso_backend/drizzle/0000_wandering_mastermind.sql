CREATE TYPE "public"."roastLevelType" AS ENUM('light', 'medium light', 'medium', 'medium dark', 'dark');--> statement-breakpoint
CREATE TYPE "public"."targetRatioType" AS ENUM('ristretto', 'standard', 'lungo', 'custom');--> statement-breakpoint
CREATE TABLE "bean" (
	"bean_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "bean_bean_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"bean_name" varchar(100) NOT NULL,
	"roast_level" "roastLevelType",
	"origin" varchar(100),
	"tastingNotes" varchar(255),
	"roaster_id" integer,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brew_profile" (
	"brew_profile_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "brew_profile_brew_profile_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(100),
	"bean_id" integer NOT NULL,
	"target_ratio_type" "targetRatioType",
	"target_ratio_min" numeric,
	"target_ratio_max" numeric,
	"target_flow_min" numeric,
	"target_flow_max" numeric,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"modified_at" timestamp DEFAULT now() NOT NULL,
	"machine_id" integer NOT NULL,
	"grinder_id" integer NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grinder" (
	"grinder_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "grinder_grinder_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"grinder_name" varchar(255) NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "machine" (
	"machine_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "machine_machine_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"machine_name" varchar(255) NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roaster" (
	"roaster_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "roaster_roaster_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"roaster_name" varchar(100) NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shot" (
	"shot_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "shot_shot_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"dose" double precision NOT NULL,
	"output" double precision NOT NULL,
	"shot_duration" double precision NOT NULL,
	"grind_settings" varchar(1000),
	"puck_prep_notes" varchar(1000),
	"extraction_profile" varchar,
	"shot_notes" varchar(1000),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"brew_profile_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"user_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "bean" ADD CONSTRAINT "bean_roaster_id_roaster_roaster_id_fk" FOREIGN KEY ("roaster_id") REFERENCES "public"."roaster"("roaster_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bean" ADD CONSTRAINT "bean_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brew_profile" ADD CONSTRAINT "brew_profile_bean_id_bean_bean_id_fk" FOREIGN KEY ("bean_id") REFERENCES "public"."bean"("bean_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brew_profile" ADD CONSTRAINT "brew_profile_machine_id_machine_machine_id_fk" FOREIGN KEY ("machine_id") REFERENCES "public"."machine"("machine_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brew_profile" ADD CONSTRAINT "brew_profile_grinder_id_grinder_grinder_id_fk" FOREIGN KEY ("grinder_id") REFERENCES "public"."grinder"("grinder_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brew_profile" ADD CONSTRAINT "brew_profile_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grinder" ADD CONSTRAINT "grinder_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "machine" ADD CONSTRAINT "machine_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roaster" ADD CONSTRAINT "roaster_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shot" ADD CONSTRAINT "shot_brew_profile_id_brew_profile_brew_profile_id_fk" FOREIGN KEY ("brew_profile_id") REFERENCES "public"."brew_profile"("brew_profile_id") ON DELETE cascade ON UPDATE no action;