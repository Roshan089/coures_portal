export interface CreateAd {
  bannerName: string;
  bannerCode: string;
  bannerDescription: string;
  bannerStartDate: string;
  bannerEndDate: string;
  bannerImage: string;
  location: string; // Assuming AdLocation is an enum
  redirectionLink: string;
  embedCodeSnippet: string;
}
