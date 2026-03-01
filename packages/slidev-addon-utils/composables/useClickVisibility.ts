import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

export function useClickVisibility() {
  const { $clicksContext } = useSlideContext()
  const clicks = computed(() => $clicksContext.current)

  function isVisible(click?: number, fallbackClick?: number): boolean {
    const effectiveClick = click ?? fallbackClick
    if (effectiveClick == null) return true
    return clicks.value >= effectiveClick
  }

  return { clicks, isVisible }
}
