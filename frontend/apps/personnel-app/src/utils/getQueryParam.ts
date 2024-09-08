export function getQueryParam(url: string, param: string): string | null {
  const urlObj = new URL(url); 
  const params = new URLSearchParams(urlObj.search); 
  return params.get(param); 
}
