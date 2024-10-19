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
	`notes` text NOT NULL,
	`timeStart` integer DEFAULT (unixepoch()),
	`timeEnd` integer DEFAULT (unixepoch()),
	`location` text,
	`frequency` text,
	`type` text,
	`teamMemberId` integer,
	FOREIGN KEY (`calendarId`) REFERENCES `calendars`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`teamMemberId`) REFERENCES `teammembers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `meals` (
	`id` integer PRIMARY KEY NOT NULL,
	`photo` text,
	`category` text NOT NULL,
	`food_name` text,
	`drink_name` text,
	`consumption` text NOT NULL,
	`date` integer DEFAULT (unixepoch()) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`note_id` integer,
	FOREIGN KEY (`note_id`) REFERENCES `notes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `medications` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`dosage` text NOT NULL,
	`date` integer DEFAULT (unixepoch()) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`note_id` integer,
	FOREIGN KEY (`note_id`) REFERENCES `notes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `moods` (
	`id` integer PRIMARY KEY NOT NULL,
	`wellBeing` text NOT NULL,
	`timeFrame` text NOT NULL,
	`date` integer DEFAULT (unixepoch()) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`note_id` integer,
	FOREIGN KEY (`note_id`) REFERENCES `notes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` integer PRIMARY KEY NOT NULL,
	`category` text DEFAULT 'general' NOT NULL,
	`note` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sleeps` (
	`id` integer PRIMARY KEY NOT NULL,
	`quality` text NOT NULL,
	`time_frame` text NOT NULL,
	`duration` numeric NOT NULL,
	`date` integer DEFAULT (unixepoch()) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`note_id` integer,
	FOREIGN KEY (`note_id`) REFERENCES `notes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `alarms_id_unique` ON `alarms` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `calendars_id_unique` ON `calendars` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `events_id_unique` ON `events` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `meals_id_unique` ON `meals` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medications_id_unique` ON `medications` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `moods_id_unique` ON `moods` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `notes_id_unique` ON `notes` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `sleeps_id_unique` ON `sleeps` (`id`);