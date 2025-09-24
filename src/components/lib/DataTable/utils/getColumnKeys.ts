export default function getColumnKeys(object?: Record<string, any>, type?: string) {
  return Object.keys(object || {}).map((key) => ({ key }));
}
