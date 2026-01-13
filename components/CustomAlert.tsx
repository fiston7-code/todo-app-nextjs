// components/CustomAlert.tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

type AlertVariant = 'error' | 'success' | 'info' | 'warning';

interface CustomAlertProps {
  variant: AlertVariant;
  title: string;
  message: string;
  onClose?: () => void;
}

export function CustomAlert({ variant, title, message, onClose }: CustomAlertProps) {
  const config = {
    error: {
      icon: AlertCircle,
      className: 'border-red-200 bg-red-50',
      iconClassName: 'text-red-600',
      titleClassName: 'text-red-900',
      descriptionClassName: 'text-red-800',
    },
    success: {
      icon: CheckCircle2,
      className: 'border-green-200 bg-green-50',
      iconClassName: 'text-green-600',
      titleClassName: 'text-green-900',
      descriptionClassName: 'text-green-800',
    },
    info: {
      icon: Info,
      className: 'border-blue-200 bg-blue-50',
      iconClassName: 'text-blue-600',
      titleClassName: 'text-blue-900',
      descriptionClassName: 'text-blue-800',
    },
    warning: {
      icon: AlertTriangle,
      className: 'border-yellow-200 bg-yellow-50',
      iconClassName: 'text-yellow-600',
      titleClassName: 'text-yellow-900',
      descriptionClassName: 'text-yellow-800',
    },
  };

  const { icon: Icon, className, iconClassName, titleClassName, descriptionClassName } = config[variant];

  return (
    <Alert className={`relative ${className}`}>
      <Icon className={`h-4 w-4 ${iconClassName}`} />
      <AlertTitle className={titleClassName}>{title}</AlertTitle>
      <AlertDescription className={descriptionClassName}>
        {message}
      </AlertDescription>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-sm opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      )}
    </Alert>
  );
}

// import { CustomAlert } from '@/components/CustomAlert';

// Dans ton composant
// {alert && (
//   <CustomAlert
//     variant={alert.type}
//     title={alert.title}
//     message={alert.message}
//     onClose={() => setAlert(null)}
//   />
// )}