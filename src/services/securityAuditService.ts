
import { supabase } from '@/integrations/supabase/client';

interface SecurityAuditLog {
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  details: Record<string, any>;
  timestamp: string;
}

export class SecurityAuditService {
  private static instance: SecurityAuditService;

  public static getInstance(): SecurityAuditService {
    if (!SecurityAuditService.instance) {
      SecurityAuditService.instance = new SecurityAuditService();
    }
    return SecurityAuditService.instance;
  }

  async logSecurityEvent(
    eventType: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    details: Record<string, any>
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const auditLog: SecurityAuditLog = {
        event_type: eventType,
        severity,
        user_id: user?.id,
        details,
        timestamp: new Date().toISOString()
      };

      // Log to security_logs table
      const { error } = await supabase
        .from('security_logs')
        .insert({
          action: eventType,
          user_id: user?.id,
          metadata: {
            severity,
            ...details
          }
        });

      if (error) {
        console.error('Failed to log security event:', error);
      }

      // For critical events, also log to console for immediate attention
      if (severity === 'critical') {
        console.warn('CRITICAL SECURITY EVENT:', auditLog);
      }
    } catch (error) {
      console.error('Security audit logging failed:', error);
    }
  }

  async getSecurityLogs(limit: number = 100): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('security_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to fetch security logs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch security logs:', error);
      return [];
    }
  }

  async detectAnomalousActivity(userId: string): Promise<boolean> {
    try {
      // Check for multiple failed login attempts in the last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('security_logs')
        .select('id')
        .eq('user_id', userId)
        .eq('action', 'signin_failed')
        .gte('created_at', oneHourAgo);

      if (error) {
        console.error('Failed to check anomalous activity:', error);
        return false;
      }

      // If more than 5 failed attempts in the last hour, flag as anomalous
      const failedAttempts = data?.length || 0;
      if (failedAttempts > 5) {
        await this.logSecurityEvent('anomalous_activity_detected', 'high', {
          userId,
          failedAttempts,
          timeWindow: '1 hour'
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Anomalous activity detection failed:', error);
      return false;
    }
  }

  async generateSecurityReport(): Promise<any> {
    try {
      const logs = await this.getSecurityLogs(1000);
      
      const report = {
        totalEvents: logs.length,
        criticalEvents: logs.filter(log => log.metadata?.severity === 'critical').length,
        highSeverityEvents: logs.filter(log => log.metadata?.severity === 'high').length,
        failedLogins: logs.filter(log => log.action === 'signin_failed').length,
        fileUploadAttempts: logs.filter(log => log.action === 'file_upload_attempt').length,
        lastUpdated: new Date().toISOString()
      };

      return report;
    } catch (error) {
      console.error('Failed to generate security report:', error);
      return null;
    }
  }
}

export const securityAudit = SecurityAuditService.getInstance();
