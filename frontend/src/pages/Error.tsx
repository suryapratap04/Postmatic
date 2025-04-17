export default function Error() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-center mt-10">404 Not Found</h1>
      <p className="text-center mt-5">
        The page you are looking for does not exist.
      </p>
      <p className="text-center mt-5">
        <a href="/" className="text-blue-500 hover:underline">
          Go back to Home
        </a>
      </p>
    </div>
  );
}
