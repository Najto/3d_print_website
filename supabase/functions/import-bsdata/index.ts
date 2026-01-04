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
  move?: string;
  health?: number;
  save?: string;
  control?: number;
  baseSize?: string;
  weapons?: any[];
  abilities?: any[];
  keywords?: string[];
  rawData: any;
}

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/BSData/age-of-sigmar-4th/main";

function parseProfileFromEntry(entry: any, details: Partial<UnitData>) {
  if (!entry || typeof entry !== 'object') return;

  const profiles = entry.profiles?.profile || [];
  const profileArray = Array.isArray(profiles) ? profiles : [profiles];

  for (const profile of profileArray) {
    if (!profile || typeof profile !== 'object') continue;

    const profileType = profile["@_typeName"];
    const profileName = profile["@_name"];

    if (profileType === "Unit") {
      const chars = profile.characteristics?.characteristic || [];
      const charArray = Array.isArray(chars) ? chars : [chars];

      for (const char of charArray) {
        const name = char["@_name"];
        const value = char["#text"] || char["@_value"];

        if (name === "Move" && !details.move) details.move = value;
        if (name === "Health" && !details.health) details.health = parseInt(value) || undefined;
        if (name === "Save" && !details.save) details.save = value;
        if (name === "Control" && !details.control) details.control = parseInt(value) || undefined;
      }
    }

    if (profileType === "Melee Weapon") {
      const weapon: any = {
        name: profileName,
        type: "melee",
      };

      const chars = profile.characteristics?.characteristic || [];
      const charArray = Array.isArray(chars) ? chars : [chars];

      for (const char of charArray) {
        const name = char["@_name"];
        const value = char["#text"] || char["@_value"];

        if (name === "Atk") weapon.attacks = value;
        if (name === "Hit") weapon.hit = value;
        if (name === "Wnd") weapon.wound = value;
        if (name === "Rnd") weapon.rend = value;
        if (name === "Dmg") weapon.damage = value;
        if (name === "Ability") weapon.ability = value;
      }

      details.weapons!.push(weapon);
    }

    if (profileType === "Ranged Weapon") {
      const weapon: any = {
        name: profileName,
        type: "ranged",
      };

      const chars = profile.characteristics?.characteristic || [];
      const charArray = Array.isArray(chars) ? chars : [chars];

      for (const char of charArray) {
        const name = char["@_name"];
        const value = char["#text"] || char["@_value"];

        if (name === "Rng") weapon.range = value;
        if (name === "Atk") weapon.attacks = value;
        if (name === "Hit") weapon.hit = value;
        if (name === "Wnd") weapon.wound = value;
        if (name === "Rnd") weapon.rend = value;
        if (name === "Dmg") weapon.damage = value;
        if (name === "Ability") weapon.ability = value;
      }

      details.weapons!.push(weapon);
    }

    if (profileType?.includes("Ability")) {
      const ability: any = {
        name: profileName,
        type: profileType.includes("Passive") ? "passive" : "active",
      };

      const chars = profile.characteristics?.characteristic || [];
      const charArray = Array.isArray(chars) ? chars : [chars];

      for (const char of charArray) {
        const name = char["@_name"];
        const value = char["#text"] || char["@_value"];

        if (name === "Effect") ability.effect = value;
        if (name === "Keywords") ability.keywords = value;
        if (name === "Timing") ability.timing = value;
        if (name === "Declare") ability.declare = value;
      }

      details.abilities!.push(ability);
    }
  }
}

function parseNestedEntries(entry: any, details: Partial<UnitData>, depth = 0) {
  if (!entry || typeof entry !== 'object' || depth > 5) return;

  const rules = entry.rules?.rule || [];
  const ruleArray = Array.isArray(rules) ? rules : [rules];

  for (const rule of ruleArray) {
    if (rule["@_name"] === "Base Size" && !details.baseSize) {
      details.baseSize = rule.description || rule["#text"];
    }
  }

  parseProfileFromEntry(entry, details);

  const selectionEntries = entry.selectionEntries?.selectionEntry || [];
  const selectionArray = Array.isArray(selectionEntries) ? selectionEntries : [selectionEntries];

  for (const subEntry of selectionArray) {
    if (!subEntry) continue;
    parseNestedEntries(subEntry, details, depth + 1);
  }

  const entryLinks = entry.entryLinks?.entryLink || [];
  const entryLinkArray = Array.isArray(entryLinks) ? entryLinks : [entryLinks];

  for (const link of entryLinkArray) {
    if (!link) continue;
    parseNestedEntries(link, details, depth + 1);
  }
}

