# Age of Sigmar Collection - Raspberry Pi Setup

Eine lokale Webanwendung zur Verwaltung Ihrer Warhammer Age of Sigmar Sammlung mit automatischer Datei-Speicherung.

## 🚀 Installation auf Raspberry Pi

### 1. Voraussetzungen
```bash
# Node.js installieren (falls nicht vorhanden)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Git installieren
sudo apt-get install git
```

### 2. Projekt klonen und einrichten
```bash
# Projekt klonen
git clone <your-repo-url>
cd aos-collection

# Frontend Dependencies installieren
npm install

# Backend Dependencies installieren
npm run setup-server
```

### 3. Server starten

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

### 4. Zugriff
- **Lokal**: http://localhost:5173
- **Im Netzwerk**: http://[raspberry-pi-ip]:5173

## 📁 Datei-Struktur

Die Dateien werden automatisch in folgender Struktur gespeichert:

```
public/files/
├── order/
│   ├── stormcast-eternals/
│   │   ├── liberators/
│   │   │   ├── preview.jpg
│   │   │   ├── liberator_01.stl
│   │   │   └── liberator_02.stl
│   │   └── lord-celestant/
│   └── cities-of-sigmar/
├── chaos/
│   ├── maggotkin-of-nurgle/
│   │   ├── nurglings/
│   │   │   ├── preview.jpg
│   │   │   └── nurglings.stl
│   │   └── great-unclean-one/
│   └── slaves-to-darkness/
├── death/
└── destruction/
```

## 🎯 Features

### ✅ Automatische Datei-Verwaltung
- **Upload über Web-Interface** - Keine manuelle Ordner-Erstellung nötig
- **Automatische Ordner-Struktur** - Basierend auf Allegiance → Fraktion → Einheit
- **Echte Datei-Speicherung** - Dateien werden physisch auf dem Raspberry Pi gespeichert

### 📱 Benutzerfreundlich
- **Drag & Drop Upload** - Einfaches Hochladen von Bildern und STL-Dateien
- **Live-Feedback** - Sofortige Bestätigung bei erfolgreichem Upload
- **Download-Funktionalität** - Einzelne Dateien oder alle auf einmal

### 🔧 Technische Details
- **Node.js Backend** mit Express und Multer
- **React Frontend** mit TypeScript
- **Lokale Speicherung** - Alle Daten bleiben auf Ihrem Raspberry Pi
- **Netzwerk-Zugriff** - Von allen Geräten im lokalen Netzwerk erreichbar

## 🛠️ Entwicklung

### Backend-Endpunkte:
- `POST /api/upload` - Datei-Upload
- `GET /api/files/:allegiance/:faction/:unit` - Dateien abrufen
- `DELETE /api/files/:allegiance/:faction/:unit/:filename` - Datei löschen
- `GET /api/health` - Server-Status

### Logs anzeigen:
```bash
# Backend-Logs
cd server && npm run dev

# Frontend-Logs
npm run dev
```

## 🔒 Sicherheit

- **Nur lokales Netzwerk** - Server ist nur im lokalen Netzwerk erreichbar
- **Datei-Validierung** - Nur erlaubte Dateitypen (Bilder, STL)
- **Größenbegrenzung** - Maximum 100MB pro Datei

## 📋 Troubleshooting

### Server startet nicht:
```bash
# Port prüfen
sudo netstat -tulpn | grep :3001

# Logs prüfen
cd server && npm run dev
```

### Frontend kann Backend nicht erreichen:
- Prüfen Sie, ob beide Server laufen
- Backend: http://localhost:3001/api/health
- Frontend: http://localhost:5173

### Dateien werden nicht angezeigt:
- Prüfen Sie die Ordner-Berechtigungen
- Stellen Sie sicher, dass der `public/files/` Ordner existiert

## 🎮 Verwendung

1. **Neue Einheit erstellen** - Klicken Sie auf "Neue Einheit"
2. **Grunddaten eingeben** - Name, Punkte, Stats, etc.
3. **Dateien hochladen** - Drag & Drop für Vorschaubild und STL-Dateien
4. **Automatische Speicherung** - Ordner werden automatisch erstellt
5. **Download** - Dateien sind sofort verfügbar

Ihre Sammlung ist jetzt vollständig digital und lokal gespeichert! 🎉