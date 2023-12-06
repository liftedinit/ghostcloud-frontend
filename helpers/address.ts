export function truncateAddress(address: string, n: number): string {
  return `${address.slice(0, n)}...${address.slice(-n)}`
}
