import { recipients } from "../../../../drizzle/schema/recipients";
import { teams } from "../../../../drizzle/schema/teams";
import { teamMembers } from "../../../../drizzle/schema/teamMembers";
import { action } from "@solidjs/router";
import { db } from "~/api/db";

export type CreateTeamFormData = {
  teamName: string;
  recipient: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    preferredLanguage: string;
    livesWith: string;
    hometown: string;
    employment: string;
  };
  userRole: string;
  teamRole: string;
};

export const createTeamAction = action(async (formData: CreateTeamFormData) => {
  "use server";
  if (!formData) {
    console.log("No form data received");
  }
  try {
    // Step 1: create a new recipient
    await db.transaction(async (tx) => {
      const newRecipient = (
        await tx
          .insert(recipients)
          .values({
            firstName: formData.recipient.firstName,
            lastName: formData.recipient.lastName,
            email: formData.recipient.email,
            phoneNumber: formData.recipient.phoneNumber,
            gender: formData.recipient.gender,
            preferredLanguage: formData.recipient.preferredLanguage,
            livesWith: formData.recipient.livesWith,
            hometown: formData.recipient.hometown,
            employment: formData.recipient.employment,
            recipientType: "non-user",
          })
          .returning({ id: recipients.id })
      )[0];

      console.log("New Recipient:", newRecipient);

      if (!newRecipient) {
        throw new Error("Failed to insert recipient");
      }

      // Step 2: create a team with recipient's info
      const [newTeam] = await tx
        .insert(teams)
        .values({
          teamName: formData.teamName,
          recipientId: newRecipient.id,
        })
        .returning({ id: teams.id });

      // Step 3: add role for users
      await tx.insert(teamMembers).values({
        teamId: newTeam.id,
        userId: 1, // leave for now
        role: formData.teamRole,
      });
      console.log(newRecipient, newTeam);
    });

    return { success: true, message: "Succesfully create a team" };
  } catch (error) {
    console.error("Error creating team:", error);
    return { success: false, message: "Failed to create team" };
  }
});
