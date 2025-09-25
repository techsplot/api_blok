export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gradient-to-r from-[#4FACFE] to-[#00F2FE] mb-4"></div>
        <h1 className="text-2xl font-medium mb-4">Loading...</h1>
        <p className="text-gray-600">Please wait while we load your content</p>
      </div>
    </div>
  )
}
