export default function LoadingSkeleton() {
  return (
    <div className="p-4 bg-white rounded shadow animate-pulse">
      <div className="h-4 bg-gray-300 rounded mb-4"></div>
      <div className="h-48 bg-gray-200 rounded"></div>
    </div>
  );
}
