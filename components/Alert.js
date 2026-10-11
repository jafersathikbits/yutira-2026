const styles = {
  success: 'bg-green-500/10 border-green-400/30 text-green-100',
  error: 'bg-red-500/10 border-red-400/30 text-red-100',
  warning: 'bg-yellow-500/10 border-yellow-300/30 text-yellow-100',
  info: 'bg-white/5 border-white/15 text-white/85'
};

const icons = { success: '✓', error: '!', warning: '!', info: 'i' };

export default function Alert({ type = 'info', children, className = '' }) {
  if (!children) return null;
  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`flex gap-3 p-3 rounded-xl border text-sm leading-6 ${styles[type] || styles.info} ${className}`}
    >
      <span
        aria-hidden="true"
        className="mt-0.5 grid place-items-center h-5 w-5 shrink-0 rounded-full border border-current text-[11px] font-bold"
      >
        {icons[type] || icons.info}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
