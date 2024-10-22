import { useState } from 'react';
import { Material } from '../navigation/types';

export const useBasket = () => {
  const [basket, setBasket] = useState<Material[]>([]);

  const addToBasket = (material: Material) => {
    setBasket(prevBasket => [...prevBasket, material]);
  };

  return {
    basket,
    addToBasket,
    basketCount: basket.length,
  };
};