import { useState, useEffect } from 'react';
import { FlaskConical, Eye, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { autoMask } from '@/lib/glass/masker';
import { analyzePrivacyRisk } from '@/lib/glass/leakageDetector';
import { MaskedItem } from '@/lib/glass/types';

interface PrivacyTestPanelProps {
  inputText: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyTestPanel({
  inputText,
  isOpen,
  onClose,
}: PrivacyTestPanelProps) {
  const [testResult, setTestResult] = useState<{
    maskedText: string;
    maskedItems: MaskedItem[];
    riskLevel: 'low' | 'medium' | 'high';
    concerns: string[];
  } | null>(null);

  const runTest = () => {
    const { maskedText, maskedItems } = autoMask(inputText);
    const { riskLevel, concerns } = analyzePrivacyRisk(maskedText, maskedItems);
    setTestResult({ maskedText, maskedItems, riskLevel, concerns });
  };

  // Run test when dialog opens
  useEffect(() => {
    if (isOpen && inputText.trim()) {
      runTest();
    } else if (!isOpen) {
      setTestResult(null);
    }
  }, [isOpen, inputText]);

  const riskConfig = {
    low: {
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
      label: 'Low Risk',
    },
    medium: {
      icon: AlertTriangle,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      label: 'Medium Risk',
    },
    high: {
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      label: 'High Risk',
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-primary" />
            Privacy Test Results
          </DialogTitle>
        </DialogHeader>

        {!inputText.trim() ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Enter some text to test privacy masking</p>
          </div>
        ) : testResult ? (
          <div className="space-y-6">
            {/* Risk Level */}
            <div className="flex items-center gap-3">
              <div
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg
                  ${riskConfig[testResult.riskLevel].bgColor}
                `}
              >
                {(() => {
                  const Icon = riskConfig[testResult.riskLevel].icon;
                  return <Icon className={`w-5 h-5 ${riskConfig[testResult.riskLevel].color}`} />;
                })()}
                <span className={`font-medium ${riskConfig[testResult.riskLevel].color}`}>
                  {riskConfig[testResult.riskLevel].label}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {testResult.maskedItems.length} sensitive item(s) detected
              </span>
            </div>

            {/* Concerns */}
            {testResult.concerns.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Privacy Concerns</h4>
                <ul className="space-y-1">
                  {testResult.concerns.map((concern, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <AlertTriangle className="w-3 h-3 mt-1 text-warning shrink-0" />
                      {concern}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What would be sent */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-medium">What AI would receive</h4>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap break-words max-h-40 overflow-auto">
                {testResult.maskedText}
              </div>
            </div>

            {/* Masked Items */}
            {testResult.maskedItems.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Detected Sensitive Data</h4>
                <div className="grid gap-2">
                  {testResult.maskedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-muted/30 rounded-lg px-3 py-2"
                    >
                      <span className="text-xs font-mono text-muted-foreground uppercase">
                        {item.type}
                      </span>
                      <span className="text-sm text-muted-foreground">→</span>
                      <span className="text-sm font-mono text-primary">
                        {item.placeholder}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <Button onClick={runTest}>Run Privacy Test</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
