import path from 'node:path';

export default function getAgentsMdPath() {
  return path.resolve(import.meta.dirname, '..', 'AGENTS.md')
}
