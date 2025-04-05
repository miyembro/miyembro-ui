import { ConfirmationResultType } from "./confirmation-result-type.enum";

export interface RegistrationEmailConfirmationResponse {
    message: string;
    confirmationResultType: ConfirmationResultType;
}

