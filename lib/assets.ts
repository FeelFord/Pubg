/** Public files need an explicit prefix when hosted as a GitHub project page. */
export function asset(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${path}`;
}
