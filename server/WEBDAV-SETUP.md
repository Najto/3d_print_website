# WebDAV Server Setup Guide

Diese Anwendung verwendet einen externen WebDAV-Server für die Dateispeicherung. Die Datenbank bleibt lokal auf dem Bolt-Server.

## Konfiguration

1. Öffnen Sie die Datei `server/.env`
2. Tragen Sie Ihre WebDAV-Server-Zugangsdaten ein:

```env
WEBDAV_URL=https://100.72.242.182:6008
WEBDAV_USER=aoswebdev
WEBDAV_PASSWORD=1B9%2CUp*wk
WEBDAV_BASE_PATH=/disk1_part1/3d
```

### Parameter-Erklärung

- **WEBDAV_URL**: Die vollständige URL Ihres WebDAV-Servers inkl. Protokoll (https://) und Port
- **WEBDAV_USER**: Ihr WebDAV-Benutzername
- **WEBDAV_PASSWORD**: Ihr WebDAV-Passwort
- **WEBDAV_BASE_PATH**: Der Basis-Pfad auf dem WebDAV-Server wo Dateien gespeichert werden

### HTTPS mit selbstsigniertem Zertifikat

Der WebDAV-Service ist für die Verwendung mit selbstsignierten SSL-Zertifikaten konfiguriert (z.B. bei Tailscale VPN-Verbindungen). Die SSL-Zertifikatsverifizierung ist automatisch deaktiviert.

## Ordnerstruktur auf dem WebDAV-Server

Die Anwendung erstellt automatisch folgende Ordnerstruktur:

```
/disk1_part1/3d/
  ├── order/
  │   ├── stormcast-eternals/
  │   │   └── liberators/
  │   │       ├── preview.jpg
  │   │       └── model.stl
  │   └── ...
  ├── chaos/
  ├── death/
  ├── destruction/
  └── others/
```

## Funktionsweise

- **Upload**: Dateien werden über den Backend-Server direkt zum WebDAV-Server hochgeladen
- **Download**: Der Backend-Server fungiert als Proxy und lädt Dateien vom WebDAV-Server
- **Vorschaubilder**: Werden ebenfalls über den Backend-Proxy geladen und im Browser gecacht
- **Datenbank**: Verbleibt lokal auf dem Bolt-Server (JSON-basiert mit LowDB)

## Vorteile

- Unbegrenzter Speicherplatz (abhängig von Ihrem WebDAV-Server)
- Dateien bleiben auch bei Server-Neustart erhalten
- Zentrale Dateiverwaltung
- Einfache Backups über WebDAV-Client möglich
- Website-Funktionalität unabhängig vom Dateispeicher
- HTTPS-Verschlüsselung für sichere Übertragung
- Kompatibel mit Tailscale VPN

## Testen der Verbindung

Nach dem Konfigurieren können Sie die Verbindung testen:

```bash
curl http://localhost:3001/api/health
```

Die Antwort sollte WebDAV-Verbindungsinformationen enthalten:

```json
{
  "status": "OK",
  "message": "Server läuft",
  "webdav": {
    "status": "OK",
    "connected": true,
    "host": "https://100.72.242.182:6008",
    "basePath": "/disk1_part1/3d"
  }
}
```

## Fehlerbehebung

### WebDAV-Verbindung fehlgeschlagen

- Prüfen Sie URL, Benutzername und Passwort
- Überprüfen Sie ob der WebDAV-Server erreichbar ist (bei Tailscale: VPN-Verbindung aktiv?)
- Testen Sie die Verbindung mit einem WebDAV-Client (z.B. Cyberduck, rclone)
- Stellen Sie sicher dass der Port korrekt ist (6008)

### Upload schlägt fehl

- Prüfen Sie Schreibrechte auf dem WebDAV-Server
- Stellen Sie sicher dass der `WEBDAV_BASE_PATH` existiert
- Überprüfen Sie Speicherplatz auf dem WebDAV-Server

### Dateien werden nicht angezeigt

- Prüfen Sie ob der Backend-Server läuft (`http://localhost:3001/api/health`)
- Überprüfen Sie die Browser-Konsole auf Fehler
- Testen Sie den Download-Link direkt im Browser

### SSL-Zertifikat Fehler

Die Anwendung ist bereits für selbstsignierte Zertifikate konfiguriert. Falls Sie dennoch Probleme haben:

- Überprüfen Sie ob HTTPS in der URL verwendet wird
- Stellen Sie sicher dass der Port korrekt ist
- Bei Tailscale: Prüfen Sie ob die VPN-Verbindung aktiv ist

## Migration existierender Dateien

Falls Sie bereits Dateien lokal gespeichert haben, können Sie diese manuell per WebDAV-Client auf den Server hochladen:

1. Verbinden Sie sich mit einem WebDAV-Client zum Server
2. Navigieren Sie zum `WEBDAV_BASE_PATH` Verzeichnis
3. Laden Sie den kompletten `files/` Ordner hoch
4. Die Ordnerstruktur muss erhalten bleiben

## Sicherheit

- Die Verbindung erfolgt über HTTPS (verschlüsselt)
- Verwenden Sie starke Passwörter
- Die `.env` Datei sollte niemals in ein öffentliches Repository committed werden
- Bei Verwendung von Tailscale: Beschränken Sie den Zugriff auf autorisierte Geräte

## Tailscale VPN Integration

Diese Konfiguration ist optimiert für die Verwendung mit Tailscale:

- Die IP-Adresse 100.x.x.x ist eine Tailscale VPN-Adresse
- Die Verbindung ist nur innerhalb Ihres Tailscale-Netzwerks erreichbar
- Stellen Sie sicher dass sowohl Server als auch Client im gleichen Tailscale-Netzwerk sind
- Tailscale bietet zusätzliche Sicherheit durch Ende-zu-Ende-Verschlüsselung
