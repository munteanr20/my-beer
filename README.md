# My Beer Dashboard 🍺

O aplicație web pentru înregistrarea și gestionarea berilor consumate, construită cu Next.js și Firebase.

## Funcționalități

- **Autentificare securizată**: Doar utilizatorii cu email @best-eu.org pot accesa aplicația
- **Dashboard personalizat**: Fiecare utilizator își vede propriile beri
- **Adăugare beri**: Formular complet pentru înregistrarea berilor cu:
  - Numele berii
  - Tipul (Lager, Pilsner, Ale, Stout, etc.)
  - Rating cu stele (1-5)
  - Note personale
- **Lista de beri**: Afișare organizată a tuturor berilor consumate
- **Contor total**: Numărul total de beri consumate

## Tehnologii folosite

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase
  - Authentication (Email/Password)
  - Firestore Database
  - Analytics (opțional)
- **Deployment**: Vercel-ready

## Structura proiectului

```
my-beer/
├── app/
│   ├── components/     # Componente React
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Configurații Firebase
│   ├── styles/        # Stiluri suplimentare
│   ├── layout.tsx     # Layout principal
│   └── page.tsx       # Pagina principală
├── public/            # Fișiere statice
└── firebase.json      # Configurație Firebase
```

## Instalare și rulare

1. **Clonează proiectul**:
   ```bash
   git clone <repository-url>
   cd my-beer
   ```

2. **Instalează dependențele**:
   ```bash
   npm install
   ```

3. **Configurează Firebase**:
   - Creează un proiect Firebase
   - Activează Authentication (Email/Password)
   - Activează Firestore Database
   - Actualizează `app/lib/firebase.ts` cu datele tale

4. **Rulează aplicația**:
   ```bash
   npm run dev
   ```

5. **Deschide browser-ul**:
   ```
   http://localhost:3000
   ```

## Configurare Firebase

### 1. Authentication
- Activează Email/Password în Firebase Console
- Setează reguli de securitate pentru @best-eu.org

### 2. Firestore Database
- Creează o colecție `beers`
- Setează reguli de securitate:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /beers/{beerId} {
        allow read, write: if request.auth != null && request.auth.token.email.matches('.*@best-eu.org');
      }
    }
  }
  ```

## Utilizare

1. **Înregistrare**: Creează un cont cu email @best-eu.org
2. **Autentificare**: Conectează-te cu email și parolă
3. **Adaugă beri**: Completează formularul cu detalii despre berea consumată
4. **Vezi istoricul**: Toate berile tale sunt afișate în dashboard

## Deployment

Aplicația este pregătită pentru deployment pe Vercel:

```bash
npm run build
npm run start
```

## Contribuții

1. Fork proiectul
2. Creează o branch pentru feature (`git checkout -b feature/AmazingFeature`)
3. Commit schimbările (`git commit -m 'Add some AmazingFeature'`)
4. Push la branch (`git push origin feature/AmazingFeature`)
5. Deschide un Pull Request

## Licență

Acest proiect este licențiat sub MIT License.
