import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CreditCard, CheckCircle2, Copy, Check } from "lucide-react";
import { subscriptionStorage, mpesaStorage } from '@/lib/storage';

interface ManualPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  planName: string;
  price: string;
}

export function ManualPaymentModal({ isOpen, onClose, onSuccess, planName, price }: ManualPaymentModalProps) {
  const [mpesaMessage, setMpesaMessage] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [copied, setCopied] = useState(false);

  const TILL_NUMBER = '5204479';

  const copyTillNumber = async () => {
    try {
      await navigator.clipboard.writeText(TILL_NUMBER);
      setCopied(true);
      toast.success('Till number copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy till number');
    }
  };

  const validatePayment = () => {
    setIsValidating(true);
    
    try {
      // Extract transaction code
      const codeMatch = mpesaMessage.match(/([A-Z0-9]{10})/);
      if (!codeMatch) {
        toast.error('Invalid M-PESA message format');
        return;
      }

      const transactionCode = codeMatch[1];

      // Check if code has been used before
      if (mpesaStorage.isCodeUsed(transactionCode)) {
        toast.error('This M-PESA transaction message is invalid');
        return;
      }

      // Validate amount
      const expectedAmount = parseFloat(price.replace(/[^0-9.]/g, ''));
      const amountMatch = mpesaMessage.match(/Ksh([\d,]+\.?\d*)/);
      
      if (!amountMatch) {
        toast.error('Invalid M-PESA message format');
        return;
      }

      const paidAmount = parseFloat(amountMatch[1].replace(/,/g, ''));

      if (paidAmount === expectedAmount) {
        // Store the transaction code
        mpesaStorage.addTransaction(transactionCode);
        
        // Add subscription
        subscriptionStorage.addSubscription(planName);

        toast.success('Payment validated successfully!');
        onSuccess();
        onClose();
      } else {
        toast.error('This M-PESA transaction message is invalid');
      }
    } catch (error) {
      toast.error('Invalid M-PESA message format');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-500" />
            Manual Payment Validation
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center mb-2">
            <p className="text-2xl font-bold">{price}</p>
            <p className="text-sm text-gray-500">{planName}</p>
          </div>

          <div className="space-y-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Till Number:</span>
              <div className="flex items-center gap-2">
                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">{TILL_NUMBER}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={copyTillNumber}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <ol className="list-decimal ml-4 space-y-1">
              <li>Open M-PESA on your phone</li>
              <li>Select "Lipa na M-PESA"</li>
              <li>Choose "Buy Goods and Services"</li>
              <li>Enter the Till Number shown above</li>
              <li>Enter amount: <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">{price.replace(/[^0-9.]/g, '')}</span></li>
              <li>Enter your M-PESA PIN and confirm</li>
              <li>Copy the confirmation message you receive</li>
              <li>Paste the message below and click validate</li>
            </ol>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              M-PESA Message
            </label>
            <Textarea
              placeholder="Paste your M-PESA confirmation message here..."
              value={mpesaMessage}
              onChange={(e) => setMpesaMessage(e.target.value)}
              className="h-24"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={validatePayment}
              disabled={!mpesaMessage.trim() || isValidating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isValidating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Validating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Validate Payment
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}