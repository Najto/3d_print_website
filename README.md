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
│   └── destruction/
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
- **Suchfunktion** - Durchsuche alle Einheiten und Armeen
- **Filter-Optionen** - Zeige nur Einheiten mit STL-Dateien

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

1. **Website öffnen** - http://IHRE_RASPBERRY_PI_IP/
2. **Anmelden** - Mit Ihrem konfigurierten Passwort
3. **Armee wählen** - Z.B. "Stormcast Eternals"
4. **Neue Einheit erstellen** - Klicken Sie auf "Neue Einheit"
5. **Grunddaten eingeben** - Name, Punkte, Stats, Waffen, etc.
6. **Dateien hochladen** - Drag & Drop für Vorschaubild und STL-Dateien
7. **Speichern** - Einheit wird permanent gespeichert
8. **Verwalten** - Bearbeiten, Anzeigen, Herunterladen

## 🔄 Daten-Persistierung

### Was wird gespeichert:
- ✅ **Einheiten-Daten** → `/var/www/aos-collection/data/aos-data.json`
- ✅ **STL-Dateien** → `/var/www/aos-collection/public/files/`
- ✅ **Vorschaubilder** → `/var/www/aos-collection/public/files/`

### Was bleibt bei Updates erhalten:
- ✅ **Alle Ihre Einheiten** - Werden nicht überschrieben
- ✅ **Alle hochgeladenen Dateien** - Bleiben bestehen
- ✅ **Nginx-Konfiguration** - Bleibt unverändert
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

### Nützliche Links:
- **Website**: http://IHRE_RASPBERRY_PI_IP/
- **API Status**: http://IHRE_RASPBERRY_PI_IP/api/health
- **GitHub**: https://github.com/Najto/3d_print_website

---

*Entwickelt für Warhammer Age of Sigmar 4. Edition - Perfekt für 3D-Druck-Enthusiasten! 🎲🖨️*