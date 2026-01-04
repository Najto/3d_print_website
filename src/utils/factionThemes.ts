import { AoSArmyTheme } from '../types/AoSCollection';

export const defaultThemes: Record<string, AoSArmyTheme> = {
  'Maggotkin of Nurgle': {
    primaryColor: '#4a5c3e',
    secondaryColor: '#7a8c6e',
    accentColor: '#9db88f',
    textureStyle: 'decay',
    bannerGradient: ['#2d3a28', '#4a5c3e', '#5d7051']
  },
  'Khorne Bloodbound': {
    primaryColor: '#8b0000',
    secondaryColor: '#a52a2a',
    accentColor: '#ff4500',
    textureStyle: 'blood',
    bannerGradient: ['#4a0000', '#8b0000', '#a52a2a']
  },
  'Nighthaunt': {
    primaryColor: '#1a3a3a',
    secondaryColor: '#2d5555',
    accentColor: '#4db8a8',
    textureStyle: 'mist',
    bannerGradient: ['#0f2020', '#1a3a3a', '#2d5555']
  },
  'Sylvaneth': {
    primaryColor: '#2d5016',
    secondaryColor: '#4a7c2c',
    accentColor: '#7fba3d',
    textureStyle: 'nature',
    bannerGradient: ['#1a3010', '#2d5016', '#4a7c2c']
  },
  'Stormcast Eternals': {
    primaryColor: '#1e3a8a',
    secondaryColor: '#3b5998',
    accentColor: '#fbbf24',
    textureStyle: 'metal',
    bannerGradient: ['#0f1d45', '#1e3a8a', '#3b5998']
  },
  'Seraphon': {
    primaryColor: '#0e7490',
    secondaryColor: '#0891b2',
    accentColor: '#fbbf24',
    textureStyle: 'magic',
    bannerGradient: ['#083344', '#0e7490', '#0891b2']
  },
  'Ironjawz': {
    primaryColor: '#3d5a27',
    secondaryColor: '#546e3a',
    accentColor: '#a8a29e',
    textureStyle: 'tribal',
    bannerGradient: ['#2a3d1c', '#3d5a27', '#546e3a']
  },
  'Daughters of Khaine': {
    primaryColor: '#7c2d12',
    secondaryColor: '#991b1b',
    accentColor: '#dc2626',
    textureStyle: 'blood',
    bannerGradient: ['#4a1408', '#7c2d12', '#991b1b']
  },
  'Ossiarch Bonereapers': {
    primaryColor: '#44403c',
    secondaryColor: '#57534e',
    accentColor: '#a8a29e',
    textureStyle: 'ethereal',
    bannerGradient: ['#292524', '#44403c', '#57534e']
  },
  'Lumineth Realm-lords': {
    primaryColor: '#e0e7ff',
    secondaryColor: '#c7d2fe',
    accentColor: '#fbbf24',
    textureStyle: 'magic',
    bannerGradient: ['#a5b4fc', '#c7d2fe', '#e0e7ff']
  },
  'Idoneth Deepkin': {
    primaryColor: '#0c4a6e',
    secondaryColor: '#075985',
    accentColor: '#22d3ee',
    textureStyle: 'mist',
    bannerGradient: ['#082f49', '#0c4a6e', '#075985']
  },
  'Gloomspite Gitz': {
    primaryColor: '#4d2a0f',
    secondaryColor: '#713f12',
    accentColor: '#fbbf24',
    textureStyle: 'tribal',
    bannerGradient: ['#2d1a08', '#4d2a0f', '#713f12']
  },
  'Flesh-eater Courts': {
    primaryColor: '#7c2d12',
    secondaryColor: '#991b1b',
    accentColor: '#dc2626',
    textureStyle: 'decay',
    bannerGradient: ['#4a1408', '#7c2d12', '#991b1b']
  },
  'Soulblight Gravelords': {
    primaryColor: '#450a0a',
    secondaryColor: '#7f1d1d',
    accentColor: '#dc2626',
    textureStyle: 'blood',
    bannerGradient: ['#1a0000', '#450a0a', '#7f1d1d']
  },
  'Blades of Khorne': {
    primaryColor: '#7f1d1d',
    secondaryColor: '#991b1b',
    accentColor: '#ef4444',
    textureStyle: 'blood',
    bannerGradient: ['#450a0a', '#7f1d1d', '#991b1b']
  },
  'Disciples of Tzeentch': {
    primaryColor: '#1e3a8a',
    secondaryColor: '#3b82f6',
    accentColor: '#f59e0b',
    textureStyle: 'magic',
    bannerGradient: ['#0f1d45', '#1e3a8a', '#3b82f6']
  },
  'Hedonites of Slaanesh': {
    primaryColor: '#86198f',
    secondaryColor: '#a21caf',
    accentColor: '#e879f9',
    textureStyle: 'ethereal',
    bannerGradient: ['#4a044e', '#86198f', '#a21caf']
  },
  'Skaven': {
    primaryColor: '#292524',
    secondaryColor: '#44403c',
    accentColor: '#84cc16',
    textureStyle: 'decay',
    bannerGradient: ['#0c0a09', '#292524', '#44403c']
  },
  'Cities of Sigmar': {
    primaryColor: '#1e40af',
    secondaryColor: '#3b5998',
    accentColor: '#fbbf24',
    textureStyle: 'metal',
    bannerGradient: ['#0f1d45', '#1e40af', '#3b5998']
  },
  'Ogor Mawtribes': {
    primaryColor: '#475569',
    secondaryColor: '#64748b',
    accentColor: '#cbd5e1',
    textureStyle: 'tribal',
    bannerGradient: ['#334155', '#475569', '#64748b']
  },
  'Sons of Behemat': {
    primaryColor: '#78716c',
    secondaryColor: '#a8a29e',
    accentColor: '#e7e5e4',
    textureStyle: 'tribal',
    bannerGradient: ['#57534e', '#78716c', '#a8a29e']
  }
};

export const defaultTheme: AoSArmyTheme = {
  primaryColor: '#374151',
  secondaryColor: '#4b5563',
  accentColor: '#9ca3af',
  textureStyle: 'none',
  bannerGradient: ['#1f2937', '#374151', '#4b5563']
};

export function getFactionTheme(factionName: string): AoSArmyTheme {
  return defaultThemes[factionName] || defaultTheme;
}
