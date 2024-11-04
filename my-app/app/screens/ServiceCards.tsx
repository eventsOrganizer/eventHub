import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

interface ServiceCardProps {
    service: {
      service_id: number;
      service_name: string;
      service_details: string;
      service_type: 'personal' | 'local' | 'material';
      service_price: number;
      media_urls: string[];
      distance: number | null;
      service_startdate: string | null;
      service_enddate: string | null;
      subcategory_id: number;
      category_id: number;
      sell_or_rent: 'sell' | 'rent' | null;
    };
    onPress: () => void;
  }

  const ServiceCards: React.FC<ServiceCardProps> = ({ service, onPress }) => {
    const handlePress = () => {
      console.log('Service Details:', {
        id: service.service_id,
        name: service.service_name,
        type: service.service_type,
        price: service.service_price,
        details: service.service_details,
        dates: {
          start: service.service_startdate,
          end: service.service_enddate
        },
        sellOrRent: service.sell_or_rent,
        distance: service.distance
      });
      onPress();
    };
  
    return (
      <TouchableOpacity 
        onPress={handlePress}
        style={tw`flex-row bg-white rounded-lg shadow-md mb-4 p-4`}
      >
        {/* Rest of your existing card UI */}
        {service.media_urls && service.media_urls.length > 0 ? (
          <Image 
            source={{ uri: service.media_urls[0].trim() }} 
            style={tw`w-20 h-20 rounded-lg mr-4`} 
          />
        ) : (
          <View style={tw`w-20 h-20 bg-gray-200 rounded-lg mr-4 justify-center items-center`}>
            <Ionicons name="image-outline" size={24} color="gray" />
          </View>
        )}
        
        <View style={tw`flex-1 justify-between`}>
          <View>
            <Text style={tw`text-lg font-bold text-gray-900 mb-1`}>
              {service.service_name}
            </Text>
            <Text style={tw`text-gray-600 mb-2`} numberOfLines={2}>
              {service.service_details}
            </Text>
          </View>
          
          <View style={tw`flex-row justify-between items-center`}>
            <View>
              <Text style={tw`text-blue-500 font-semibold text-base`}>
                ${service.service_price}
                {service.service_type !== 'material' ? '/hr' : ''}
              </Text>
              {service.service_type === 'material' && service.sell_or_rent && (
                <Text style={tw`text-gray-500 text-sm`}>
                  {service.sell_or_rent.toUpperCase()}
                </Text>
              )}
            </View>
            {typeof service.distance === 'number' && (
              <Text style={tw`text-sm text-gray-500`}>
                {service.distance.toFixed(1)} km away
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

export default ServiceCards;