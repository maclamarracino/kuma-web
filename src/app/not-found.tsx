// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <h1 className="text-3xl font-bold">404 - Página no encontrada</h1>
      <p className="mt-2 text-gray-600">La página que buscás no existe.</p>
      <a href="/" className="mt-4 text-blue-500 underline">
        Volver al inicio
      </a>
    </div>
  )
}
