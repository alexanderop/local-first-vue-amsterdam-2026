import { defineConfig, presetIcons, presetUno, presetWebFonts } from 'unocss'

export default () => defineConfig({
  theme: {
    colors: {
      brand: '#ff6bed',
    },
  },
  presets: [
    presetUno(),
    presetIcons(),
    presetWebFonts({
      fonts: {
        sans: 'Geist',
        mono: 'Geist Mono',
      },
    }),
  ],
})
