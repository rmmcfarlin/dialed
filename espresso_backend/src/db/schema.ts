import * as pg from 'drizzle-orm/pg-core'


export const usersTable = pg.pgTable("user", {
    user_id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),
    first_name: pg.varchar({length: 50}).notNull(),
    last_name: pg.varchar({length: 50}).notNull(),
    email: pg.varchar({length: 255}).notNull().unique(),
    password: pg.varchar({length: 255}).notNull(),
    created_at: pg.timestamp().notNull().defaultNow()
})

export const brewingProfileTable = pg.pgTable("brewing_profile", {
    brew_profile_id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),
    name: pg.varchar({length: 100}),
    machine: pg.varchar({length: 100}),
    bean: pg.varchar({length: 100}),
    grinder: pg.varchar({length: 100}),
    created_at: pg.timestamp().notNull().defaultNow(),
    modified_at: pg.timestamp().notNull().defaultNow(),
    user_id: pg.integer().notNull().references(() => usersTable.user_id, { onDelete: 'cascade'})
})

export const shotTable = pg.pgTable("shot", {
    shot_id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),
    dose: pg.doublePrecision().notNull(),
    output: pg.doublePrecision().notNull(),
    shot_duration: pg.doublePrecision().notNull(),
    bean_age: pg.integer(),
    grind_settings: pg.varchar({length: 1000}),
    puck_prep_notes: pg.varchar({length: 1000}),
    extraction_profile: pg.varchar({enum: ["Sour", "Bitter", "Sour + Bitter", "Balanced"]}),
    shot_notes: pg.varchar({length: 1000}),
    created_at: pg.timestamp().notNull().defaultNow(),
    brew_profile_id: pg.integer().notNull().references(() => brewingProfileTable.brew_profile_id, { onDelete: 'cascade'})
})
