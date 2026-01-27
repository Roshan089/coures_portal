export const ADS_PREFIX = "ads";
export const ADS_API_CONSTANT = {
  ads: `/${ADS_PREFIX}`,
  getAdById: (id: string) => `/${ADS_PREFIX}/${id}`,
  updatedAd: (adId: string) => {
    console.log("Ad ID:", adId);
    return `/${ADS_PREFIX}/${adId}`;
  },
  deleteAd: (adId: string) => `/${ADS_PREFIX}/${adId}`,
};
