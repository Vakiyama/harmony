CREATE TABLE `alarms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`eventId` integer,
	`relativeOffset` integer DEFAULT 0,
	FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `calendars` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`teamId` integer,
	`name` text NOT NULL,
	`sources` text,
	FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`calendarId` integer,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`timeStart` integer DEFAULT (unixepoch()) NOT NULL,
	`timeEnd` integer DEFAULT (unixepoch()) NOT NULL,
	`allDay` integer DEFAULT false,
	`location` text,
	`frequency` text,
	FOREIGN KEY (`calendarId`) REFERENCES `calendars`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `alarms_id_unique` ON `alarms` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `calendars_id_unique` ON `calendars` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `events_id_unique` ON `events` (`id`);