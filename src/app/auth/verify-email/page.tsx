export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="text-5xl mb-4">📧</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Check je e-mail</h1>
        <p className="text-gray-500">
          We hebben een bevestigingslink gestuurd. Klik op de link om je account te activeren.
        </p>
      </div>
    </div>
  )
}
