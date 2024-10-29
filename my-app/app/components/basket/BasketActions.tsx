import React from 'react';
import { createRentalRequest } from './RentalRequestService';
import { useUser } from '../../UserContext';
import { useToast } from '../../hooks/use-toast';
import { Material } from '../../navigation/types';

interface BasketActionsProps {
  item: Material;
  onSuccess: () => void;
}

export const useBasketActions = () => {
  const { userId, isAuthenticated } = useUser();
  const { toast } = useToast();

  const handleRentalRequest = async (item: Material, onSuccess: () => void) => {
    if (!isAuthenticated || !userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to send rental requests",
        variant: "destructive"
      });
      return false;
    }

    try {
      await createRentalRequest(Number(item.id), userId);
      toast({
        title: "Request Sent",
        description: "Your rental request has been sent successfully"
      });
      onSuccess();
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send rental request. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handlePurchase = async (item: Material, onSuccess: () => void) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to complete your purchase",
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Purchase Initiated",
      description: "Proceeding to checkout..."
    });
    onSuccess();
    return true;
  };

  return {
    handleRentalRequest,
    handlePurchase
  };
};