import * as pg from 'drizzle-orm/pg-core'


export const usersTable = pg.pgTable("user", {
    userId: pg.integer("user_id").primaryKey().generatedAlwaysAsIdentity(),
    firstName: pg.varchar("first_name", {length: 50}).notNull(),
    lastName: pg.varchar("last_name", {length: 50}).notNull(),
    email: pg.varchar({length: 255}).notNull().unique(),
    password: pg.varchar({length: 255}).notNull(),
    created_at: pg.timestamp().notNull().defaultNow()
})

export const brewingProfileTable = pg.pgTable("brewing_profile", {
    brewProfileId: pg.integer("brew_profile_id").primaryKey().generatedAlwaysAsIdentity(),
    name: pg.varchar({length: 100}),
    machine: pg.varchar({length: 100}),
    bean: pg.varchar({length: 100}),
    grinder: pg.varchar({length: 100}),
    created_at: pg.timestamp().notNull().defaultNow(),
    modified_at: pg.timestamp().notNull().defaultNow(),
    userId: pg.integer("userId").notNull().references(() => usersTable.userId, { onDelete: 'cascade'})
})

export const shotTable = pg.pgTable("shot", {
    shotId: pg.integer("shot_id").primaryKey().generatedAlwaysAsIdentity(),
    dose: pg.doublePrecision().notNull(),
    output: pg.doublePrecision().notNull(),
    shotDuration: pg.doublePrecision("shot_duration").notNull(),
    beanAge: pg.integer("bean_age"),
    grindSettings: pg.varchar("grind_settings", {length: 1000}),
    puckPrepNotes: pg.varchar("puck_prep_notes",{length: 1000}),
    extractionProfile: pg.varchar("extractionProfile", {enum: ["Sour", "Bitter", "Sour + Bitter", "Balanced"]}),
    shotNotes: pg.varchar("shotNotes", {length: 1000}),
    created_at: pg.timestamp().notNull().defaultNow(),
    brewProfileId: pg.integer("brew_profile_id").notNull().references(() => brewingProfileTable.brewProfileId, { onDelete: 'cascade'})
})
