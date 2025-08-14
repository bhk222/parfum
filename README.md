# Parfumerie Personnelle (Offline PWA)

Stack:
- React 18 + Vite + TypeScript
- Zustand (state UI / global), Dexie (IndexedDB) persistance
- React Router
- PWA (service worker basique) + offline cache statique
- Architecture modulaire (services, modèles, engines)
- Export / Import JSON (manifeste versionné + hash)
- Extensible: coach contextuel (rules), suggestion engine, safety advisor

## Lancement

```bash
npm install
npm run dev
```

Build prod:
```bash
npm run build
npm run preview
```

## Modules (Roadmap)
Phase 1: Inventaire, Formules, Versions basiques, Export/Import, Dashboard ratios  
Phase 2: Diff formules, Batch + Fiche imprimable  
Phase 3: Évaluations + Rappels notifications  
Phase 4: Suggestions (Adjustment Advisor), Safety Advisor  
Phase 5: Coach contextuel, Tooltips dynamiques, Backups auto  

## Structure

```
src/
  app/
    routes/ (pages React Router)
  components/
  db/
  models/
  services/
  stores/
  utils/
  workers/
public/
```

## Données (Dexie)
Voir db/dexie.ts pour schéma initial.

## Améliorations futures
- Compression + chiffrement exports (WebCrypto)
- Sync chiffrée (optionnelle)
- Heuristiques plus avancées (embeddings locales plus tard)

## Licence
Usage personnel (adapter).