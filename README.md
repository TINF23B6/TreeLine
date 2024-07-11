<div align="center" >
	<a href="https://www.karlsruhe.dhbw.de">
		<picture>
			<source height="125px" media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/TINF23B6/.github/main/profile/assets/icon_dark.svg">
			<img height="125px" src="https://raw.githubusercontent.com/TINF23B6/.github/main/profile/assets/icon_light.svg">
		</picture>
	</a>
	<img height="125px" src="https://gw.alipayobjects.com/zos/kitchen/qJ3l3EPsdW/split.svg">
	<a href="https://github.com/TINF23B6/TreeLine">
	    	<picture>
	    		<source height="125px" media="(prefers-color-scheme: dark)" srcset="/docs/logo_dark.svg">
	    		<img height="125px" src="/docs/logo_light.svg">
	    	</picture>
	</a>
	<h1>Web-Engineering-Projekt<br/>TreeLine</h1>
	<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/line.png" />
</div>

<br/>
<br/>

### 🚀 Was ist das hier?

Diese Repository enthält den Sourcecode für das Web-Engineering Projekt im 2. Semester des Studiengangs Informatik an der DHBW Karlsruhe.  
Das Projekt enthält TreeLine, eine Webanwendung zur Erstellung und Darstellung eines Stammbaums, welche mit XML, XSLT und NodeJS + Express umgesetzt wurde.

-   [Infos zur Projektstruktur](docs/Projektstruktur.md)
-   [Feature-Liste](docs/Feature-Liste.md)

<br/>
<br/>

### 📘 Installation und Entwicklung

#### 📦 Installation mit Docker (empfohlen)

Zum Starten der Anwendung wird [Docker Desktop](https://www.docker.com/products/docker-desktop/) (mit dem vorinstallierten `docker compose` Plugin) benötigt.

##### 💿 Vorgefertigtes Docker Image

Hier wird das über GitHub-Actions automatisch gebuildete Docker Image verwendet.

1. `docker-compose.yaml` Datei erstellen mit Inhalt von [docker-compose.yml](docker-compose.yml)
2. Starten der Anwendung mit Terminal-Befehl `docker-compose up` bzw. `docker-compose up -d`, um die Anwendung im Hintergrund zu starten.
3. Anwendung ist unter `http://localhost:8080` erreichbar, (optional, phpMyAdmin unter `http://localhost:8090`)

<br/>

##### 🛠️ Eigenes Docker Image

Hier wird das Docker Image lokal gebaut und gestartet.

1. Repository klonen `git clone https://github.com/TINF23B6/TreeLine.git` oder als ZIP herunterladen
2. `cd TreeLine` in das Verzeichnis wechseln
3. Mit `docker compose --build` und anschließend `docker compose up` das Docker Image erstellen und die Anwendung starten
4. Anwendung ist unter `http://localhost:8080` erreichbar, (optional, phpMyAdmin unter `http://localhost:8090`)

<br/>

##### ⌨️ Weitere Befehle

| Befehl                   | Beschreibung                                                       |
| ------------------------ | ------------------------------------------------------------------ |
| `docker-compose up`      | Erstellt und startet den Container-Stack (mit `-d` im Hintergrund) |
| `docker-compose down`    | Stoppt die Anwendung und entfernt Container                        |
| `docker-compose stop`    | Stoppt die Anwendung                                               |
| `docker-compose start`   | Startet die Anwendung                                              |
| `docker-compose restart` | Startet die Anwendung neu                                          |

<br/>

---

<br/>

#### 🗜️ Standalone Installation / Entwicklung

Zum Starten der Anwendung müssen [Node.js](https://nodejs.org/en/) (v22.1+) und npm installiert sein. Eine frische MySQL Datenbank wird ebenfalls benötigt.

1. Repository klonen `git clone https://github.com/TINF23B6/TreeLine.git` oder als ZIP herunterladen
2. Mit `cd TreeLine` in das Verzeichnis wechseln
3. `.env` Mit den entsprechenden Verbindungs-Daten für die MySQL Datenbank füllen.
4. `npm install` ausführen um die Abhängigkeiten zu installieren
5. `npm start` bzw. `npm run dev` (Mit autom. Neustart bei Dateiänderungen) ausführen
6. Anwendung ist unter `http://localhost:8080` erreichbar

<br/>
<br/>

---

> [!NOTE]
> Die Standard-Anmeldedaten für die Anwendung sind:  
> **Benutzername:** `treeline`  
> **Passwort:** `treeline`

---

<br/>
<br/>

#### 🖼️ Screenshots

![Screenshot 1](/docs/Screenshot-1.png)
![Screenshot 1](/docs/Screenshot-2.png)
