import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'warning'
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="glass-card rounded-2xl p-6 max-w-md w-full border border-border/30 animate-scale-in shadow-2xl">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${variant === 'danger' ? 'bg-red-500/20' :
                            variant === 'warning' ? 'bg-yellow-500/20' :
                                'bg-blue-500/20'
                        }`}>
                        <AlertTriangle className={`w-6 h-6 ${variant === 'danger' ? 'text-red-500' :
                                variant === 'warning' ? 'text-yellow-500' :
                                    'text-blue-500'
                            }`} />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="text-sm text-muted-foreground mb-6">
                        {message}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end">
                        <Button
                            variant="ghost"
                            onClick={onCancel}
                            className="font-mono text-xs"
                        >
                            {cancelLabel}
                        </Button>
                        <Button
                            variant={variant === 'danger' ? 'destructive' : 'default'}
                            onClick={() => {
                                onConfirm();
                                onCancel();
                            }}
                            className="font-mono text-xs"
                        >
                            {confirmLabel}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
