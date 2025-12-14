import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export * from "./auth";

export const location = sqliteTable("locations", {
	latitude: real(),
	longitude: real(),
	name: text(),
	id: text().primaryKey()
})
