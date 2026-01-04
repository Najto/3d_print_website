#!/bin/bash

FACTIONS=(
  "Stormcast Eternals"
  "Blades of Khorne"
  "Daughters of Khaine"
  "Disciples of Tzeentch"
  "Flesh-eater Courts"
  "Fyreslayers"
  "Gloomspite Gitz"
  "Hedonites of Slaanesh"
  "Idoneth Deepkin"
  "Kharadron Overlords"
  "Lumineth Realm-lords"
  "Maggotkin of Nurgle"
  "Nighthaunt"
  "Ogor Mawtribes"
  "Ossiarch Bonereapers"
  "Seraphon"
  "Skaven"
  "Slaves to Darkness"
  "Soulblight Gravelords"
  "Beasts of Chaos"
  "Cities of Sigmar"
  "Ironjawz"
  "Bonesplitterz"
  "Sylvaneth"
  "Sons of Behemat"
  "Orruk Warclans"
)

SUPABASE_URL="https://yscmtmvlbdsiasexbxqu.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzY210bXZsYmRzaWFzZXhieHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNzQ2MjAsImV4cCI6MjA4Mjk1MDYyMH0.-RgX26Kw2O8g4SgX7a4nzG0j9A74wSwQ0PpeTF819Qk"

echo "Starting faction import..."
echo "=========================="

SUCCESSFUL=0
FAILED=0

for faction in "${FACTIONS[@]}"; do
  echo ""
  echo "Importing: $faction"

  ENCODED_FACTION=$(echo -n "$faction" | jq -sRr @uri)

  RESPONSE=$(curl -s -X GET "${SUPABASE_URL}/functions/v1/import-bsdata?faction=${ENCODED_FACTION}" \
    -H "Authorization: Bearer ${SUPABASE_KEY}" \
    -H "Content-Type: application/json")

  if echo "$RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    UNIT_COUNT=$(echo "$RESPONSE" | jq -r '.results[0].unitCount')
    echo "✓ Success: $faction ($UNIT_COUNT units)"
    ((SUCCESSFUL++))
  else
    echo "✗ Failed: $faction"
    echo "  Error: $RESPONSE"
    ((FAILED++))
  fi

  sleep 2
done

echo ""
echo "=========================="
echo "Import complete!"
echo "Successful: $SUCCESSFUL"
echo "Failed: $FAILED"
echo "=========================="
