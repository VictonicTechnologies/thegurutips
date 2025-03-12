import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ManualPaymentModal } from './ManualPaymentModal';
import { MpesaModal } from './MpesaModal';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  planName: string;
  price: string;
}

export function SubscriptionModal({ isOpen, onClose, onSuccess, planName, price }: SubscriptionModalProps) {
  const [showManualModal, setShowManualModal] = useState(false);
  const [showMpesaModal, setShowMpesaModal] = useState(false);

  const handleManualClick = () => {
    onClose();
    setShowManualModal(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Subscribe to {planName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{price}</p>
              <p className="text-sm text-gray-500">per month</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">What's included:</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                {planName === "Pro Research" ? (
                  <>
                    <li>✓ 50+ research insights monthly</li>
                    <li>✓ Professional analysis</li>
                    <li>✓ Performance metrics</li>
                  </>
                ) : (
                  <>
                    <li>✓ Unlimited research insights</li>
                    <li>✓ 1-on-1 consultation</li>
                    <li>✓ Live match analysis</li>
                    <li>✓ Priority support</li>
                    <li>✓ Satisfaction guarantee</li>
                  </>
                )}
              </ul>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleManualClick}
                className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
              >
                Pay with M-PESA
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ManualPaymentModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        onSuccess={onSuccess}
        planName={planName}
        price={price}
      />

      <MpesaModal
        isOpen={showMpesaModal}
        onClose={() => setShowMpesaModal(false)}
        onSuccess={onSuccess}
        planName={planName}
        price={price}
      />
    </>
  );
}