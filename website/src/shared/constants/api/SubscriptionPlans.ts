export const SUBSCRIPTION_PLANS_PREFIX = "subscription-plans";
export const SUBSCRIPTION_PLANS_API_CONSTANT = {
  postSubscriptionPlans: `/${SUBSCRIPTION_PLANS_PREFIX}`,
  getSubscriptionPlans: `/${SUBSCRIPTION_PLANS_PREFIX}`,
  getSubscriptionPlanById: (bundleId: string) =>
    `/${SUBSCRIPTION_PLANS_PREFIX}/${bundleId}`,
  getFeatures: (userType: string) =>
    `/${SUBSCRIPTION_PLANS_PREFIX}/features/${userType}`,
  putSubscriptionPlans: (bundleId: string) =>
    `/${SUBSCRIPTION_PLANS_PREFIX}/${bundleId}`,
  deleteSubscriptionPlans: (bundleId: string) =>
    `/${SUBSCRIPTION_PLANS_PREFIX}/${bundleId}`,
};
