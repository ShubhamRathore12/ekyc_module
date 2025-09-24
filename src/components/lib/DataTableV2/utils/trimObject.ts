export default function trimObject(obj: Record<string, any>): Record<string, any> {
  const _obj = Object.fromEntries(
    Object.entries(obj).map(([key, value]) => (key && (value || value === 0) ? [key, value] : []))
  );
  delete _obj["undefined"];
  return _obj;
}
