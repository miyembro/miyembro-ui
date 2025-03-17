import { OrganizationAddressResponse } from "./organization-address-response";

export interface OrganizationRequest {
    organizationId: string;
    name: string;
    description: string;
    logoUrl: string;
    backgroundImageUrl: string;
    email: string;
    phoneNumber: string;
    websiteUrl: string;
    organizationAddress: OrganizationAddressResponse; 
  }