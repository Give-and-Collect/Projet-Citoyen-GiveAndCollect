export interface UserProfile {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    nomOrganisation?: string;
    profilePicture?: string | null;
    roleId: string;
    roleName: string;
}

export interface FormData {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    nomOrganisation: string;
    profilePicture: File | null;
    profilePictureBase64: string;
    roleId: string;
    roleName: string;
}