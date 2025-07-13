# Age of Sigmar Collection - Raspberry Pi Setup

Eine vollständige lokale Webanwendung zur Verwaltung Ihrer Warhammer Age of Sigmar Sammlung mit automatischer Datei-Speicherung und Daten-Persistierung.

## 🚀 Installation auf Raspberry Pi

### 1. Voraussetzungen
```bash
# Node.js installieren (falls nicht vorhanden)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Git installieren
sudo apt-get install git

# PM2 und Nginx installieren
sudo apt-get install nginx
sudo npm install -g pm2
```

### 2. Projekt klonen und einrichten
```bash
# Projekt klonen
git clone https://github.com/Najto/3d_print_website
cd 3d_print_website

# Frontend Dependencies installieren
npm install

# Backend Dependencies installieren
cd server && npm install && cd ..
```

### 3. Produktions-Deployment (Empfohlen)

#### Automatisches Deployment:
```bash
# Komplettes Setup mit einem Befehl
sudo ./scripts/deploy.sh
```

#### Manuelles Setup:
```bash
# Frontend bauen
npm run build

# Nginx-Verzeichnis erstellen
sudo mkdir -p /var/www/aos-collection
sudo cp -r dist/* /var/www/aos-collection/
sudo cp -r public/* /var/www/aos-collection/public/
sudo cp -r server /var/www/aos-collection/

# Backend Dependencies installieren
cd /var/www/aos-collection/server
sudo npm install

# Berechtigungen setzen
sudo chown -R www-data:www-data /var/www/aos-collection
sudo chmod -R 777 /var/www/aos-collection/public/files
sudo mkdir -p /var/www/aos-collection/data
sudo chmod -R 777 /var/www/aos-collection/data

# Nginx konfigurieren
sudo cp nginx/aos-collection.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/aos-collection /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

# Backend mit PM2 starten
cd /var/www/aos-collection/server
sudo pm2 start ecosystem.config.js
sudo pm2 save
sudo pm2 startup
```

### 4. Entwicklungs-Setup (Optional)

#### Terminal 1 - Backend Server:
```bash
npm run server
```
Der Backend-Server läuft auf Port 3001

#### Terminal 2 - Frontend:
```bash
npm run dev
```
Das Frontend läuft auf Port 5173

### 5. Zugriff
- **Produktions-Website**: http://[raspberry-pi-ip]/
- **Entwicklung**: http://localhost:5173
- **API Health Check**: http://[raspberry-pi-ip]/api/health

## 🔐 Passwort-Schutz einrichten

```bash
# Basic Authentication konfigurieren
sudo ./scripts/setup-auth.sh

# Nginx neu laden
sudo systemctl reload nginx
```

## 📁 Datei-Struktur

Die Dateien werden automatisch in folgender Struktur gespeichert:

```
/var/www/aos-collection/
├── public/files/
│   ├── order/
│   │   ├── stormcast-eternals/
│   │   │   ├── liberators/
│   │   │   │   ├── preview.jpg
│   │   │   │   ├── liberator_01.stl
│   │   │   │   └── liberator_02.stl
│   │   │   └── lord-celestant/
│   │   └── cities-of-sigmar/
│   ├── chaos/
│   │   ├── maggotkin-of-nurgle/
│   │   │   ├── nurglings/
│   │   │   │   ├── preview.jpg
│   │   │   │   └── nurglings.stl
│   │   │   └── great-unclean-one/
│   │   └── slaves-to-darkness/
│   ├── death/
│   ├── destruction/
│   └── others/
│       ├── endless-spells/
│       │   ├── purple-sun/
│       │   │   ├── preview.jpg
│       │   │   └── purple_sun.stl
│       │   └── malevolent-maelstrom/
│       └── buildings/
│           ├── fortress-of-redemption/
│           └── arcane-ruins/
├── data/
│   └── aos-data.json          # Einheiten-Daten (persistent)
├── dist/                      # Frontend (React Build)
└── server/                    # Backend (Node.js API)
```

## 🎯 Features

### ✅ Vollständige Daten-Persistierung
- **Server-seitige Speicherung** - Alle Daten werden in JSON-Datei gespeichert
- **Multi-User Support** - Alle Benutzer sehen die gleichen Daten
- **Automatische Backups** - Regelmäßige Sicherung der Sammlung

### ✅ Automatische Datei-Verwaltung
- **Upload über Web-Interface** - Drag & Drop für Bilder und STL-Dateien
- **Automatische Ordner-Struktur** - Basierend auf Allegiance → Fraktion → Einheit
- **Echte Datei-Speicherung** - Dateien werden physisch auf dem Raspberry Pi gespeichert
- **Download-Funktionalität** - Einzelne Dateien oder alle auf einmal

