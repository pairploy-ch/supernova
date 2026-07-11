export function stripMarkdown(body: string): string {
  return body.replace(/[#*_`>~[\]()]/g, '').slice(0, 140);
}
