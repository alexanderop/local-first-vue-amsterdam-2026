import rough from 'roughjs'
import type { RoughGenerator } from 'roughjs/bin/generator'

export interface PathInfo {
  d: string
  stroke?: string
  strokeWidth?: number
  fill?: string
}

export function hashId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) {
    h = ((h << 5) - h + id.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

export function useRough() {
  const gen: RoughGenerator = rough.generator()

  function toPaths(drawable: ReturnType<RoughGenerator['rectangle']>): PathInfo[] {
    return gen.toPaths(drawable) as PathInfo[]
  }

  return { gen, hashId, toPaths }
}
