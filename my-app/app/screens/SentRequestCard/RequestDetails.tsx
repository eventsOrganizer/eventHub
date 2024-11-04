import React from 'react';
import { View } from 'react-native';
import ServiceDetailsCard from '../ServiceDetailsCard';
import { Request } from '../../services/requestTypes';

interface RequestDetailsProps {
  item: Request;
  showDetails: boolean;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({ item, showDetails }) => {
  if (!showDetails) return null;

  // Determine the price based on service type
  const getPrice = () => {
    switch (item.type) {
      case 'Personal':
      case 'Local':
        return item.priceperhour;
      case 'Material':
        return item.sell_or_rent === 'sell' ? item.price : item.price_per_hour;
      default:
        return 0;
    }
  };

  return (
    <View>
      <ServiceDetailsCard
        name={item.name}
        type={item.type}
        subcategory={item.subcategory}
        category={item.category}
        details={item.details}
        price={getPrice()}
        imageUrl={item.serviceImageUrl ?? ''}
      />
    </View>
  );
};

export default RequestDetails;