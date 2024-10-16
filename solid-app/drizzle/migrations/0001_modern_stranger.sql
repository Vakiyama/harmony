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
ALTER TABLE `users` ADD `first_name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `last_name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `photo` text DEFAULT '';--> statement-breakpoint
ALTER TABLE `users` ADD `email` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `created_at` text DEFAULT '2024-10-15T23:58:16.526Z';--> statement-breakpoint
ALTER TABLE `users` ADD `updated_at` text DEFAULT '2024-10-15T23:58:16.530Z';--> statement-breakpoint
ALTER TABLE `users` ADD `role_type` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `recipients_id_unique` ON `recipients` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `recipients_email_unique` ON `recipients` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `recipients_phone_number_unique` ON `recipients` (`phone_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `teammembers_id_unique` ON `teammembers` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `teams_id_unique` ON `teams` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `teams_recipient_id_unique` ON `teams` (`recipient_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);