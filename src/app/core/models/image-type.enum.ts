export enum ImageType {
    PROFILE_IMAGE = 'profile-image',
    BACKGROUND_IMAGE = 'background-image',
    LOGO_IMAGE = 'logo-image'

}

export function getImageTypeValue(imageType: ImageType): string {
    return imageType;
}
  