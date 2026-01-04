import React from 'react';
import { Shield, Users, Zap, Plus, FileText } from 'lucide-react';
import { AoSArmy } from '../types/AoSCollection';
import { BackgroundTexture } from './BackgroundTexture';
import { getFactionTheme } from '../utils/factionThemes';

interface ArmyPageHeaderProps {
  army: AoSArmy;
  onCreateCustomUnit: () => void;
}

export function ArmyPageHeader({ army, onCreateCustomUnit }: ArmyPageHeaderProps) {
  const theme = army.theme || getFactionTheme(army.name);
  const unitCount = army.units.length;
  const totalPoints = army.units.reduce((acc, unit) => acc + (unit.points || 0), 0);
  const stlCount = army.units.filter(unit => unit.stlFiles && unit.stlFiles.length > 0).length;
  const customUnitsCount = army.units.filter(unit => unit.isCustom).length;

  const getAllegianceIcon = (allegiance: string) => {
    switch (allegiance) {
      case 'Order': return <Shield className="w-8 h-8" />;
      case 'Chaos': return <Zap className="w-8 h-8" />;
      case 'Death': return <Users className="w-8 h-8" />;
      case 'Destruction': return <Users className="w-8 h-8" />;
      default: return <Shield className="w-8 h-8" />;
    }
  };

  return (
    <div className="relative mb-8 rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
      <div
        className="relative"
        style={{
          background: `linear-gradient(135deg, ${theme.bannerGradient[0]} 0%, ${theme.bannerGradient[1]} 50%, ${theme.bannerGradient[2]} 100%)`
        }}
      >
        <BackgroundTexture theme={theme} opacity={0.15} />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

        <div className="relative px-8 py-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6 flex-1">
              <div
                className="relative flex-shrink-0 p-6 rounded-2xl shadow-lg backdrop-blur-sm"
                style={{
                  backgroundColor: `${theme.primaryColor}90`,
                  boxShadow: `0 0 30px ${theme.accentColor}40`
                }}
              >
                <div
                  className="absolute inset-0 rounded-2xl animate-pulse"
                  style={{
                    background: `radial-gradient(circle at center, ${theme.accentColor}30 0%, transparent 70%)`,
                    filter: 'blur(10px)'
                  }}
                />
                <div className="relative text-white">
                  {getAllegianceIcon(army.allegiance)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1
                    className="text-4xl font-bold text-white tracking-wide"
                    style={{
                      textShadow: `0 2px 10px ${theme.primaryColor}, 0 0 20px ${theme.accentColor}60`
                    }}
                  >
                    {army.name}
                  </h1>
                </div>

                <div
                  className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold text-white mb-3"
                  style={{ backgroundColor: `${theme.secondaryColor}90` }}
                >
                  {army.allegiance}
                </div>

                <p className="text-gray-200 text-base leading-relaxed max-w-3xl">
                  {army.description}
                </p>

                {army.playstyle && (
                  <div className="mt-3 flex items-center gap-2">
                    <div
                      className="px-3 py-1 rounded-lg text-sm font-medium text-white"
                      style={{ backgroundColor: `${theme.accentColor}40` }}
                    >
                      <span className="mr-1.5">⚔️</span>
                      {army.playstyle}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 flex-shrink-0">
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="px-5 py-3 rounded-lg backdrop-blur-sm border"
                  style={{
                    backgroundColor: `${theme.primaryColor}60`,
                    borderColor: `${theme.accentColor}40`
                  }}
                >
                  <div className="text-2xl font-bold text-white">{unitCount}</div>
                  <div className="text-xs text-gray-300 uppercase tracking-wide">
                    {unitCount === 1 ? 'Einheit' : 'Einheiten'}
                  </div>
                </div>

                <div
                  className="px-5 py-3 rounded-lg backdrop-blur-sm border"
                  style={{
                    backgroundColor: `${theme.primaryColor}60`,
                    borderColor: `${theme.accentColor}40`
                  }}
                >
                  <div className="text-2xl font-bold text-white">~{totalPoints}</div>
                  <div className="text-xs text-gray-300 uppercase tracking-wide">Punkte</div>
                </div>

                {stlCount > 0 && (
                  <div
                    className="px-5 py-3 rounded-lg backdrop-blur-sm border"
                    style={{
                      backgroundColor: `${theme.primaryColor}60`,
                      borderColor: `${theme.accentColor}40`
                    }}
                  >
                    <div className="text-2xl font-bold text-green-400">{stlCount}</div>
                    <div className="text-xs text-gray-300 uppercase tracking-wide">STL Files</div>
                  </div>
                )}

                {customUnitsCount > 0 && (
                  <div
                    className="px-5 py-3 rounded-lg backdrop-blur-sm border"
                    style={{
                      backgroundColor: `${theme.primaryColor}60`,
                      borderColor: `${theme.accentColor}40`
                    }}
                  >
                    <div className="text-2xl font-bold text-orange-400">{customUnitsCount}</div>
                    <div className="text-xs text-gray-300 uppercase tracking-wide">Custom</div>
                  </div>
                )}
              </div>

              <button
                onClick={onCreateCustomUnit}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 shadow-lg"
                style={{
                  backgroundColor: theme.accentColor,
                  boxShadow: `0 4px 15px ${theme.accentColor}40`
                }}
              >
                <Plus className="w-5 h-5" />
                <span>Custom Unit</span>
              </button>
            </div>
          </div>

          {army.lore && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-300 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-2">
                    Hintergrund
                  </h3>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {army.lore}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
