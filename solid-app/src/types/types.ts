export type CreateRecipientActionResponse = {
  success?: boolean;
  error?: string;
  recipientId?: number;
  message?: string;
  photo?: string;
};

export type CreateTeamActionResponse = {
  success?: boolean;
  error?: string;
  teamId?: number;
  message?: string;
};

export type CreateSurgeryActionResponse = {
  success?: boolean;
  error?: string;
  message?: string;
};

export type CreateInjuryActionResponse = {
  success?: boolean;
  error?: string;
  message?: string;
};

export type CreateMedicationActionResponse = {
  success?: boolean;
  error?: string;
  message?: string;
};
