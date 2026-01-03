interface ImportResult {
  success: boolean;
  imported: number;
  total: number;
  results: {
    factionId: string;
    factionName: string;
    unitCount: number;
  }[];
  errors?: {
    catalog: string;
    error: string;
  }[];
}

interface FactionData {
  id: string;
  name: string;
  catalog_file: string;
  last_synced: string | null;
  unit_count: number;
}

interface UnitData {
  id: string;
  faction_id: string;
  battlescribe_id: string;
  name: string;
  points: number;
  unit_type: string | null;
  raw_data: any;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const aosImportService = {
  async importAllFactions(): Promise<ImportResult> {
    const apiUrl = `${SUPABASE_URL}/functions/v1/import-bsdata?faction=all`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Import failed: ${response.statusText}`);
    }

    return await response.json();
  },

  async importSpecificFaction(factionName: string): Promise<ImportResult> {
    const apiUrl = `${SUPABASE_URL}/functions/v1/import-bsdata?faction=${encodeURIComponent(factionName)}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Import failed: ${response.statusText}`);
    }

    return await response.json();
  },

  async getFactions(): Promise<FactionData[]> {
    const apiUrl = `${SUPABASE_URL}/rest/v1/aos_factions?select=*&order=name.asc`;

    const response = await fetch(apiUrl, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch factions: ${response.statusText}`);
    }

    return await response.json();
  },

  async getUnitsForFaction(factionId: string): Promise<UnitData[]> {
    const apiUrl = `${SUPABASE_URL}/rest/v1/aos_units?faction_id=eq.${factionId}&select=*&order=name.asc`;

    const response = await fetch(apiUrl, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch units: ${response.statusText}`);
    }

    return await response.json();
  },

  async searchUnits(searchTerm: string): Promise<UnitData[]> {
    const apiUrl = `${SUPABASE_URL}/rest/v1/aos_units?name=ilike.*${encodeURIComponent(searchTerm)}*&select=*&order=name.asc&limit=50`;

    const response = await fetch(apiUrl, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to search units: ${response.statusText}`);
    }

    return await response.json();
  },
};
