import { real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './auth';

export * from './auth';

export const location = sqliteTable('locations', {
	latitude: real().notNull(),
	longitude: real().notNull(),
	name: text().notNull(),
	id: text().primaryKey()
});

export const reviews = sqliteTable('reviews', {
	id: text().primaryKey(),
	locationId: text()
		.references(() => location.id)
		.notNull(),
	userId: text()
		.references(() => user.id)
		.notNull(),
	review: text().notNull(),
	tag: text().notNull()
});
