
import React, { useState } from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface DiscountCodeProps {
  onDiscountApplied: (discount: { code: string; amount: number; type: 'percentage' | 'fixed' }) => void;
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ onDiscountApplied }) => {
  const [discountCode, setDiscountCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();

  // Mock discount codes for demo
  const validCodes = {
    'SAVE10': { amount: 10, type: 'percentage' as const },
    'STUDENT': { amount: 15, type: 'percentage' as const },
    'WELCOME5': { amount: 5, type: 'fixed' as const },
    'CREATOR20': { amount: 20, type: 'percentage' as const }
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    setIsApplying(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const code = discountCode.toUpperCase();
    if (validCodes[code as keyof typeof validCodes]) {
      const discount = validCodes[code as keyof typeof validCodes];
      onDiscountApplied({ code, ...discount });
      toast({
        title: "Discount Applied!",
        description: `${code} discount has been applied to your order.`,
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "The discount code you entered is not valid.",
        variant: "destructive",
      });
    }
    
    setIsApplying(false);
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-semibold text-ry-black mb-3">Discount Code</h3>
      <div className="flex gap-2">
        <Input
          placeholder="Enter discount code"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          className="flex-1"
        />
        <RYButton
          onClick={handleApplyDiscount}
          disabled={isApplying || !discountCode.trim()}
          variant="secondary"
        >
          {isApplying ? 'Applying...' : 'Apply'}
        </RYButton>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Try: SAVE10, STUDENT, WELCOME5, or CREATOR20
      </div>
    </div>
  );
};

export default DiscountCode;
