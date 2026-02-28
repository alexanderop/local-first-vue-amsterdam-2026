import { defineConfig, presetIcons, presetUno, presetWebFonts } from 'unocss'

export default () => defineConfig({
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
