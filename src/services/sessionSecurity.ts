
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from './securityService';

interface SessionConfig {
  maxIdleTime: number; // 30 minutes
  maxSessionTime: number; // 8 hours
  renewThreshold: number; // 5 minutes before expiry
}

class SessionSecurityService {
  private config: SessionConfig = {
    maxIdleTime: 30 * 60 * 1000, // 30 minutes
    maxSessionTime: 8 * 60 * 60 * 1000, // 8 hours
    renewThreshold: 5 * 60 * 1000 // 5 minutes
  };

  private lastActivity: number = Date.now();
  private sessionStart: number = Date.now();
  private activityTimer: NodeJS.Timeout | null = null;
  private renewalTimer: NodeJS.Timeout | null = null;

  public startSessionMonitoring(): void {
    this.updateActivity();
    this.startActivityMonitoring();
    this.startSessionRenewalCheck();
  }

  public updateActivity(): void {
    this.lastActivity = Date.now();
    
    // Reset activity timer
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
    }
    
    this.activityTimer = setTimeout(() => {
      this.handleSessionTimeout();
    }, this.config.maxIdleTime);
  }

  private startActivityMonitoring(): void {
    // Monitor user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        this.updateActivity();
      }, { passive: true });
    });
  }

  private startSessionRenewalCheck(): void {
    this.renewalTimer = setInterval(async () => {
      await this.checkSessionRenewal();
    }, 60000); // Check every minute
  }

  private async checkSessionRenewal(): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return;

    const now = Date.now();
    const sessionAge = now - this.sessionStart;
    const timeSinceActivity = now - this.lastActivity;

    // Force logout if session is too old
    if (sessionAge > this.config.maxSessionTime) {
      await this.forceLogout('SESSION_EXPIRED_MAX_TIME');
      return;
    }

    // Force logout if idle too long
    if (timeSinceActivity > this.config.maxIdleTime) {
      await this.forceLogout('SESSION_EXPIRED_IDLE');
      return;
    }

    // Renew session if close to expiry
    const expiresAt = new Date(session.expires_at! * 1000).getTime();
    const timeToExpiry = expiresAt - now;

    if (timeToExpiry < this.config.renewThreshold) {
      await this.renewSession();
    }
  }

  private async renewSession(): Promise<void> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error || !data.session) {
        await this.forceLogout('SESSION_RENEWAL_FAILED');
        return;
      }

      await logSecurityEvent({
        action: 'SESSION_RENEWED',
        resource_type: 'session',
        metadata: { renewalTime: new Date().toISOString() }
      });
    } catch (error) {
      console.error('Session renewal error:', error);
      await this.forceLogout('SESSION_RENEWAL_ERROR');
    }
  }

  private async handleSessionTimeout(): Promise<void> {
    await this.forceLogout('SESSION_TIMEOUT_ACTIVITY');
  }

  private async forceLogout(reason: string): Promise<void> {
    await logSecurityEvent({
      action: 'FORCED_LOGOUT',
      resource_type: 'session',
      metadata: { reason }
    });

    // Clean up timers
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
    }
    if (this.renewalTimer) {
      clearInterval(this.renewalTimer);
    }

    // Sign out and redirect
    await supabase.auth.signOut();
    window.location.href = '/auth?reason=' + encodeURIComponent(reason);
  }

  public stopSessionMonitoring(): void {
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
    }
    if (this.renewalTimer) {
      clearInterval(this.renewalTimer);
    }
  }

  public resetSession(): void {
    this.sessionStart = Date.now();
    this.lastActivity = Date.now();
  }
}

export const sessionSecurity = new SessionSecurityService();
