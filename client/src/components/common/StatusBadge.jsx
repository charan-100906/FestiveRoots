import React from 'react';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toUpperCase();

  const getStyleClass = () => {
    switch (normalized) {
      case 'DELIVERED':
      case 'APPROVED':
      case 'VERIFIED':
      case 'PAID':
        return 'verified';
      case 'PLACED':
      case 'AWAITING_ARTISAN_CONFIRMATION':
      case 'PENDING':
        return 'pending';
      case 'CONFIRMED':
      case 'PREPARING':
      case 'READY_FOR_COLLECTION':
      case 'COLLECTION_SCHEDULED':
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return 'preparing';
      case 'CANCELLED':
      case 'REJECTED':
      case 'FAILED':
        return 'rejected';
      default:
        return 'pending';
    }
  };

  const getLabel = () => {
    switch (normalized) {
      case 'AWAITING_ARTISAN_CONFIRMATION':
        return 'Awaiting Artisan';
      case 'READY_FOR_COLLECTION':
        return 'Ready for Pickup';
      case 'COLLECTION_SCHEDULED':
        return 'Pickup Scheduled';
      case 'OUT_FOR_DELIVERY':
        return 'Out for Delivery';
      default:
        return normalized.replace(/_/g, ' ');
    }
  };

  return (
    <span className={`status-badge ${getStyleClass()}`}>
      {getLabel()}
    </span>
  );
};

export default StatusBadge;
