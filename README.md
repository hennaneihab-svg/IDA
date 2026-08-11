# IDA — Intelligent Data Analytics

> Site vitrine one-page, statique (HTML / CSS / JS pur), prêt à être hébergé sur **GitHub Pages** sans étape de build.

## 📁 Structure du projet

```
/
├── index.html          # Page unique principale
├── css/
│   └── style.css       # Système de design complet (tokens, composants, layout)
├── js/
│   └── script.js       # Animations, interactions, canvas ADN/histogramme
├── assets/
│   ├── logo.png        # Logo IDA (fond transparent) — à placer manuellement
│   └── favicon.png     # Favicon (peut être le même que logo.png)
└── README.md           # Ce fichier
```

## 🚀 Déploiement sur GitHub Pages

### Pré-requis
- Avoir `git` installé
- Avoir un compte GitHub
- Avoir placé `logo.png` (et `favicon.png`) dans le dossier `assets/`

### Commandes

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/hennaneihab-svg/IDA.git
git push -u origin main
```

Ensuite, dans les **Settings** du dépôt GitHub :
1. Aller dans **Pages** (menu de gauche)
2. Source → **Deploy from a branch**
3. Branch → `main` → `/ (root)`
4. Cliquer **Save**

Le site sera disponible à `https://hennaneihab-svg.github.io/IDA/` après quelques minutes.

---

## 🎨 Direction artistique "Living Data"

| Token | Valeur | Usage |
|---|---|---|
| `--ink` | `#070B12` | Fond principal |
| `--cyan` | `#00E5C7` | Accent primaire (bioluminescence) |
| `--violet` | `#7C6FFF` | Accent secondaire |
| `--amber` | `#FFB454` | Highlight chaleureux |
| `--text` | `#EAF2F5` | Texte principal |

**Typographies** : Space Grotesk (titres) · IBM Plex Sans (corps) · JetBrains Mono (labels)

---

## ✨ Fonctionnalités

- **Animation canvas hero** : réseau de nœuds oscillant entre une double hélice d'ADN et un histogramme de données, respectant `prefers-reduced-motion`
- **Pipeline services** : 10 étapes en zigzag avec ligne centrale reliant chaque nœud
- **Navbar glassmorphism** : fond flouté qui apparaît au scroll
- **Menu mobile fullscreen** : avec burger animé
- **Scroll reveal** : fade + translate avec stagger sur les grilles
- **Formulaire Web3Forms** : envoi sans backend via Web3Forms avec notifications email directes
- **Bouton WhatsApp flottant** : visible en permanence en bas à droite
- **Responsive mobile-first** : adapté à tous les écrans

---

## 📝 Personnalisation

### Modifier le numéro WhatsApp
Rechercher `213772445412` dans `index.html` et remplacer par votre numéro (format international sans `+`).

### Modifier l'email de contact
Rechercher `idaintelligence@gmail.com` dans `index.html` et `en/index-en.html` et remplacer dans :
- La clé d'accès / service Web3Forms
- Le lien `mailto:` dans la section Contact et le footer

### Changer les couleurs
Modifier les variables CSS dans `:root { }` dans `css/style.css`.

---

## 🔧 Notes techniques

- **Aucune dépendance** hors Google Fonts (chargé via CDN)
- **Performances** : animations CSS/Canvas natif, pas de librairie JS externe
- **Accessibilité** : focus visible au clavier, attributs ARIA, contrastes WCAG AA
- **SEO** : balises meta, Open Graph, structure H1 unique par page, HTML5 sémantique

---

*© 2024 IDA — Intelligent Data Analytics. Tous droits réservés.*
