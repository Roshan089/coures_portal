export const STATE_API_CONSTANT = {
  getStateList: (countryCode: string) => `/utils-api/states/${countryCode}`,
  getCityList: (stateCode: string, countryCode: string) =>
    `/utils-api/cities/${countryCode}/${stateCode}`,
};
