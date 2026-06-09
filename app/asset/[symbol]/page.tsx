export default async function AssetDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;

  return (
    <div>
      <h1 className="text-3xl font-semibold">{symbol.toUpperCase()}</h1>
      <p className="mt-2 text-slate-400">Asset details, related pairs, and chart will appear here.</p>
    </div>
  );
}
