const MonitoringSkeleton = () => {
  return (
    <div className="animate-pulse rounded-2xl border bg-gray-100 p-4 shadow-md">
      <div className="mb-4 h-5 w-1/2 rounded bg-gray-300" />
      <div className="mb-2 h-3 w-full rounded bg-gray-300" />
      <div className="mb-2 h-3 w-3/4 rounded bg-gray-300" />
      <div className="h-3 w-1/2 rounded bg-gray-300" />
    </div>
  );
};

export default MonitoringSkeleton;
