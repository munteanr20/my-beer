# Scripts pentru Ghimbav's Tavern

## add-achievements.js

Acest script adaugă template-urile de achievements în colecția `achievements` din Firestore.

### Pași pentru utilizare:

1. **Configurare Firebase:**
   - Asigură-te că ai `.env.local` în rădăcina proiectului cu configurația Firebase
   - Scriptul folosește automat configurația din `app/lib/firebase.ts`

2. **Rulare script:**
   ```bash
   npm run add-achievements
   ```
   sau
   ```bash
   node scripts/add-achievements.js
   ```

### Ce face scriptul:

- Verifică dacă există deja achievements în baza de date
- Dacă nu există, adaugă 8 achievements predefinite:
  - 🍺 First Sip (milestone)
  - 📚 Beer Collector (10 beers)
  - 📖 Beer Enthusiast (50 beers)
  - 👑 Beer Master (100 beers)
  - 📅 Weekly Regular (4 weeks)
  - 🎨 Variety Seeker (5 types)
  - 🔥 Week Warrior (7 days streak)
  - ⭐ Monthly Master (30 days streak)

### Structura în Firestore:

```
achievements/
  ├── [auto-generated-id]/
  │   ├── type: "milestone"
  │   ├── title: "First Sip"
  │   ├── description: "Log your first beer in the tavern"
  │   ├── icon: "🍺"
  │   └── criteria: {
  │       target: 1,
  │       unit: "beers"
  │     }
  └── [auto-generated-id]/
      ├── type: "beer_count"
      ├── title: "Beer Collector"
      └── ...
```

### Securitate:

- Configurația Firebase este stocată în `.env.local` în rădăcina proiectului
- Scriptul folosește configurația centralizată din `app/lib/firebase.ts`
- Nu mai este nevoie de configurare separată pentru script

### Output:

Scriptul va afișa în console:
```
Starting to add achievements to Firestore...
No existing achievements found. Adding 8 achievements...
✅ Added: First Sip (ID: abc123)
✅ Added: Beer Collector (ID: def456)
...
🎉 All achievements added successfully!
Total achievements added: 8
Script completed
``` 