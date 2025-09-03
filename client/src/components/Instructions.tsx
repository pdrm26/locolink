export function Instructions() {
  return (
    <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">How to use:</h3>
      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
            1
          </div>
          <p>
            Click <strong>Join Network</strong> to get your unique ID
          </p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
            2
          </div>
          <p>Share your ID with a friend and get their ID</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
            3
          </div>
          <p>
            Enter their ID and click <strong>Connect</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
