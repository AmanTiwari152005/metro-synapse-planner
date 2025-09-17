import React from 'react';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  trainId?: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
}

const alertConfig = {
  warning: { 
    icon: AlertTriangle, 
    variant: 'warning' as const, 
    bgClass: 'bg-warning/10 border-warning/20',
    textClass: 'text-warning-foreground'
  },
  error: { 
    icon: AlertTriangle, 
    variant: 'maintenance' as const, 
    bgClass: 'bg-destructive/10 border-destructive/20',
    textClass: 'text-destructive-foreground'
  },
  info: { 
    icon: Info, 
    variant: 'default' as const, 
    bgClass: 'bg-primary/10 border-primary/20',
    textClass: 'text-primary-foreground'
  }
};

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  if (alerts.length === 0) {
    return (
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-success" />
            <span>System Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3 p-4 bg-success/10 border border-success/20 rounded-lg">
            <CheckCircle className="h-6 w-6 text-success" />
            <div>
              <p className="font-medium text-success-foreground">All Systems Operational</p>
              <p className="text-sm text-muted-foreground">No alerts or warnings to report.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <span>System Alerts</span>
          <Badge variant="warning" className="ml-auto">
            {alerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert, index) => {
            const config = alertConfig[alert.type];
            const Icon = config.icon;
            
            return (
              <div 
                key={alert.id}
                className={`flex items-start space-x-3 p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${config.bgClass}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${config.textClass}`} />
                <div className="space-y-1">
                  <p className={`font-medium text-sm ${config.textClass}`}>
                    {alert.message}
                  </p>
                  {alert.trainId && (
                    <Badge variant="outline" className="text-xs">
                      Train: {alert.trainId}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}