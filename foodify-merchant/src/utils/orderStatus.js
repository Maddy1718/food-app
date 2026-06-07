export const ORDER_STATUS_IDS = {
  ORDER_PLACED: 1,
  PREPARING: 2,
  OUT_FOR_DELIVERY: 3,
  DELIVERED: 4,
  CANCELLED: 5,
  READY_FOR_PICKUP: 6,
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS_IDS.ORDER_PLACED]: "Order Placed",
  [ORDER_STATUS_IDS.PREPARING]: "Preparing",
  [ORDER_STATUS_IDS.OUT_FOR_DELIVERY]: "Out for Delivery",
  [ORDER_STATUS_IDS.DELIVERED]: "Delivered",
  [ORDER_STATUS_IDS.CANCELLED]: "Cancelled",
  [ORDER_STATUS_IDS.READY_FOR_PICKUP]: "Ready for Pickup",
};

export const OWNER_MANAGED_STATUS_IDS = [
  ORDER_STATUS_IDS.ORDER_PLACED,
  ORDER_STATUS_IDS.PREPARING,
  ORDER_STATUS_IDS.READY_FOR_PICKUP,
];

export const DELIVERY_PARTNER_STATUS_IDS = [
  ORDER_STATUS_IDS.OUT_FOR_DELIVERY,
  ORDER_STATUS_IDS.DELIVERED,
];

export const getStatusName = (order) =>
  order?.status_catalog?.status_name ||
  ORDER_STATUS_LABELS[order?.status_id] ||
  "Unknown Status";

export const getStatusColor = (statusId) => {
  switch (Number(statusId)) {
    case ORDER_STATUS_IDS.ORDER_PLACED:
      return "#0ea5e9";
    case ORDER_STATUS_IDS.PREPARING:
      return "#f59e0b";
    case ORDER_STATUS_IDS.READY_FOR_PICKUP:
      return "#16a34a";
    case ORDER_STATUS_IDS.OUT_FOR_DELIVERY:
      return "#8b5cf6";
    case ORDER_STATUS_IDS.DELIVERED:
      return "#16a34a";
    case ORDER_STATUS_IDS.CANCELLED:
      return "#ef4444";
    default:
      return "#ff6b00";
  }
};

export const getStatusColorFromOrder = (order) =>
  getStatusColor(order?.status_id ?? order?.status_catalog?.id);
