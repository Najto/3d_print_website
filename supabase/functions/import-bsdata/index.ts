import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { XMLParser } from "npm:fast-xml-parser@4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface FactionData {
  name: string;
  catalogFile: string;
  units: UnitData[];
}

interface UnitData {
  battlescribeId: string;
  name: string;
  points: number;
  unitType?: string;
  rawData: any;
}

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/BSData/age-of-sigmar-4th/main";

// List of all faction catalog files
const FACTION_CATALOGS = [
  "Stormcast Eternals.cat",
  "Blades of Khorne.cat",
  "Daughters of Khaine.cat",
  "Disciples of Tzeentch.cat",
  "Flesh-eater Courts.cat",
  "Fyreslayers.cat",
  "Gloomspite Gitz.cat",
  "Hedonites of Slaanesh.cat",
  "Idoneth Deepkin.cat",
  "Kharadron Overlords.cat",
  "Lumineth Realm-lords.cat",
  "Maggotkin of Nurgle.cat",
  "Nighthaunt.cat",
  "Ogor Mawtribes.cat",
  "Ossiarch Bonereapers.cat",
  "Seraphon.cat",
  "Skaven.cat",
  "Slaves to Darkness.cat",
  "Soulblight Gravelords.cat",
  "Beasts of Chaos.cat",
  "Cities of Sigmar.cat",
  "Ironjawz.cat",
  "Kruleboyz.cat",
  "Bonesplitterz.cat",
];

function parseCatalogXML(xmlText: string, catalogFile: string): FactionData {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });
  
  const parsed = parser.parse(xmlText);
  const catalogue = parsed.catalogue;
  
  if (!catalogue) {
    throw new Error("Invalid catalog format");
  }

  const factionName = catalogue["@_name"] || catalogFile.replace(".cat", "");
  const units: UnitData[] = [];

  // Navigate to entryLinks
  const sharedSelectionEntries = catalogue.sharedSelectionEntries?.selectionEntry || [];
  const selectionEntries = Array.isArray(sharedSelectionEntries) 
    ? sharedSelectionEntries 
    : [sharedSelectionEntries];

  // Also check for entryLinks in the catalogue
  let entryLinks = catalogue.entryLinks?.entryLink || [];
  entryLinks = Array.isArray(entryLinks) ? entryLinks : [entryLinks];

  // Process entryLinks
  for (const entryLink of entryLinks) {
    if (!entryLink || typeof entryLink !== 'object') continue;
    
    const name = entryLink["@_name"];
    const targetId = entryLink["@_targetId"];
    const type = entryLink["@_type"];
    
    if (!name || !targetId || type !== "selectionEntry") continue;
    if (name.includes("[LEGENDS]") || name.includes("Manifestation")) continue;

    // Extract points cost
    let points = 0;
    const costs = entryLink.costs?.cost;
    if (costs) {
      const costArray = Array.isArray(costs) ? costs : [costs];
      const ptsCost = costArray.find((c: any) => c["@_name"] === "pts");
      if (ptsCost && ptsCost["@_value"]) {
        points = parseInt(ptsCost["@_value"]) || 0;
      }
    }

    units.push({
      battlescribeId: targetId,
      name: name,
      points: points,
      rawData: {
        catalogFile,
        imported: new Date().toISOString(),
      },
    });
  }

  // Process shared selection entries
  for (const entry of selectionEntries) {
    if (!entry || typeof entry !== 'object') continue;
    
    const name = entry["@_name"];
    const id = entry["@_id"];
    
    if (!name || !id) continue;
    if (name.includes("[LEGENDS]") || name.includes("Manifestation")) continue;

    // Extract points cost
    let points = 0;
    const costs = entry.costs?.cost;
    if (costs) {
      const costArray = Array.isArray(costs) ? costs : [costs];
      const ptsCost = costArray.find((c: any) => c["@_name"] === "pts");
      if (ptsCost && ptsCost["@_value"]) {
        points = parseInt(ptsCost["@_value"]) || 0;
      }
    }

    units.push({
      battlescribeId: id,
      name: name,
      points: points,
      rawData: {
        catalogFile,
        imported: new Date().toISOString(),
      },
    });
  }

  return {
    name: factionName,
    catalogFile,
    units,
  };
}

async function fetchAndParseCatalog(catalogFile: string): Promise<FactionData> {
  const url = `${GITHUB_RAW_BASE}/${encodeURIComponent(catalogFile)}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${catalogFile}: ${response.statusText}`);
  }

  const xmlText = await response.text();
  return parseCatalogXML(xmlText, catalogFile);
}

async function importFactionData(supabase: any, factionData: FactionData) {
  // Insert or update faction
  const { data: faction, error: factionError } = await supabase
    .from("aos_factions")
    .upsert(
      {
        name: factionData.name,
        catalog_file: factionData.catalogFile,
        last_synced: new Date().toISOString(),
        unit_count: factionData.units.length,
      },
      { onConflict: "catalog_file" }
    )
    .select()
    .single();

  if (factionError) throw factionError;

  // Delete existing units for this faction (to handle removed units)
  await supabase.from("aos_units").delete().eq("faction_id", faction.id);

  // Insert units in batches
  const batchSize = 50;
  for (let i = 0; i < factionData.units.length; i += batchSize) {
    const batch = factionData.units.slice(i, i + batchSize);
    const unitsToInsert = batch.map((unit) => ({
      faction_id: faction.id,
      battlescribe_id: unit.battlescribeId,
      name: unit.name,
      points: unit.points,
      unit_type: unit.unitType,
      raw_data: unit.rawData,
    }));

    const { error: unitsError } = await supabase
      .from("aos_units")
      .upsert(unitsToInsert, { onConflict: "battlescribe_id" });

    if (unitsError) throw unitsError;
  }

  return {
    factionId: faction.id,
    factionName: faction.name,
    unitCount: factionData.units.length,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role for database writes
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const url = new URL(req.url);
    const factionParam = url.searchParams.get("faction");

    let catalogsToImport: string[];

    if (factionParam && factionParam !== "all") {
      // Import specific faction
      catalogsToImport = FACTION_CATALOGS.filter(
        (cat) => cat.toLowerCase().includes(factionParam.toLowerCase())
      );

      if (catalogsToImport.length === 0) {
        return new Response(
          JSON.stringify({ error: "Faction not found", availableFactions: FACTION_CATALOGS }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      // Import all factions
      catalogsToImport = FACTION_CATALOGS;
    }

    const results = [];
    const errors = [];

    for (const catalog of catalogsToImport) {
      try {
        console.log(`Importing ${catalog}...`);
        const factionData = await fetchAndParseCatalog(catalog);
        const result = await importFactionData(supabase, factionData);
        results.push(result);
        console.log(`✓ Imported ${result.factionName}: ${result.unitCount} units`);
      } catch (error) {
        const errorMsg = `Failed to import ${catalog}: ${error.message}`;
        console.error(errorMsg);
        errors.push({ catalog, error: error.message });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        imported: results.length,
        total: catalogsToImport.length,
        results,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});