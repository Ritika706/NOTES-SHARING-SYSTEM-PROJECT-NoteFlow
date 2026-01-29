import toast from 'react-hot-toast';

const baseStyle = {
  borderRadius: '14px',
  background: 'white',
  color: '#0f172a',
  border: '1px solid rgba(15, 23, 42, 0.08)',
  boxShadow: '0 10px 30px rgba(2, 8, 23, 0.10)',
};

export function toastSuccess(message) {
  return toast.success(message, { style: { ...baseStyle, borderLeft: '6px solid hsl(145 65% 42%)' } });
}

export function toastError(message) {
  return toast.error(message, { style: { ...baseStyle, borderLeft: '6px solid hsl(0 72% 51%)' } });
}

export function toastInfo(message) {
  return toast(message, { icon: 'i', style: { ...baseStyle, borderLeft: '6px solid hsl(175 60% 35%)' } });
}
