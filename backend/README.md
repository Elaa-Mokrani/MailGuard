# MailGuard Backend

Backend FastAPI pour le projet PFE **MailGuard**, connecté à vos modèles **LSTM multi-tâches** entraînés pour :

- classer le type d'email
- détecter la langue
- détecter le sentiment
- estimer l'urgence
- prédire le risque d'impayé
- extraire la référence facture
- extraire le montant mentionné

## 1. Structure

```text
backend/
  app/
    api/routes.py
    core/config.py
    schemas/inference.py
    services/document_parser.py
    services/inference.py
    main.py
  .env.example
  requirements.txt
```

## 2. Préparer les artefacts modèle

Placez vos fichiers exportés dans :

```text
<racine-du-projet>/models_complete_lstm/
```

Fichiers attendus :

- `type_email_model.keras`
- `langue_model.keras`
- `sentiment_model.keras`
- `urgence_model.keras`
- `risque_impaye_model.keras`
- `tokenizer.pkl`
- `numeric_imputer.pkl`
- `numeric_scaler.pkl`
- `type_email_label_encoder.pkl`
- `langue_label_encoder.pkl`
- `sentiment_label_encoder.pkl`
- `urgence_label_encoder.pkl`
- `risque_impaye_label_encoder.pkl`
- `lstm_config.json`

Si vous préférez un autre emplacement, définissez `MODELS_DIR` dans `backend/.env`.

## 3. Installation

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

## 4. Lancer l'API

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Swagger :

- [http://localhost:8000/docs](http://localhost:8000/docs)

## 5. Endpoints principaux

### `GET /api/v1/health`

Retourne l'état de l'application et si les modèles sont chargés.

### `GET /api/v1/model/metadata`

Retourne :

- présence des artefacts
- configuration LSTM
- rapports JSON si disponibles
- erreur de chargement éventuelle si le modèle n'est pas prêt

### `POST /api/v1/model/reload`

Recharge les artefacts sans redémarrer l'API.

### `POST /api/v1/inference/email`

Exemple :

```json
{
  "sujet": "Relance paiement facture INV-2026-778",
  "corps": "Bonjour, la facture INV-2026-778 d'un montant de 1,372.12 EUR reste impayee.",
  "texte_ocr": "Invoice INV-2026-778 Total 1,372.12 EUR",
  "from_domaine": "codix.eu",
  "to_domaine": "client.com",
  "codix_service": "Service Recouvrement",
  "metadata": {
    "email_id": "MAIL-TEST-001",
    "from_nom": "Service Recouvrement",
    "from_email": "recouvrement@codix.eu",
    "to_nom": "Client",
    "dossier": "Inbox"
  },
  "client": {
    "client_id": "CLI-001",
    "client_nom": "Client Demo",
    "client_secteur": "Industrie",
    "client_pays": "France",
    "client_sante": "MOYENNE"
  },
  "features": {
    "technicite": 0.3,
    "urgence": 0.82,
    "emotion": 0.64,
    "client_probabilite_defaut": 0.19,
    "nb_pieces_jointes": 1,
    "client_encours": 125000
  }
}
```

La réponse contient :

- les extractions regex
- les prédictions détaillées avec probabilités
- un objet `resume_front` prêt à consommer côté React

### `POST /api/v1/inference/batch`

Permet l'inférence sur plusieurs emails en une seule requête.

### `POST /api/v1/inference/document`

Accepte un upload `.txt`, `.pdf` ou `.docx`, extrait le texte, puis lance l'inférence.

## 6. Intégration front React

Votre front utilise encore `mockData.ts`. Pour brancher l'API, vous pourrez :

1. remplacer les sources mock par des appels `fetch` vers `http://localhost:8000/api/v1/...`
2. consommer `resume_front` dans `EmailAnalysis.tsx`
3. utiliser `predictions` pour afficher les confiances et les détails métier

## 7. Important

- Le backend charge exactement les mêmes artefacts de préprocessing que votre entraînement : `tokenizer`, `imputer`, `scaler`, `label_encoders`.
- Les valeurs numériques absentes restent compatibles avec votre pipeline grâce au `SimpleImputer` sauvegardé.
- Si les modèles ne sont pas présents, l'API démarre quand même, mais les endpoints d'inférence renverront `503`.
