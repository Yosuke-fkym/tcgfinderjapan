export function StatCard({ label, value, warning, success }: any) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={`text-xl font-semibold ${
          warning ? "text-yellow-600" : success ? "text-green-600" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}