import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Material } from '../../navigation/types';
import { useToast } from '../../hooks/use-toast';

interface BasketContextType {
  basketItems: Material[];
  addToBasket: (material: Material) => void;
  removeFromBasket: (materialId: string) => void;
  clearBasket: () => void;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export const BasketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [basketItems, setBasketItems] = useState<Material[]>([]);
  const { toast } = useToast();

  const addToBasket = (material: Material) => {
    setBasketItems(prev => {
      if (prev.some(item => item.id === material.id)) {
        toast({
          title: "Already in basket",
          description: "This item is already in your basket",
          variant: "destructive"
        });
        return prev;
      }
      toast({
        title: "Added to basket",
        description: `${material.name} has been added to your basket`
      });
      return [...prev, material];
    });
  };

  const removeFromBasket = (materialId: string) => {
    setBasketItems(prev => prev.filter(item => item.id !== materialId));
    toast({
      title: "Removed from basket",
      description: "Item has been removed from your basket",
      variant: "destructive"
    });
  };

  const clearBasket = () => {
    setBasketItems([]);
  };

  return (
    <BasketContext.Provider value={{ basketItems, addToBasket, removeFromBasket, clearBasket }}>
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (context === undefined) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
};