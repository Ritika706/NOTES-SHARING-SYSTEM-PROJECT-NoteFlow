import { toast } from 'sonner';

export function toastSuccess(message) {
  return toast.success(message);
}

export function toastError(message) {
  return toast.error(message);
}

export function toastInfo(message) {
  return toast.info(message);
}
