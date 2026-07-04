CREATE TABLE "brewing_profile" (
	"brew_profile_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "brewing_profile_brew_profile_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(100),
	"machine" varchar(100),
	"bean" varchar(100),
	"grinder" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"modified_at" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shot" (
	"shot_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "shot_shot_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"dose" double precision NOT NULL,
	"output" double precision NOT NULL,
	"shot_duration" double precision NOT NULL,
	"bean_age" integer,
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
ALTER TABLE "brewing_profile" ADD CONSTRAINT "brewing_profile_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shot" ADD CONSTRAINT "shot_brew_profile_id_brewing_profile_brew_profile_id_fk" FOREIGN KEY ("brew_profile_id") REFERENCES "public"."brewing_profile"("brew_profile_id") ON DELETE cascade ON UPDATE no action;