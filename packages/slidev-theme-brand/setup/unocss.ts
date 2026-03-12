import { defineConfig, presetIcons, presetUno } from 'unocss'

export default () => defineConfig({
  theme: {
    colors: {
      brand: '#ff6bed',
    },
    fontFamily: {
      sans: 'Geist, sans-serif',
      mono: 'Geist Mono, monospace',
    },
  },
  presets: [
    presetUno(),
    presetIcons(),
  ],
})
