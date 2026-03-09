import { defineConfig, presetIcons } from 'unocss'
import { IDEALS } from '../constants/ideals'
import { getAllIconClasses } from '../utils/parseFileTree'

export default () => defineConfig({
  safelist: [
    ...getAllIconClasses(),
    ...IDEALS.map(i => i.icon),
  ],
  presets: [
    presetIcons(),
  ],
})