### 📱 Benutzerfreundlich
- **Responsive Design** - Funktioniert auf Desktop, Tablet und Handy
- **Live-Feedback** - Sofortige Bestätigung bei erfolgreichem Upload
- **Suchfunktion** - Durchsuche alle Einheiten und Armeen mit mehreren Stichwörtern
- **Filter-Optionen** - Zeige nur Einheiten mit STL-Dateien
- **Sticky Navigation** - Breadcrumb-Menü bleibt beim Scrollen sichtbar
- **Auto-Scroll** - Automatisches Scrollen nach oben bei Navigation

### 🏛️ Vollständige AoS 4. Edition Struktur
- **4 Hauptfraktionen**: Order, Chaos, Death, Destruction
- **20+ Armeen**: Alle aktuellen AoS-Armeen der 4. Edition
- **Others Kategorie**: Endless Spells und Buildings
- **Detaillierte Einheiten**: Stats, Waffen, Fähigkeiten, Schlüsselwörter

### 🛡️ Sichere Einheiten-Verwaltung
- **CRUD-Operationen** - Erstellen, Anzeigen, Bearbeiten, Löschen
- **Sicherheitsabfrage** - 5-Sekunden-Verzögerung beim Löschen
- **Datei-Schutz** - STL-Dateien bleiben beim Löschen erhalten
- **Detailansicht** - Vollständige Einheiten-Informationen

### 🔧 Technische Details
- **Node.js Backend** mit Express und Multer
- **React Frontend** mit TypeScript und Tailwind CSS
- **Nginx Reverse Proxy** für Produktions-Deployment
- **PM2 Process Manager** für Backend-Stabilität
- **Lokale Speicherung** - Alle Daten bleiben auf Ihrem Raspberry Pi
- **Netzwerk-Zugriff** - Von allen Geräten im lokalen Netzwerk erreichbar

## 🛠️ Verwaltung

### Updates durchführen:
```bash
# Automatisches Update
sudo /var/www/aos-collection/update.sh

# Manuelles Update
cd /home/pi/3d_print_website
git pull origin main
npm run build
sudo cp -r dist/* /var/www/aos-collection/
sudo cp -r server/* /var/www/aos-collection/server/
cd /var/www/aos-collection/server && sudo npm install
sudo pm2 restart aos-backend
```

### Backup erstellen:
```bash
# Automatisches Backup
sudo /var/www/aos-collection/backup.sh

# Manuelles Backup
sudo cp -r /var/www/aos-collection/data/ ~/backup-data-$(date +%Y%m%d)/
sudo cp -r /var/www/aos-collection/public/files/ ~/backup-files-$(date +%Y%m%d)/
```

### System-Status prüfen:
```bash
# Services prüfen
sudo systemctl status nginx
sudo pm2 status

# Logs anzeigen
sudo pm2 logs aos-backend
sudo tail -f /var/log/nginx/access.log

# API testen
curl http://localhost/api/health
curl http://localhost/api/data
```

### Backend-Endpunkte:
- `POST /api/upload` - Datei-Upload (Bilder & STL)
- `GET /api/files/:allegiance/:faction/:unit` - Dateien abrufen
- `DELETE /api/files/:allegiance/:faction/:unit/:filename` - Datei löschen
- `GET /api/data` - Einheiten-Daten abrufen
- `POST /api/data` - Einheiten-Daten speichern
- `DELETE /api/data` - Alle Daten zurücksetzen
- `GET /api/health` - Server-Status

## 🔒 Sicherheit

- **Passwort-Schutz** - Basic Authentication für Website-Zugriff
- **Nur lokales Netzwerk** - Server ist nur im lokalen Netzwerk erreichbar
- **Datei-Validierung** - Nur erlaubte Dateitypen (Bilder, STL)
- **Größenbegrenzung** - Maximum 100MB pro Datei
- **Sichere Ordner-Namen** - Automatische Bereinigung von Sonderzeichen
- **Lösch-Schutz** - 5-Sekunden-Verzögerung mit Sicherheitsabfrage

## 📋 Troubleshooting

### Server startet nicht:
```bash
# Port prüfen
sudo netstat -tulpn | grep :3001

# Prozesse beenden
sudo pkill -f node
sudo pm2 delete all && sudo pm2 kill

# Neu starten
cd /var/www/aos-collection/server
sudo pm2 start ecosystem.config.js
```

### Frontend kann Backend nicht erreichen:
```bash
# Services prüfen
sudo systemctl status nginx
sudo pm2 status

# API testen
curl http://localhost:3001/api/health  # Direkt
curl http://localhost/api/health       # Über Nginx
```

### Dateien werden nicht angezeigt:
```bash
# Berechtigungen prüfen
ls -la /var/www/aos-collection/public/files/
ls -la /var/www/aos-collection/data/

# Berechtigungen reparieren
sudo chown -R www-data:www-data /var/www/aos-collection
sudo chmod -R 755 /var/www/aos-collection
sudo chmod -R 777 /var/www/aos-collection/public/files
sudo chmod -R 777 /var/www/aos-collection/data
```

