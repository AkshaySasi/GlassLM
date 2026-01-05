import { useState } from 'react';
import { Wifi, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { NetworkRequest } from '@/lib/glass/types';
import { cn } from '@/lib/utils';

interface NetworkInspectorProps {
  requests: NetworkRequest[];
}

export function NetworkInspector({ requests }: NetworkInspectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  if (requests.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-6 bottom-24 z-40 w-96">
      <div className="glass-surface rounded-lg overflow-hidden border-primary/30">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Wifi className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm">Network Inspector</span>
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
              {requests.length}
            </span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {isExpanded && (
          <div className="border-t border-border max-h-64 overflow-y-auto scrollbar-hide">
            {requests.map((req) => (
              <div key={req.id} className="border-b border-border last:border-0">
                <button
                  onClick={() =>
                    setSelectedRequest(selectedRequest === req.id ? null : req.id)
                  }
                  className="w-full px-4 py-2 flex items-center justify-between hover:bg-secondary/30 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'text-xs font-mono px-1.5 py-0.5 rounded',
                        req.status && req.status < 400
                          ? 'bg-success/20 text-success'
                          : 'bg-destructive/20 text-destructive'
                      )}
                    >
                      {req.method}
                    </span>
                    <span className="text-sm font-mono truncate max-w-[200px]">
                      {new URL(req.url).pathname}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">
                      {(req.payloadSize / 1024).toFixed(1)}KB
                    </span>
                    <Eye className="w-3 h-3 text-muted-foreground" />
                  </div>
                </button>

                {selectedRequest === req.id && (
                  <div className="px-4 py-3 bg-secondary/20 border-t border-border">
                    <div className="font-mono text-xs space-y-2">
                      <div>
                        <span className="text-muted-foreground">URL: </span>
                        <span className="text-foreground break-all">{req.url}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Time: </span>
                        <span className="text-foreground">
                          {req.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Payload Preview:</span>
                        <pre className="mt-1 p-2 bg-background rounded text-xs overflow-x-auto">
                          {req.payloadPreview}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
