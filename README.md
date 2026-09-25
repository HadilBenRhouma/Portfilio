# Portfolio — Hadil Ben Rhouma

Portfolio personnel bilingue (FR/EN) : **HTML, CSS et JavaScript purs**, sans build ni dépendance.

## Lancer le site

Double-cliquez sur `index.html`, ou servez le dossier :

```bash
python3 -m http.server 8000
# puis ouvrez http://localhost:8000
```

## Structure

```
index.html        Accueil (hero, chiffres, savoir-faire)
skills.html       Compétences (niveaux, inventaire, langues)
projects.html     Projets (carrousel pro + projets académiques)
about.html        Parcours (expérience, formation, associatif)
contact.html      Formulaire + coordonnées
assets/
  css/style.css   Design system complet (thème sombre violet)
  js/main.js      Langue, navigation, animations, carrousel, formulaire
  img/hadil.png   Photo de profil
  files/          CV en PDF
```

## Modifier le contenu

Chaque texte traduisible porte ses deux versions **directement dans le HTML** :

```html
<p data-en="I build Odoo modules." data-fr="Je conçois des modules Odoo.">
  I build Odoo modules.
</p>
```

- `data-en` / `data-fr` → texte simple
- `data-en-html` / `data-fr-html` → texte contenant du balisage (ex. `<span class="grad-text">`)
- `data-ph-en` / `data-ph-fr` → placeholder d'un champ de formulaire
- `data-title-en` / `data-title-fr` → attributs `title` et `aria-label`

La langue choisie est mémorisée dans le navigateur ; au premier passage, c'est la langue du navigateur qui décide (français si elle commence par `fr`, anglais sinon).

### Autres points d'entrée

| Quoi | Où |
|---|---|
| Couleurs, espacements, polices | variables `:root` en haut de `assets/css/style.css` |
| Niveaux des barres de compétences | attribut `data-level` (0 à 100) dans `skills.html` |
| Compteurs animés | attributs `data-count` / `data-suffix` dans `index.html` |
| Adresse du formulaire | constante `mailto:` dans `assets/js/main.js` |

## Formulaire de contact

Le site étant statique, le formulaire **ouvre la messagerie du visiteur** avec le message pré-rempli ; rien n'est envoyé en arrière-plan. Pour recevoir les messages directement par HTTP, branchez le `<form>` sur un service tiers (Formspree, Web3Forms…) et retirez le gestionnaire `submit` dans `main.js`.

## Déploiement

Aucun build n'est nécessaire, le dossier se publie tel quel.

- **Vercel** — glisser-déposer le dossier sur vercel.com, ou `vercel` à la racine
- **Netlify** — glisser-déposer le dossier sur netlify.com
- **GitHub Pages** — pousser le dossier, puis activer Pages sur la branche `main`, dossier racine

## Accessibilité et compatibilité

- Contraste, navigation clavier et `aria-label` sur les icônes seules
- `prefers-reduced-motion` respecté : toutes les animations s'arrêtent si le système le demande
- Testé sur Chrome en 1440 px et 390 px de large