### Daten gehen verloren:
```bash
# Backup-Status prüfen
ls -la ~/backups/aos-collection/

# Daten wiederherstellen
sudo cp ~/backup-data-YYYYMMDD/aos-data.json /var/www/aos-collection/data/
sudo cp -r ~/backup-files-YYYYMMDD/* /var/www/aos-collection/public/files/
```

## 🎮 Verwendung

### 1. **Website öffnen** 
- Navigieren Sie zu http://IHRE_RASPBERRY_PI_IP/
- Melden Sie sich mit Ihrem konfigurierten Passwort an

### 2. **Hauptfraktionen durchsuchen**
- **Order** - Stormcast Eternals, Cities of Sigmar, Sylvaneth, etc.
- **Chaos** - Maggotkin of Nurgle, Slaves to Darkness, Skaven, etc.
- **Death** - Nighthaunt, Ossiarch Bonereapers, etc.
- **Destruction** - Orruk Warclans, Gloomspite Gitz, etc.

### 3. **Others Kategorie nutzen**
- **Endless Spells** - Magische Manifestationen und Zaubersprüche
- **Buildings** - Gelände, Festungen und Strukturen

### 4. **Einheiten verwalten**
- **Armee wählen** → Automatisches Scrollen nach oben
- **"Neue Einheit"** → Vollständiger Editor mit allen AoS-Feldern
- **Einheit anklicken** → Detailansicht mit allen Informationen
- **"Bearbeiten"** → Alle Daten und Dateien ändern
- **"Löschen"** → Sicherheitsabfrage mit 5-Sekunden-Verzögerung

### 5. **Dateien hochladen**
- **Drag & Drop** für Vorschaubilder und STL-Dateien
- **Automatische Ordner-Struktur** basierend auf Fraktion/Einheit
- **Live-Upload-Status** mit Erfolgs-/Fehlermeldungen
- **Datei-Verwaltung** in der Detailansicht

### 6. **Suchen und Filtern**
- **Multi-Keyword-Suche** - "nurgle hero chaos" findet alle passenden Einheiten
- **Filter nach STL-Verfügbarkeit** - Nur Einheiten mit 3D-Dateien anzeigen
- **Durchsucht alle Bereiche** - Armeen, Endless Spells, Buildings

### 7. **Navigation**
- **Sticky Breadcrumb** - Bleibt beim Scrollen sichtbar
- **Auto-Scroll** - Springt bei Navigation automatisch nach oben
- **Zurück-Navigation** - Jederzeit zur Hauptseite

## 🔄 Daten-Persistierung

### Was wird gespeichert:
- ✅ **Einheiten-Daten** → `/var/www/aos-collection/data/aos-data.json`
- ✅ **STL-Dateien** → `/var/www/aos-collection/public/files/`
- ✅ **Vorschaubilder** → `/var/www/aos-collection/public/files/`
- ✅ **Endless Spells** → Vollständig integriert
- ✅ **Buildings** → Vollständig integriert

### Was bleibt bei Updates erhalten:
- ✅ **Alle Ihre Einheiten** - Werden nicht überschrieben
- ✅ **Alle hochgeladenen Dateien** - Bleiben bestehen
- ✅ **Nginx-Konfiguration** - Bleibt unverändert
- ✅ **Others-Kategorie** - Endless Spells & Buildings
- 🔄 **Frontend-Code** - Wird aktualisiert
- 🔄 **Backend-Code** - Wird aktualisiert

## 📊 System-Anforderungen

- **Raspberry Pi 3B+** oder neuer
- **1GB RAM** (2GB+ empfohlen)
- **8GB SD-Karte** (16GB+ empfohlen für große STL-Sammlungen)
- **Node.js 16+**
- **Nginx**
- **PM2**

## 🎉 Fertig!

Ihre Age of Sigmar Sammlung ist jetzt vollständig digital und lokal gespeichert! 

**Alle Einheiten, STL-Dateien und Bilder werden permanent auf Ihrem Raspberry Pi gespeichert und sind von allen Geräten in Ihrem Netzwerk zugänglich.** 🏆⚔️

### Vollständige AoS 4. Edition Features:
- 🏛️ **Alle 4 Hauptfraktionen** mit 20+ Armeen
- ✨ **Others Kategorie** für Endless Spells & Buildings
- 🛡️ **Sichere Einheiten-Verwaltung** mit Lösch-Schutz
- 📱 **Moderne Benutzeroberfläche** mit Sticky Navigation
- 🔍 **Erweiterte Suche** mit Multi-Keyword-Support
- 📁 **Automatische Datei-Organisation** nach Fraktionen
- 🎯 **Vollständige AoS-Datenstruktur** (Stats, Waffen, Fähigkeiten)

### Nützliche Links:
- **Website**: http://IHRE_RASPBERRY_PI_IP/
- **API Status**: http://IHRE_RASPBERRY_PI_IP/api/health
- **GitHub**: https://github.com/Najto/3d_print_website

---

*Entwickelt für Warhammer Age of Sigmar 4. Edition - Perfekt für 3D-Druck-Enthusiasten! 🎲🖨️*