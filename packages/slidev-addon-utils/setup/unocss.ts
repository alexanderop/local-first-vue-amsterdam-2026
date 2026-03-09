import { defineConfig, presetIcons } from 'unocss'
import { IDEALS } from '../constants/ideals'

export default () => defineConfig({
  safelist: IDEALS.map(i => i.icon),
  presets: [
    presetIcons(),
  ],
})
