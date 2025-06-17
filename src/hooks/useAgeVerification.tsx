
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface AgeVerificationData {
  dateOfBirth: string;
  isMinor: boolean;
  requiresParentConsent: boolean;
  sessionToken?: string;
}

export const useAgeVerification = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const verifyAge = async (dateOfBirth: string) => {
    setLoading(true);
    
    try {
      const age = calculateAge(dateOfBirth);
      const isMinor = age < 18;
      const requiresParentConsent = age < 13;

      // Store age verification data
      const { data, error } = await supabase
        .from('age_verification')
        .insert({
          date_of_birth: dateOfBirth,
          is_minor: isMinor,
          requires_parent_consent: requiresParentConsent,
        })
        .select()
        .single();

      if (error) {
        console.error('Age verification error:', error);
        toast({
          title: "Verification Error",
          description: "Unable to verify age. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      return {
        dateOfBirth,
        isMinor,
        requiresParentConsent,
        sessionToken: data.session_token,
        age,
      };
    } catch (error) {
      console.error('Age verification failed:', error);
      toast({
        title: "Verification Failed",
        description: "Please check your date of birth and try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const submitParentEmail = async (sessionToken: string, parentEmail: string) => {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('age_verification')
        .update({ parent_email: parentEmail })
        .eq('session_token', sessionToken);

      if (error) {
        console.error('Parent email submission error:', error);
        toast({
          title: "Submission Error",
          description: "Unable to submit parent email. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Email Submitted",
        description: "We've sent verification instructions to the parent email.",
      });
      
      return true;
    } catch (error) {
      console.error('Parent email submission failed:', error);
      toast({
        title: "Submission Failed",
        description: "Please check the email address and try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    verifyAge,
    submitParentEmail,
    loading,
  };
};
