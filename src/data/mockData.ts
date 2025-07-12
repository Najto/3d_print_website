import { Category } from '../types/Collection';

export const collectionData: Category[] = [
  {
    id: 'warhammer',
    name: 'Warhammer',
    description: 'Warhammer 40k und Fantasy Miniaturen',
    subcategories: [
      {
        id: 'nurgle',
        name: 'Nurgle',
        description: 'Chaos God des Verfalls',
        items: [
          {
            id: 'great-unclean-one',
            name: 'Great Unclean One',
            path: 'warhammer/nurgle/great-unclean-one',
            previewImage: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400',
            files: [
              { name: 'great_unclean_one_01.stl', type: 'stl', size: '45.2 MB' },
              { name: 'great_unclean_one_02.stl', type: 'stl', size: '38.7 MB' },
              { name: 'base.stl', type: 'stl', size: '5.1 MB' }
            ],
            tags: ['daemon', 'large', 'nurgle']
          },
          {
            id: 'plague-marines',
            name: 'Plague Marines',
            path: 'warhammer/nurgle/plague-marines',
            previewImage: 'https://images.pexels.com/photos/209728/pexels-photo-209728.jpeg?auto=compress&cs=tinysrgb&w=400',
            files: [
              { name: 'plague_marine_01.stl', type: 'stl', size: '12.3 MB' },
              { name: 'plague_marine_02.stl', type: 'stl', size: '11.8 MB' },
              { name: 'weapons_pack.stl', type: 'stl', size: '8.4 MB' }
            ],
            tags: ['troops', 'nurgle', 'chaos']
          },
          {
            id: 'nurglings',
            name: 'Nurglings',
            path: 'warhammer/nurgle/nurglings',
            previewImage: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400',
            files: [
              { name: 'nurgling_swarm.stl', type: 'stl', size: '15.6 MB' },
              { name: 'nurgling_individual.stl', type: 'stl', size: '3.2 MB' }
            ],
            tags: ['daemon', 'small', 'swarm']
          }
        ]
      },
      {
        id: 'space-marines',
        name: 'Space Marines',
        description: 'Adeptus Astartes Krieger',
        items: [
          {
            id: 'tactical-squad',
            name: 'Tactical Squad',
            path: 'warhammer/space-marines/tactical-squad',
            previewImage: 'https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400',
            files: [
              { name: 'tactical_marine_01.stl', type: 'stl', size: '14.2 MB' },
              { name: 'tactical_marine_02.stl', type: 'stl', size: '13.9 MB' },
              { name: 'sergeant.stl', type: 'stl', size: '15.1 MB' }
            ],
            tags: ['troops', 'imperial', 'astartes']
          },
          {
            id: 'dreadnought',
            name: 'Dreadnought',
            path: 'warhammer/space-marines/dreadnought',
            previewImage: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
            files: [
              { name: 'dreadnought_body.stl', type: 'stl', size: '52.3 MB' },
              { name: 'dreadnought_arms.stl', type: 'stl', size: '28.7 MB' },
              { name: 'weapons.stl', type: 'stl', size: '18.4 MB' }
            ],
            tags: ['walker', 'heavy', 'imperial']
          }
        ]
      }
    ]
  },
  {
    id: 'dnd',
    name: 'D&D',
    description: 'Dungeons & Dragons Miniaturen',
    subcategories: [
      {
        id: 'heroes',
        name: 'Heroes',
        description: 'Spielercharaktere und Helden',
        items: [
          {
            id: 'human-fighter',
            name: 'Human Fighter',
            path: 'dnd/heroes/human-fighter',
            previewImage: 'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=400',
            files: [
              { name: 'human_fighter_01.stl', type: 'stl', size: '18.5 MB' },
              { name: 'shield_variants.stl', type: 'stl', size: '6.2 MB' }
            ],
            tags: ['human', 'fighter', 'hero']
          },
          {
            id: 'elf-wizard',
            name: 'Elf Wizard',
            path: 'dnd/heroes/elf-wizard',
            previewImage: 'https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400',
            files: [
              { name: 'elf_wizard.stl', type: 'stl', size: '16.8 MB' },
              { name: 'spell_effects.stl', type: 'stl', size: '9.3 MB' }
            ],
            tags: ['elf', 'wizard', 'spellcaster']
          }
        ]
      },
      {
        id: 'monsters',
        name: 'Monsters',
        description: 'Kreaturen und Monster',
        items: [
          {
            id: 'dragon',
            name: 'Ancient Red Dragon',
            path: 'dnd/monsters/dragon',
            previewImage: 'https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400',
            files: [
              { name: 'dragon_body.stl', type: 'stl', size: '89.4 MB' },
              { name: 'dragon_wings.stl', type: 'stl', size: '34.7 MB' },
              { name: 'dragon_base.stl', type: 'stl', size: '12.1 MB' }
            ],
            tags: ['dragon', 'large', 'boss']
          }
        ]
      }
    ]
  },
  {
    id: 'terrain',
    name: 'Terrain',
    description: 'Gelände und Umgebungen',
    subcategories: [
      {
        id: 'buildings',
        name: 'Buildings',
        description: 'Gebäude und Strukturen',
        items: [
          {
            id: 'tavern',
            name: 'Medieval Tavern',
            path: 'terrain/buildings/tavern',
            previewImage: 'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400',
            files: [
              { name: 'tavern_base.stl', type: 'stl', size: '67.2 MB' },
              { name: 'tavern_roof.stl', type: 'stl', size: '23.8 MB' },
              { name: 'details.stl', type: 'stl', size: '11.4 MB' }
            ],
            tags: ['building', 'medieval', 'tavern']
          }
        ]
      }
    ]
  }
];