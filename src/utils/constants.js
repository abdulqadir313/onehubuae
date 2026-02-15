/**
 * System-wide constant IDs. Match seed/preData order where applicable.
 */

const USER_TYPES = {
  SUPER_ADMIN: 1,
  BRAND: 2,
  INFLUENCER: 3,
};

const SUB_STATUS = {
  ACTIVE: 1,
  EXPIRED: 2,
  CANCELLED: 3,
  SCHEDULED: 4,
  UPGRADED: 5,
};

const ORDER_STATUS = {
  PENDING: 1,
  CONFIRMED: 3,
  IN_PROGRESS: 4,
  COMPLETED: 8,
  CANCELLED: 9,
};

const PAYMENT_STATUS = {
  PENDING: 1,
  PAID: 3,
  FAILED: 4,
  REFUNDED: 5,
};

module.exports = {
  USER_TYPES,
  SUB_STATUS,
  ORDER_STATUS,
  PAYMENT_STATUS,
};