function parseUnitDetails(entry: any): Partial<UnitData> {
  const details: Partial<UnitData> = {
    weapons: [],
    abilities: [],
    keywords: [],
  };

  parseProfileFromEntry(entry, details);

  const categoryLinks = entry.categoryLinks?.categoryLink || [];
  const categoryArray = Array.isArray(categoryLinks) ? categoryLinks : [categoryLinks];

  for (const link of categoryArray) {
    if (!link || typeof link !== 'object') continue;
    const name = link["@_name"];
    if (name && !name.includes("(") && name !== "CHAOS" && name !== "ORDER" && name !== "DEATH" && name !== "DESTRUCTION") {
      details.keywords!.push(name);
    }
  }

  const rules = entry.rules?.rule || [];
  const ruleArray = Array.isArray(rules) ? rules : [rules];

  for (const rule of ruleArray) {
    if (rule["@_name"] === "Base Size") {
      details.baseSize = rule.description || rule["#text"];
    }
  }

  parseNestedEntries(entry, details, 0);

  // Remove duplicate weapons based on name
  const uniqueWeapons = Array.from(
    new Map(details.weapons!.map(w => [w.name, w])).values()
  );
  details.weapons = uniqueWeapons;

  // Remove duplicate abilities based on name
  const uniqueAbilities = Array.from(
    new Map(details.abilities!.map(a => [a.name, a])).values()
  );
  details.abilities = uniqueAbilities;

  // Remove duplicate keywords
  details.keywords = Array.from(new Set(details.keywords));

  return details;
}

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
  "Sylvaneth.cat",
  "Sons of Behemat.cat",
  "Orruk Warclans.cat",
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

  let factionName = catalogue["@_name"] || catalogFile.replace(".cat", "");
  factionName = factionName.replace(" - Library", "");

  const units: UnitData[] = [];

  const sharedSelectionEntries = catalogue.sharedSelectionEntries?.selectionEntry || [];
  const selectionEntries = Array.isArray(sharedSelectionEntries) 
    ? sharedSelectionEntries 
    : [sharedSelectionEntries];

  let entryLinks = catalogue.entryLinks?.entryLink || [];
  entryLinks = Array.isArray(entryLinks) ? entryLinks : [entryLinks];

  for (const entryLink of entryLinks) {
    if (!entryLink || typeof entryLink !== 'object') continue;

    const name = entryLink["@_name"];
    const targetId = entryLink["@_targetId"];
    const type = entryLink["@_type"];

    if (!name || !targetId || type !== "selectionEntry") continue;
    if (name.includes("[LEGENDS]") || name.includes("Manifestation")) continue;

    let points = 0;
    const costs = entryLink.costs?.cost;
    if (costs) {
      const costArray = Array.isArray(costs) ? costs : [costs];
      const ptsCost = costArray.find((c: any) => c["@_name"] === "pts");
      if (ptsCost && ptsCost["@_value"]) {
        points = parseInt(ptsCost["@_value"]) || 0;
      }
    }

    const referencedEntry = selectionEntries.find((e: any) => e["@_id"] === targetId);
    const details = referencedEntry ? parseUnitDetails(referencedEntry) : {};

    units.push({
      battlescribeId: targetId,
      name: name,
      points: points,
      ...details,
      rawData: {
        catalogFile,
        imported: new Date().toISOString(),
      },
    });
  }

  for (const entry of selectionEntries) {
    if (!entry || typeof entry !== 'object') continue;

    const name = entry["@_name"];
    const id = entry["@_id"];

    if (!name || !id) continue;
    if (name.includes("[LEGENDS]") || name.includes("Manifestation")) continue;

    let points = 0;
    const costs = entry.costs?.cost;
    if (costs) {
      const costArray = Array.isArray(costs) ? costs : [costs];
      const ptsCost = costArray.find((c: any) => c["@_name"] === "pts");
      if (ptsCost && ptsCost["@_value"]) {
        points = parseInt(ptsCost["@_value"]) || 0;
      }
    }

    const details = parseUnitDetails(entry);

    units.push({
      battlescribeId: id,
      name: name,
      points: points,
      ...details,
      rawData: {
        catalogFile,
        imported: new Date().toISOString(),
      },
    });
  }

  const uniqueUnits = Array.from(
    new Map(units.map(unit => [unit.battlescribeId, unit])).values()
  );

  return {
    name: factionName,
    catalogFile,
    units: uniqueUnits,
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
  let faction;
  const { data: existingFaction } = await supabase
    .from("aos_factions")
    .select("*")
    .eq("name", factionData.name)
    .maybeSingle();

  if (existingFaction) {
    const { data: updatedFaction, error: updateError } = await supabase
      .from("aos_factions")
      .update({
        last_synced: new Date().toISOString(),
      })
      .eq("id", existingFaction.id)
      .select()
      .single();

    if (updateError) throw updateError;
    faction = updatedFaction;
  } else {
    const { data: newFaction, error: insertError } = await supabase
      .from("aos_factions")
      .insert({
        name: factionData.name,
        catalog_file: factionData.catalogFile,
        last_synced: new Date().toISOString(),
        unit_count: 0,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    faction = newFaction;
  }

  const batchSize = 50;
  for (let i = 0; i < factionData.units.length; i += batchSize) {
    const batch = factionData.units.slice(i, i + batchSize);
    const unitsToInsert = batch.map((unit) => ({
      faction_id: faction.id,
      battlescribe_id: unit.battlescribeId,
      name: unit.name,
      points: unit.points,
      unit_type: unit.unitType,
      move: unit.move,
      health: unit.health,
      save: unit.save,
      control: unit.control,
      base_size: unit.baseSize,
      weapons: unit.weapons || [],
      abilities: unit.abilities || [],
      keywords: unit.keywords || [],
      raw_data: unit.rawData,
    }));

    const { error: unitsError } = await supabase
      .from("aos_units")
      .upsert(unitsToInsert, { onConflict: "battlescribe_id" });

    if (unitsError) throw unitsError;
  }

  const { count } = await supabase
    .from("aos_units")
    .select("*", { count: "exact", head: true })
    .eq("faction_id", faction.id);

  await supabase
    .from("aos_factions")
    .update({ unit_count: count || 0 })
    .eq("id", faction.id);

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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const url = new URL(req.url);
    const factionParam = url.searchParams.get("faction");

    let catalogsToImport: string[];

    if (factionParam && factionParam !== "all") {
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

    console.log("Assigning grand alliances...");
    const { error: assignError } = await supabase.rpc("assign_grand_alliance");
    if (assignError) {
      console.error("Error assigning grand alliances:", assignError);
      errors.push({ catalog: "assign_grand_alliance", error: assignError.message });
    } else {
      console.log("✓ Grand alliances assigned");
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