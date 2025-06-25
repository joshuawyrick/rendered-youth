
// Temporary security service without database logging until types are updated
export interface SecurityLogEntry {
  action: string;
  resource_type?: string;
  resource_id?: string;
  metadata?: Record<string, any>;
}

export const logSecurityEvent = async (entry: SecurityLogEntry): Promise<void> => {
  try {
    // Log to console for now until security_logs table types are available
    console.log('Security Event:', {
      action: entry.action,
      resource_type: entry.resource_type,
      resource_id: entry.resource_id,
      metadata: entry.metadata,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent
    });
    
    // TODO: Implement database logging once security_logs table types are regenerated
  } catch (error) {
    console.error('Security logging error:', error);
  }
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeMB: number = 25): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const sanitizeInput = (input: string): string => {
  // Basic HTML sanitization - remove potential XSS vectors
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateAge = (dateOfBirth: string): { isValid: boolean; age: number } => {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate()) 
    ? age - 1 
    : age;

  return {
    isValid: !isNaN(actualAge) && actualAge >= 0 && actualAge <= 120,
    age: actualAge
  };
};
