export type IdealKey = 'fast' | 'multi-device' | 'offline' | 'collaboration' | 'longevity' | 'privacy' | 'user-control'

export interface Ideal {
  key: IdealKey
  label: string
  icon: string
  description: string
}

export const IDEALS: Ideal[] = [
  { key: 'fast', label: 'Fast', icon: 'i-ph-lightning', description: 'No spinners. Instant response.' },
  { key: 'multi-device', label: 'Multi-device', icon: 'i-ph-devices', description: 'Your work on any device.' },
  { key: 'offline', label: 'Works offline', icon: 'i-ph-wifi-slash', description: 'The network is optional.' },
  { key: 'collaboration', label: 'Collaboration', icon: 'i-ph-users-three', description: 'Seamless real-time teamwork.' },
  { key: 'longevity', label: 'Longevity', icon: 'i-ph-clock-countdown', description: 'Your data outlives the app.' },
  { key: 'privacy', label: 'Privacy', icon: 'i-ph-shield-check', description: 'Security and privacy by default.' },
  { key: 'user-control', label: 'User control', icon: 'i-ph-key', description: 'You retain ownership and control.' },
]
