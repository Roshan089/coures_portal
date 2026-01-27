export const ADMIN_ROUTES_PREFIX = "/admin";
export const ADMIN_ROUTES = {
  DASHBOARD: `${ADMIN_ROUTES_PREFIX}/superadmin-dashboard`,
  COMPANIES: `${ADMIN_ROUTES_PREFIX}/company-dashboard`,
  APPLICANTS: `${ADMIN_ROUTES_PREFIX}/applicant-dashboard`,
  ADS: `${ADMIN_ROUTES_PREFIX}/advertisement`,

  AD_CREATE: `${ADMIN_ROUTES_PREFIX}/advertisement/create-ad`,
  AD_UPDATE: (id: string) =>
    `${ADMIN_ROUTES_PREFIX}/advertisement/create-ad?id=${id}`,
  LICENSING: `${ADMIN_ROUTES_PREFIX}/product-bundle`,
  CREATE_PRODUCT_BUNDLE: `${ADMIN_ROUTES_PREFIX}/create-product-bundle`,
  PRODUCT_BUNDLE: `${ADMIN_ROUTES_PREFIX}/product-bundle`,
};
