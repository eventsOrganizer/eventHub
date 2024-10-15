import { useState, useEffect } from 'react';
import { Service } from '../services/serviceTypes';

export const useServiceFiltering = (initialServices: Service[]) => {
    const [services, setServices] = useState<Service[]>(initialServices);
    const [filteredServices, setFilteredServices] = useState<Service[]>(initialServices);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
  
    useEffect(() => {
      let filtered = services;
      if (selectedCategory) {
        filtered = filtered.filter(service => service.subcategory?.name === selectedCategory);
      }
      if (searchQuery) {
        filtered = filtered.filter(service => 
          service.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (minPrice) {
        filtered = filtered.filter(service => service.priceperhour >= parseFloat(minPrice));
      }
      if (maxPrice) {
        filtered = filtered.filter(service => service.priceperhour <= parseFloat(maxPrice));
      }
      setFilteredServices(filtered);
    }, [services, selectedCategory, searchQuery, minPrice, maxPrice]);
  
    return {
      filteredServices,
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,
      minPrice,
      setMinPrice,
      maxPrice,
      setMaxPrice,
      setServices,
    };
  };