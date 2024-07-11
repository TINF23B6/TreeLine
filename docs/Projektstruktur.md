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
	<h1>TreeLine <br/> Projektstruktur</h1>
	<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/line.png" />
</div>

### 🚀 Was ist das hier?

Hier wird die generelle Strukur des Projekts beschrieben und die Verwendung der einzelnen Ordner und Dateien erläutert.

| Ordner/Datei                      | Beschreibung                                                                                                                 |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `.github/`                        | Enthält die GitHub Actions Konfigurationen für den automatischen Docker-Build.                                               |
| `.husky/`                         | Enthält die Konfigurationen für Husky, um vor dem Commit Linting und Formatierung auszuführen.                               |
| `.vscode/`                        | Enthält die Einstellungen für Visual Studio Code.                                                                            |
| `docker/`                         | Enthält die Anweisungen (Dockerfile) für den Docker-Build.                                                                   |
| `docs/`                           | Enthält die Dokumentation des Projekts und Medien für die Markdown-Dateien.                                                  |
| `public/`                         | Enthält alle Dateien, welche vom Browser direkt verarbeitet werden (HTML, CSS, JS, XSL-Stylesheet).                          |
| `routes/`                         | Enthält die Routen für die Express-API-Endpunkte, welche vom Client verwendet werden, um mit der Datenbank zu kommunizieren. |
| `sql/`                            | Enthält die SQL-Dateien (Queries) für die Erstellung der Datenbank und die Beispieldaten.                                    |
| `index.js`                        | Der Einstiegspunkt der Anwendung, hier wird der Express-Server gestartet.                                                    |
| `package.json, package-lock.json` | Enthält die Metadaten des Projekts und die Abhängigkeiten.                                                                   |
