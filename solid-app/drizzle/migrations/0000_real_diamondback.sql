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
CREATE TABLE `event_participants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`status` text DEFAULT 'maybe',
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`calendarId` integer NOT NULL,
	`title` text NOT NULL,
	`notes` text NOT NULL,
	`timeStart` integer DEFAULT (unixepoch()),
	`timeEnd` integer DEFAULT (unixepoch()),
	`location` text NOT NULL,
	`repeat` text NOT NULL,
	`type` text NOT NULL,
	FOREIGN KEY (`calendarId`) REFERENCES `calendars`(`id`) ON UPDATE no action ON DELETE no action
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
CREATE TABLE `recipients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text,
	`phone_number` text,
	`recipient_type` text NOT NULL,
	`photo` text DEFAULT '',
	`gender` text NOT NULL,
	`preferred_language` text NOT NULL,
	`lives_with` text,
	`hometown` text,
	`employment` text,
	`user_id` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
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
CREATE TABLE `teammembers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`team_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`role` text DEFAULT 'member',
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`team_name` text NOT NULL,
	`recipient_id` integer NOT NULL,
	FOREIGN KEY (`recipient_id`) REFERENCES `recipients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kindeId` text NOT NULL,
	`displayName` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`photo` text DEFAULT '',
	`email` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`role_type` text NOT NULL,
	`birth_date` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `alarms_id_unique` ON `alarms` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `calendars_id_unique` ON `calendars` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `event_participants_id_unique` ON `event_participants` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `events_id_unique` ON `events` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `meals_id_unique` ON `meals` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medications_id_unique` ON `medications` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `moods_id_unique` ON `moods` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `notes_id_unique` ON `notes` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `recipients_id_unique` ON `recipients` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `recipients_email_unique` ON `recipients` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `recipients_phone_number_unique` ON `recipients` (`phone_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `sleeps_id_unique` ON `sleeps` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `teammembers_id_unique` ON `teammembers` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `teams_id_unique` ON `teams` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `teams_recipient_id_unique` ON `teams` (`recipient_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_kindeId_unique` ON `users` (`kindeId`);