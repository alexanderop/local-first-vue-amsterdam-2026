/// <reference types="vite/client" />

declare module '@slidev/client' {
  import type { Ref } from 'vue'

  interface ClicksContext {
    current: number
    [key: string]: any
  }

  interface SlideContext {
    $clicksContext: ClicksContext
    [key: string]: any
  }

  interface NavState {
    clicks: Ref<number>
    currentPage: number
    total: number
    [key: string]: any
  }

  export function useSlideContext(): SlideContext
  export function useNav(): NavState
}

declare module '@slidev/client/logic/dark.ts' {
  import type { Ref } from 'vue'
  export const isDark: Ref<boolean>
}

declare module 'unocss' {
  export function defineConfig(config: any): any
  export function presetIcons(options?: any): any
  export function presetUno(options?: any): any
  export function presetWebFonts(options?: any): any
}
