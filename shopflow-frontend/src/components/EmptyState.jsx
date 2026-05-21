const EmptyState = ({ 
  title, 
  description, 
  actionLabel, 
  onAction,
  icon 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon Placeholder */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-accent/20">
        {icon || (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted mb-6 max-w-sm">{description}</p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-[1.02]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
