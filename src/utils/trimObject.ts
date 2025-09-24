export default function trimObject<Filters extends Record<string, any>>(
  obj: Filters
): Record<string, any> {
  const _obj = Object.fromEntries(
    Object.entries(obj as any).map(([key, value]) =>
      key && (value || value === 0) ? [key, value] : []
    )
  );
  delete _obj["undefined"];
  return _obj;
}
