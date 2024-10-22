import { useState } from 'react';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  const toggleWishlist = (materialId: string) => {
    setWishlist(prevWishlist => 
      prevWishlist.includes(materialId)
        ? prevWishlist.filter(id => id !== materialId)
        : [...prevWishlist, materialId]
    );
  };

  const isWishlisted = (materialId: string) => wishlist.includes(materialId);

  return {
    wishlist,
    toggleWishlist,
    isWishlisted,
  };
};