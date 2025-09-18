import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const statusConfig = {
  inducted: { variant: 'inducted', icon: '✅', label: 'Inducted' },
  hold: { variant: 'hold', icon: '🟡', label: 'Hold' },
  maintenance: { variant: 'maintenance', icon: '❌', label: 'Maintenance' }
};

export function ResultsTable({ results }) {
  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>🚆</span>
          <span>Train Induction Results</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Train ID</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold">Reason</TableHead>
                <TableHead className="text-right font-bold">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => {
                const config = statusConfig[result.status];
                return (
                  <TableRow 
                    key={result.trainId} 
                    className="hover:bg-accent/50 transition-colors duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <TableCell className="font-mono font-semibold">
                      {result.trainId}
                    </TableCell>
                    <TableCell>
                      <Badge variant={config.variant} className="font-medium">
                        <span className="mr-1">{config.icon}</span>
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {result.reason}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-lg">{result.score}</span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}