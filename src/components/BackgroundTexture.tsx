import React from 'react';
import { AoSArmyTheme } from '../types/AoSCollection';

interface BackgroundTextureProps {
  theme: AoSArmyTheme;
  opacity?: number;
}

export function BackgroundTexture({ theme, opacity = 0.1 }: BackgroundTextureProps) {
  const getTexturePattern = () => {
    switch (theme.textureStyle) {
      case 'decay':
        return (
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="decay-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="30" r="8" fill="currentColor" opacity="0.15" />
                <circle cx="70" cy="60" r="12" fill="currentColor" opacity="0.1" />
                <circle cx="40" cy="80" r="6" fill="currentColor" opacity="0.2" />
                <path d="M10,10 Q20,25 30,20 T50,25" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.15" />
                <ellipse cx="80" cy="20" rx="15" ry="8" fill="currentColor" opacity="0.12" />
              </pattern>
              <filter id="decay-blur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
              </filter>
            </defs>
            <rect width="100%" height="100%" fill={`url(#decay-pattern)`} style={{ color: theme.primaryColor }} filter="url(#decay-blur)" />
          </svg>
        );

      case 'blood':
        return (
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="blood-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <path d="M30,20 Q35,10 40,20 Q45,30 40,40 Q35,50 30,40 Q25,30 30,20" fill="currentColor" opacity="0.2" />
                <path d="M80,60 Q85,50 90,60 Q95,70 90,80 Q85,90 80,80 Q75,70 80,60" fill="currentColor" opacity="0.15" />
                <circle cx="50" cy="90" r="5" fill="currentColor" opacity="0.25" />
                <path d="M10,70 L15,75 L10,80 L5,75 Z" fill="currentColor" opacity="0.18" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#blood-pattern)`} style={{ color: theme.accentColor }} />
          </svg>
        );

      case 'mist':
        return (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                background: `radial-gradient(ellipse at 20% 30%, ${theme.secondaryColor}40 0%, transparent 50%),
                           radial-gradient(ellipse at 80% 70%, ${theme.primaryColor}30 0%, transparent 50%),
                           radial-gradient(ellipse at 50% 50%, ${theme.accentColor}20 0%, transparent 60%)`,
                filter: 'blur(40px)',
                animation: 'float 20s ease-in-out infinite'
              }}
            />
          </div>
        );

      case 'nature':
        return (
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="nature-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M20,40 Q25,30 30,40 L25,50 Z" fill="currentColor" opacity="0.15" />
                <path d="M60,20 Q65,10 70,20 L65,30 Z" fill="currentColor" opacity="0.12" />
                <circle cx="40" cy="60" r="3" fill="currentColor" opacity="0.2" />
                <path d="M10,60 Q15,55 20,60 T30,60" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.18" />
                <path d="M50,70 L55,65 L60,70 L55,75 Z" fill="currentColor" opacity="0.14" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#nature-pattern)`} style={{ color: theme.accentColor }} />
          </svg>
        );

      case 'metal':
        return (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, transparent 25%, ${theme.primaryColor}20 25%, ${theme.primaryColor}20 50%, transparent 50%, transparent 75%, ${theme.primaryColor}20 75%)`,
                backgroundSize: '40px 40px'
              }}
            />
          </div>
        );

      case 'magic':
        return (
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="magic-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M50,10 L55,30 L75,35 L60,50 L65,70 L50,60 L35,70 L40,50 L25,35 L45,30 Z" fill="currentColor" opacity="0.15" />
                <circle cx="20" cy="80" r="4" fill="currentColor" opacity="0.2" />
                <circle cx="80" cy="20" r="3" fill="currentColor" opacity="0.18" />
              </pattern>
              <filter id="magic-glow">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
              </filter>
            </defs>
            <rect width="100%" height="100%" fill={`url(#magic-pattern)`} style={{ color: theme.accentColor }} filter="url(#magic-glow)" />
          </svg>
        );

      case 'tribal':
        return (
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="tribal-pattern" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse">
                <path d="M20,20 L30,20 L30,30 L20,30 Z" fill="currentColor" opacity="0.15" />
                <path d="M60,40 L70,40 L65,50 Z" fill="currentColor" opacity="0.18" />
                <circle cx="40" cy="70" r="5" fill="currentColor" opacity="0.12" />
                <path d="M70,70 L75,60 L80,70 L75,80 Z" fill="currentColor" opacity="0.16" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#tribal-pattern)`} style={{ color: theme.primaryColor }} />
          </svg>
        );

      case 'ethereal':
        return (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 30% 40%, ${theme.accentColor}15 0%, transparent 40%),
                           radial-gradient(circle at 70% 60%, ${theme.secondaryColor}20 0%, transparent 45%),
                           radial-gradient(circle at 50% 80%, ${theme.primaryColor}10 0%, transparent 35%)`,
                filter: 'blur(30px)',
                animation: 'ethereal-float 15s ease-in-out infinite alternate'
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ opacity }}
    >
      {getTexturePattern()}
    </div>
  );
}
