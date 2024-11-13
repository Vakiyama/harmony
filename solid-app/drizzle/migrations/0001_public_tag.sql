CREATE TABLE `importantsurgeries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`year` text,
	`extra_notes` text,
	`recipient_id` integer,
	FOREIGN KEY (`recipient_id`) REFERENCES `recipients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `journals` (
	`id` integer PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`entry_id` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pastInjuries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`recipient_id` integer,
	FOREIGN KEY (`recipient_id`) REFERENCES `recipients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `taken_medications` (
	`id` integer PRIMARY KEY NOT NULL,
	`date` integer DEFAULT (unixepoch()) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`note_id` integer,
	`team_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`medication_id` integer NOT NULL,
	`type` text NOT NULL,
	`has_missed` integer NOT NULL,
	FOREIGN KEY (`note_id`) REFERENCES `notes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`medication_id`) REFERENCES `medications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
/*
 SQLite does not support "Dropping foreign key" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
/*
 SQLite does not support "Set default to column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
/*
 SQLite does not support "Drop default from column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
/*
 SQLite does not support "Set not null to column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
ALTER TABLE `meals` ADD `team_id` integer NOT NULL REFERENCES teams(id);--> statement-breakpoint
ALTER TABLE `meals` ADD `user_id` integer NOT NULL REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `medications` ADD `typeOfMedication` text;--> statement-breakpoint
ALTER TABLE `medications` ADD `frequency` text NOT NULL;--> statement-breakpoint
ALTER TABLE `medications` ADD `schedule` text NOT NULL;--> statement-breakpoint
ALTER TABLE `medications` ADD `side_effects` text;--> statement-breakpoint
ALTER TABLE `medications` ADD `instructions` text;--> statement-breakpoint
ALTER TABLE `medications` ADD `pharmacy_info` text;--> statement-breakpoint
ALTER TABLE `medications` ADD `pharmacy_img` text;--> statement-breakpoint
ALTER TABLE `medications` ADD `team_id` integer NOT NULL REFERENCES teams(id);--> statement-breakpoint
ALTER TABLE `moods` ADD `team_id` integer NOT NULL REFERENCES teams(id);--> statement-breakpoint
ALTER TABLE `moods` ADD `user_id` integer NOT NULL REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `notes` ADD `team_id` integer NOT NULL REFERENCES teams(id);--> statement-breakpoint
ALTER TABLE `notes` ADD `user_id` integer NOT NULL REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `recipients` ADD `age` text NOT NULL;--> statement-breakpoint
ALTER TABLE `recipients` ADD `health_condition` text NOT NULL;--> statement-breakpoint
ALTER TABLE `recipients` ADD `allergies` text;--> statement-breakpoint
ALTER TABLE `recipients` ADD `dietary_restrictions` text;--> statement-breakpoint
ALTER TABLE `recipients` ADD `past_injuries` text;--> statement-breakpoint
ALTER TABLE `recipients` ADD `mobility_need` text;--> statement-breakpoint
ALTER TABLE `sleeps` ADD `troubleSleeping` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `sleeps` ADD `team_id` integer NOT NULL REFERENCES teams(id);--> statement-breakpoint
ALTER TABLE `sleeps` ADD `user_id` integer NOT NULL REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `teammembers` ADD `default_team` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `teams` ADD `photo` text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `importantsurgeries_id_unique` ON `importantsurgeries` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `journals_id_unique` ON `journals` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `pastInjuries_id_unique` ON `pastInjuries` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `taken_medications_id_unique` ON `taken_medications` (`id`);--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
ALTER TABLE `medications` DROP COLUMN `date`;--> statement-breakpoint
ALTER TABLE `medications` DROP COLUMN `note_id`;--> statement-breakpoint
ALTER TABLE `recipients` DROP COLUMN `hometown`;