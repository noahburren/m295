
Leistungsbeurteilung: Element B

Autor: Noah Burren

Datum: 20:12.2023


Projekt-Dokumentation

Inhaltsverzeichnis:

Setup
Endpunkte
1. POST /login
2. GET /verify
3. DELETE /logout
4. GET /tasks/:id
5. GET /tasks
6. POST /tasks
7. PUT /tasks/:id
8. DELETE /tasks
Fehlerbehandlung

Der Server wird unter http://localhost:3000 gestartet.

3. Endpunkte <a name="endpunkte"></a>
1. POST /login <a name="post-login"></a>
Beschreibung: Authentifiziert den Benutzer und gibt ein Token zurück.
Anfrage:
json

{
  "email": "noah.burren@bluewin.ch",
  "password": "1234"
}
Antwort:
json

{
  "token": "your-jwt-token"
}
2. GET /verify <a name="get-verify"></a>
Beschreibung: Überprüft die Gültigkeit eines Tokens.
Antwort:
json

{
  "message": "Token is valid",
  "user": {
    "email": "noah.burren@bluewin.ch"
  }
}
3. DELETE /logout <a name="delete-logout"></a>
Beschreibung: Invalidiert das mitgegebene Token.
Antwort: Statuscode: 204 (No Content)
4. GET /tasks/:id <a name="get-tasksid"></a>
Beschreibung: Gibt eine bestimmte Aufgabe basierend auf der ID zurück.
Antwort:
json

{
  "id": 1,
  "title": "cleaning",
  "where": "kitchen"
}
5. GET /tasks <a name="get-tasks"></a>
Beschreibung: Gibt alle Aufgaben zurück.
Antwort:
json

[
  { "id": 1, "title": "cleaning", "where": "kitchen" },
  { "id": 2, "title": "recycling", "what": "glass" },
  // ... continuing tasks
]
6. POST /tasks <a name="post-tasks"></a>
Beschreibung: Erstellt eine neue Aufgabe.
Anfrage:
json

{
  "title": "new task",
  // ... other task properties
}
Antwort:
json

{
  "id": 3,
  "title": "new task"
  // ... other task properties
}
7. PUT /tasks/:id <a name="put-tasksid"></a>
Beschreibung: Aktualisiert eine existierende Aufgabe basierend auf der ID.
Anfrage:
json

{
  "title": "updated task",
  // ... other updated task properties
}
Antwort:
json

{
  "id": 3,
  "title": "updated task"
  // ... other updated task properties
}
8. DELETE /tasks <a name="delete-tasks"></a>
Beschreibung: Löscht die letzte Aufgabe.
Antwort:
json

{
  "id": 3,
  "title": "deleted task"
  // ... other deleted task properties
}
4. Fehlerbehandlung <a name="fehlerbehandlung"></a>
Nicht existierende Endpunkte werden mit dem HTTP-Statuscode 404 beantwortet.
Tasks mit leerem Titel werden von keinem Endpunkt akzeptiert und mit dem HTTP-Statuscode 406 beantwortet.