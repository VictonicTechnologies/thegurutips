"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Phone } from "lucide-react";

interface MpesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  planName: string;
  price: string;
}

export function MpesaModal({ isOpen, onClose, onSuccess, planName, price }: MpesaModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.match(/^(?:254|\+254|0)?([71](?:(?:[0-9][0-9])|(?:0[0-8]))[0-9]{6})$/)) {
      toast.error('Please enter a valid Kenyan phone number');
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Implement actual M-PESA payment integration
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      toast.success('M-PESA push notification sent to your phone');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to initiate M-PESA payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Phone className="w-5 h-5 text-green-500" />
            Enter M-PESA Number
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="text-center mb-4">
              <p className="text-2xl font-bold">{price}</p>
              <p className="text-sm text-gray-500">Payment for {planName}</p>
            </div>
            <Input
              type="tel"
              placeholder="Enter phone number (e.g., 0712345678)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              Enter the phone number registered with M-PESA
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? "Processing..." : "Pay Now"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}