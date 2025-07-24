import type { Route } from "../+types/health";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Health Check" },
    { name: "description", content: "Health check endpoint" },
  ];
}

export default function HealthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Healthy</h1>
        <p className="text-gray-600">
          SautiDesk Frontend is running successfully
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Timestamp: {new Date().toISOString()}
        </p>
      </div>
    </div>
  );
}
