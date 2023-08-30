import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;
export type Recipe = {
	id: string;
	userId: string;
	name: string;
	parsedName: string;
	htmlBody: string;
	markdownBody: string;
	url: string;
	userNotes: string | null;
	order: number | null;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
};
export type DB = {
	Recipe: Recipe;
};
