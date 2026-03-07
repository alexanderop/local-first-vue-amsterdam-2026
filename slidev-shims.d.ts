import 'vue'

declare module 'vue' {
  interface ComponentCustomProperties {
    $slidev: {
      nav: {
        currentPage: number
        total: number
        [key: string]: any
      }
      [key: string]: any
    }
  }
}
