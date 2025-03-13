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
        toast.error('This M-PESA transaction has already been used');
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
        toast.error('Payment amount does not match the package price');
      }
    } catch (error) {
      toast.error('Invalid M-PESA message format');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-white">
            <CreditCard className="w-5 h-5 text-emerald-500" />
            How To Pay With M-PESA
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center mb-2">
            <p className="text-2xl font-bold text-white">{price}</p>
            <p className="text-sm text-blue-400">{planName}</p>
          </div>

          <div className="space-y-2 bg-black/60 p-4 rounded-lg text-sm border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-white">Till Number:</span>
              <div className="flex items-center gap-2">
                <code className="bg-white/10 px-2 py-0.5 rounded text-white">{TILL_NUMBER}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-white hover:text-emerald-500"
                  onClick={copyTillNumber}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <ol className="list-decimal ml-4 space-y-1 text-white/90">
              <li>Open M-PESA on your phone</li>
              <li>Select "Lipa na M-PESA"</li>
              <li>Choose "Buy Goods and Services"</li>
              <li>Enter the Till Number shown above</li>
              <li>Enter amount: <span className="font-mono bg-white/10 px-2 py-0.5 rounded">{price.replace(/[^0-9.]/g, '')}</span></li>
              <li>Enter your M-PESA PIN and confirm</li>
              <li>Copy the confirmation message you receive</li>
              <li>Paste the message below and click validate</li>
            </ol>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">
              M-PESA Message
            </label>
            <Textarea
              placeholder="Paste your M-PESA confirmation message here..."
              value={mpesaMessage}
              onChange={(e) => setMpesaMessage(e.target.value)}
              className="h-24 bg-black/60 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="text-white hover:text-white/80"
            >
              Cancel
            </Button>
            <Button 
              onClick={validatePayment}
              disabled={!mpesaMessage.trim() || isValidating}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
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