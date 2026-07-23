import * as pg from 'drizzle-orm/pg-core'


export const usersTable = pg.pgTable("user", {
    userId: pg.integer("user_id").primaryKey().generatedAlwaysAsIdentity(),
    firstName: pg.varchar("first_name", {length: 50}).notNull(),
    lastName: pg.varchar("last_name", {length: 50}).notNull(),
    email: pg.varchar({length: 255}).notNull().unique(),
    password: pg.varchar({length: 255}).notNull(),
    created_at: pg.timestamp().notNull().defaultNow()
})


export const targetRatioTypeEnum = pg.pgEnum("targetRatioType", ["ristretto", "standard", "lungo", "custom"])

export const brewingProfileTable = pg.pgTable("brewing_profile", {
    brewProfileId: pg.integer("brew_profile_id").primaryKey().generatedAlwaysAsIdentity(),
    name: pg.varchar({length: 100}),
    bean: pg.varchar({length: 100}),
    targetRatioType: targetRatioTypeEnum("target_ratio_type"),
    targetRatioMin: pg.decimal("target_ratio_min"),
    targetRatioMax: pg.decimal("target_ratio_max"),
    targetFlowMin: pg.decimal("target_flow_min"),
    targetFlowMax: pg.decimal("target_flow_max"),
    created_at: pg.timestamp().notNull().defaultNow(),
    modified_at: pg.timestamp().notNull().defaultNow(),
    machine_id: pg.integer("machine_id").notNull().references(() => machineTable.machineId, { onDelete: 'cascade'}),
    grinder_id: pg.integer("grinder_id").notNull().references(() => griderTable.grinderId, { onDelete: 'cascade'}), 
    user_id: pg.integer("user_id").notNull().references(() => usersTable.userId, { onDelete: 'cascade'})
})

export const shotTable = pg.pgTable("shot", {
    shotId: pg.integer("shot_id").primaryKey().generatedAlwaysAsIdentity(),
    dose: pg.doublePrecision().notNull(),
    output: pg.doublePrecision().notNull(),
    shotDuration: pg.doublePrecision("shot_duration").notNull(),
    beanAge: pg.integer("bean_age"),
    grindSettings: pg.varchar("grind_settings", {length: 1000}),
    puckPrepNotes: pg.varchar("puck_prep_notes",{length: 1000}),
    extractionProfile: pg.varchar("extraction_profile", {enum: ["Sour", "Bitter", "Sour + Bitter", "Balanced"]}),
    shotNotes: pg.varchar("shot_notes", {length: 1000}),
    created_at: pg.timestamp().notNull().defaultNow(),
    brewProfileId: pg.integer("brew_profile_id").notNull().references(() => brewingProfileTable.brewProfileId, { onDelete: 'cascade'})
})

export const machineTable = pg.pgTable("machine", {
    machineId: pg.integer("machine_id").primaryKey().generatedAlwaysAsIdentity(),
    machineName: pg.varchar("machine_name", {length: 255}), 
    userId: pg.integer("user_id").notNull().references(() => usersTable.userId, { onDelete: 'cascade'})
})

export const griderTable = pg.pgTable("grinder", {
    grinderId: pg.integer("grinder_id").primaryKey().generatedAlwaysAsIdentity(),
    machineName: pg.varchar("grinder_name", {length: 255}), 
    userId: pg.integer("user_id").notNull().references(() => usersTable.userId, { onDelete: 'cascade'})
})
