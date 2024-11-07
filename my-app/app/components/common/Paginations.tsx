import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === totalPages - 1;

  return (
    <View style={tw`flex-row justify-between items-center px-4 py-4`}>
      <TouchableOpacity 
        style={tw`flex-row items-center ${isFirstPage ? 'opacity-50' : ''}`}
        onPress={() => !isFirstPage && onPageChange(currentPage - 1)}
        disabled={isFirstPage}
      >
        <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
        <Text style={tw`text-white ml-1`}>Previous</Text>
      </TouchableOpacity>

      <Text style={tw`text-white`}>
        Page {currentPage + 1} of {totalPages}
      </Text>

      <TouchableOpacity 
        style={tw`flex-row items-center ${isLastPage ? 'opacity-50' : ''}`}
        onPress={() => !isLastPage && onPageChange(currentPage + 1)}
        disabled={isLastPage}
      >
        <Text style={tw`text-white mr-1`}>Next</Text>
        <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;