import React from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export const getSubcategoryIcon = (subcategoryId: number) => {
  switch (subcategoryId) {
    case 159:
      return (props: any) => <Ionicons name="headset-outline" {...props} />;
    case 160:
      return (props: any) => <Ionicons name="bed-outline" {...props} />;
    case 161:
      return (props: any) => <Ionicons name="restaurant-outline" {...props} />;
    case 162:
      return (props: any) => <Ionicons name="restaurant" {...props} />;
    case 163:
      return (props: any) => <Ionicons name="wine" {...props} />;
    case 164:
      return (props: any) => <Ionicons name="beer" {...props} />;
    case 165:
      return (props: any) => <MaterialIcons name="cleaning-services" {...props} />;
    case 166:
      return (props: any) => <Ionicons name="star" {...props} />;
    case 167:
      return (props: any) => <MaterialIcons name="table-bar" {...props} />;
    default:
      return (props: any) => <Ionicons name="apps-outline" {...props} />;
  }
};