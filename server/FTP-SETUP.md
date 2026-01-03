# FTP Server Setup Guide

Diese Anwendung verwendet einen externen FTP-Server für die Dateispeicherung. Die Datenbank bleibt lokal auf dem Bolt-Server.

## Konfiguration

1. Öffnen Sie die Datei `server/.env`
2. Tragen Sie Ihre FTP-Server-Zugangsdaten ein:

```env
FTP_HOST=ihr-ftp-server.com
FTP_PORT=21
FTP_USER=ihr-benutzername
FTP_PASSWORD=ihr-passwort
FTP_SECURE=false
FTP_BASE_PATH=/files
```

### Parameter-Erklärung

- **FTP_HOST**: Die Adresse Ihres FTP-Servers (z.B. `ftp.beispiel.de` oder IP-Adresse)
- **FTP_PORT**: Der FTP-Port (Standard: 21, für FTPS oft 990)
- **FTP_USER**: Ihr FTP-Benutzername
- **FTP_PASSWORD**: Ihr FTP-Passwort
- **FTP_SECURE**: `true` für FTPS (verschlüsselt), `false` für normales FTP
- **FTP_BASE_PATH**: Der Basis-Pfad auf dem FTP-Server wo Dateien gespeichert werden

## Ordnerstruktur auf dem FTP-Server

Die Anwendung erstellt automatisch folgende Ordnerstruktur:

```
/files/
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

- **Upload**: Dateien werden über den Backend-Server direkt zum FTP-Server hochgeladen
- **Download**: Der Backend-Server fungiert als Proxy und lädt Dateien vom FTP-Server
- **Vorschaubilder**: Werden ebenfalls über den Backend-Proxy geladen und im Browser gecacht
- **Datenbank**: Verbleibt lokal auf dem Bolt-Server (JSON-basiert mit LowDB)

## Vorteile

- Unbegrenzter Speicherplatz (abhängig von Ihrem FTP-Server)
- Dateien bleiben auch bei Server-Neustart erhalten
- Zentrale Dateiverwaltung
- Einfache Backups über FTP-Client möglich
- Website-Funktionalität unabhängig vom Dateispeicher

## Testen der Verbindung

Nach dem Konfigurieren können Sie die Verbindung testen:

```bash
curl http://localhost:3001/api/health
```

Die Antwort sollte FTP-Verbindungsinformationen enthalten:

```json
{
  "status": "OK",
  "message": "Server läuft",
  "ftp": {
    "status": "OK",
    "connected": true,
    "host": "ihr-ftp-server.com",
    "basePath": "/files"
  }
}
```

## Fehlerbehebung

### FTP-Verbindung fehlgeschlagen

- Prüfen Sie Host, Port, Benutzername und Passwort
- Überprüfen Sie Firewall-Einstellungen
- Testen Sie die Verbindung mit einem FTP-Client (z.B. FileZilla)
- Bei FTPS: Stellen Sie sicher dass `FTP_SECURE=true` gesetzt ist

### Upload schlägt fehl

- Prüfen Sie Schreibrechte auf dem FTP-Server
- Stellen Sie sicher dass der `FTP_BASE_PATH` existiert
- Überprüfen Sie Speicherplatz auf dem FTP-Server

### Dateien werden nicht angezeigt

- Prüfen Sie ob der Backend-Server läuft (`http://localhost:3001/api/health`)
- Überprüfen Sie die Browser-Konsole auf Fehler
- Testen Sie den Download-Link direkt im Browser

## Migration existierender Dateien

Falls Sie bereits Dateien lokal gespeichert haben, können Sie diese manuell per FTP-Client auf den Server hochladen:

1. Verbinden Sie sich mit einem FTP-Client zum Server
2. Navigieren Sie zum `FTP_BASE_PATH` Verzeichnis
3. Laden Sie den kompletten `files/` Ordner hoch
4. Die Ordnerstruktur muss erhalten bleiben

## Sicherheit

- Verwenden Sie FTPS für verschlüsselte Verbindungen (`FTP_SECURE=true`)
- Verwenden Sie starke Passwörter
- Die `.env` Datei sollte niemals in ein öffentliches Repository committed werden
- Beschränken Sie FTP-Zugriff auf notwendige IP-Adressen (wenn möglich)
