import React, { useState } from 'react'
import { 
  GraduationCap, 
  Play, 
  Pause, 
  BookOpen, 
  Clock, 
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp,
  Award,
  ChevronRight,
  ChevronLeft,
  Filter,
  Search,
  X,
  Video,
  FileText
} from 'lucide-react'

import ProducerLayout from '../../layouts/ProducerLayout'

const ProducerFormations = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [accessFilter, setAccessFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const [selectedFormation, setSelectedFormation] = useState(null)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [lessonState, setLessonState] = useState({})
  const [followedFormations, setFollowedFormations] = useState([])
  const [formationProgress, setFormationProgress] = useState({})
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizResults, setQuizResults] = useState({})

  // Contenus enrichis avec textes, images et vidéos réalistes
  const [allFormations] = useState([
    {
      _id: '1',
      title: 'Techniques agricoles modernes',
      description: 'Tutoriel vidéo couvrant les bonnes pratiques modernes pour améliorer le rendement durablement.',
      category: 'Techniques',
      type: 'tutoriel',
      access: 'free',
      duration: 90,
      thumbnail: 'https://i.pinimg.com/736x/da/b9/78/dab97890298e05de1a88c0492463d153.jpg',
      lessons: [
        {
          title: 'Introduction aux techniques modernes',
          type: 'video',
          duration: 15,
          payload: {
            url: 'https://youtu.be/oYBocFbnNe0',
          }
        },
        {
          title: 'Semis direct et couverture végétale',
          type: 'article',
          duration: 20,
          payload: {
            text: `Le semis direct est une technique agricole moderne qui permet de semer sans labour préalable. Cette méthode présente de nombreux avantages pour la santé des sols et la durabilité de l'agriculture.

Avantages du semis direct :
• Réduction de l'érosion des sols de 70 à 90%
• Conservation de l'humidité du sol
• Diminution des coûts en carburant et main d'œuvre
• Amélioration de la structure du sol
• Augmentation de la matière organique

La couverture végétale :
Elle joue un rôle crucial dans la protection du sol. Les plantes de couverture empêchent l'érosion, enrichissent le sol en azote, et suppriment les mauvaises herbes naturellement.

Mise en pratique :
1. Choisir des plantes de couverture adaptées (légumineuses, graminées)
2. Laisser les résidus en surface
3. Semer directement à travers le couvert
4. Observer et ajuster selon les résultats`,
            images: [
              'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=800&auto=format&fit=crop'
            ]
          }
        },
        {
          title: 'Rotation des cultures',
          type: 'article',
          duration: 25,
          payload: {
            text: `La rotation des cultures est une pratique ancestrale qui consiste à alterner différentes cultures sur une même parcelle au fil des saisons.

Principes fondamentaux :
• Alterner les familles botaniques
• Varier les besoins nutritifs
• Rompre les cycles des ravageurs
• Améliorer la fertilité naturelle

Exemples de rotations efficaces :
Année 1 : Légumineuses (enrichissement en azote)
Année 2 : Céréales (consommation modérée d'azote)
Année 3 : Cultures sarclées (nettoyage du sol)
Année 4 : Cultures de couverture

Bénéfices mesurables :
• Réduction des maladies : 40-60%
• Augmentation du rendement : 10-25%
• Diminution des intrants chimiques : 30-50%

La rotation permet aussi de briser les cycles des adventices et des ravageurs spécifiques à certaines cultures.`,
            images: [
              'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&auto=format&fit=crop'
            ]
          }
        },
        {
          title: 'Irrigation intelligente',
          type: 'article',
          duration: 20,
          payload: {
            text: `L'irrigation intelligente combine technologie et observation pour optimiser l'usage de l'eau.

Technologies disponibles :
• Capteurs d'humidité du sol
• Stations météo connectées
• Systèmes d'irrigation goutte à goutte
• Programmateurs intelligents

Méthodes d'économie d'eau :
1. Irrigation goutte à goutte : économie de 30-50% d'eau
2. Paillage : réduction de l'évaporation de 70%
3. Arrosage tôt le matin ou tard le soir
4. Adaptation aux besoins réels des plantes

Surveillance et ajustement :
Observer quotidiennement les plantes, vérifier l'humidité du sol à 10-15cm de profondeur, ajuster selon les prévisions météo.`,
            images: [
              'https://i.pinimg.com/736x/b4/e9/0b/b4e90bd5d84930c98696af64fe302f7c.jpg',
              'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800&auto=format&fit=crop'
            ]
          }
        },
        {
          title: 'Quiz d\'évaluation',
          type: 'quiz',
          duration: 10,
          payload: {
            questions: [
              { 
                question: "Quel est le principal avantage de la rotation des cultures ?", 
                choices: ["Augmenter l'usage des pesticides", "Limiter maladies et parasites", "Réduire la biodiversité", "Augmenter la salinité du sol"], 
                answerIndex: 1 
              },
              { 
                question: "Quelle pratique aide à économiser l'eau ?", 
                choices: ["Arrosage en plein soleil", "Irrigation goutte à goutte", "Inonder la parcelle", "Arrosage aléatoire"], 
                answerIndex: 1 
              },
              { 
                question: "Le paillage permet de...", 
                choices: ["Augmenter l'évaporation", "Réduire l'évaporation et les adventices", "Saliniser le sol", "Remplacer l'eau"], 
                answerIndex: 1 
              }
            ]
          }
        }
      ],
      participants: 245
    },
    {
      _id: '2',
      title: 'Dosage des engrais et phytosanitaires',
      description: 'Fiche pratique détaillant les calculs de dosages sécurisés et efficaces.',
      category: 'Fiches pratiques',
      type: 'fiche',
      access: 'premium',
      duration: 45,
      thumbnail: 'https://i.pinimg.com/736x/ad/f3/d8/adf3d86b4ca7a5533d788b0b14967676.jpg',
      lessons: [
        {
          title: 'Principes de dosage',
          type: 'article',
          duration: 15,
          payload: {
            text: `Le dosage précis des engrais et phytosanitaires est crucial pour l'efficacité et la sécurité.

Formule de base :
Quantité nécessaire = Dose recommandée (L/ha ou kg/ha) × Surface (ha)

Exemple pratique :
Pour traiter 0,5 hectare avec un produit dosé à 2 L/ha :
Quantité = 2 L/ha × 0,5 ha = 1 litre

Calculs courants :
• Conversion m² en ha : diviser par 10 000
• Pour 2500 m² : 2500 ÷ 10 000 = 0,25 ha
• Dose pour 0,25 ha à 4 L/ha : 4 × 0,25 = 1 L

Points d'attention :
✓ Toujours lire l'étiquette du produit
✓ Respecter les doses homologuées
✓ Tenir compte des conditions météo
✓ Calculer le volume de bouillie total`,
            images: [
              'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=800&auto=format&fit=crop',
              'https://i.pinimg.com/736x/b4/e9/0b/b4e90bd5d84930c98696af64fe302f7c.jpg'
            ]
          }
        },
        {
          title: 'Équipements de protection (EPI)',
          type: 'article',
          duration: 15,
          payload: {
            text: `La sécurité lors de la manipulation de produits phytosanitaires est primordiale.

EPI obligatoires :
🧤 Gants résistants aux produits chimiques
😷 Masque respiratoire avec filtres adaptés
🥽 Lunettes ou visière de protection
👔 Combinaison étanche
👢 Bottes imperméables

Procédure de mise en place :
1. Vérifier l'état des EPI avant utilisation
2. S'habiller dans un ordre précis (de bas en haut)
3. Vérifier l'étanchéité de l'ensemble
4. Porter les EPI pendant toute la manipulation

Après utilisation :
• Retirer les EPI en évitant le contact avec la peau
• Laver les EPI réutilisables
• Se laver soigneusement les mains et le visage
• Ranger les EPI dans un endroit sec et ventilé

Important : Ne jamais manger, boire ou fumer pendant la manipulation.`,
            images: [
              'https://images.unsplash.com/photo-1591195853828-11db59a44f6c?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?q=80&w=800&auto=format&fit=crop'
            ]
          }
        },
        {
          title: 'Bonnes pratiques d\'application',
          type: 'article',
          duration: 15,
          payload: {
            text: `L'application correcte des produits garantit efficacité et sécurité environnementale.

Conditions optimales d'application :
🌡️ Température : 12-25°C
💨 Vent : < 19 km/h (< 3 sur échelle Beaufort)
☔ Pas de pluie prévue dans les 3-6 heures
🌅 Tôt le matin ou fin d'après-midi

Préparation de la bouillie :
1. Remplir la cuve à moitié d'eau
2. Ajouter le produit progressivement
3. Compléter avec de l'eau en agitant
4. Homogénéiser avant application

Traçabilité :
Tenir un registre avec :
• Date et heure du traitement
• Produit utilisé et dose
• Surface traitée
• Conditions météo
• Raison du traitement

Gestion des emballages vides :
✓ Triple rinçage dans la cuve
✓ Perforation pour éviter la réutilisation
✓ Stockage en attente de collecte
✓ Remise au circuit de recyclage`,
            images: [
              'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop'
            ]
          }
        },
        {
          title: 'Quiz de sécurité',
          type: 'quiz',
          duration: 5,
          payload: {
            questions: [
              { 
                question: 'Que signifie 2 L/ha ?', 
                choices: ['2 litres par hectare', '2 litres par mètre carré', '2 litres par parcelle', '2 litres par semaine'], 
                answerIndex: 0 
              },
              { 
                question: 'Pour 0,25 ha à 4 L/ha, il faut...', 
                choices: ['1 L', '2 L', '0,5 L', '4 L'], 
                answerIndex: 0 
              },
              { 
                question: 'Quel EPI est recommandé ?', 
                choices: ['Gants et masque', 'Tongs', 'Short', 'Aucun'], 
                answerIndex: 0 
              }
            ]
          }
        }
      ],
      participants: 189
    },
    {
      _id: '3',
      title: 'Gestion intégrée des ravageurs',
      description: 'Stratégies IPM: prévention, surveillance et intervention raisonnée.',
      category: 'Protection des cultures',
      type: 'fiche',
      access: 'free',
      duration: 40,
      thumbnail: 'https://i.pinimg.com/736x/0f/a9/da/0fa9da2536e456c97da2e24d1246d826.jpg',
      lessons: [
        {
          title: 'Principes de la lutte intégrée',
          type: 'article',
          duration: 15,
          payload: {
            text: `La Gestion Intégrée des Ravageurs (IPM) est une approche écologique et économique de la protection des cultures.

Les 4 piliers de l'IPM :

1. Prévention
• Choix de variétés résistantes
• Rotation des cultures
• Hygiène rigoureuse des parcelles
• Gestion de la fertilisation

2. Surveillance
• Observation régulière des parcelles
• Pièges à phéromones
• Comptage des ravageurs
• Identification précise

3. Seuils d'intervention
• Ne traiter que si nécessaire
• Seuils économiques définis
• Décision basée sur l'observation
• Prise en compte des auxiliaires

4. Intervention raisonnée
• Priorité aux méthodes biologiques
• Produits sélectifs si nécessaire
• Doses et moments optimaux
• Alternance des matières actives`,
            images: [
              'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800&auto=format&fit=crop'
            ]
          }
        },
        {
          title: 'Techniques de surveillance',
          type: 'article',
          duration: 12,
          payload: {
            text: `Une surveillance efficace est la clé d'une protection réussie.

Méthodes de surveillance :

Piégeage :
• Pièges chromatiques (jaunes, bleus)
• Pièges à phéromones sexuelles
• Pièges alimentaires
• Relevés hebdomadaires

Observation directe :
• Parcourir 5 zones représentatives
• Observer 20 plantes par zone
• Examiner feuilles, tiges, fruits
• Noter stade de développement

Indicateurs à surveiller :
✓ Présence et densité de ravageurs
✓ Stades de développement
✓ Dégâts observés
✓ Présence d'auxiliaires
✓ Conditions favorables

Cahier de suivi :
Consigner date, localisation, observations, décisions prises.`,
            images: [
              'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&auto=format&fit=crop'
            ]
          }
        },
        {
          title: 'Lutte biologique',
          type: 'article',
          duration: 13,
          payload: {
            text: `La lutte biologique utilise les ennemis naturels des ravageurs.

Principaux auxiliaires :

Prédateurs :
🐞 Coccinelles : contre pucerons (50-100/jour)
🕷️ Araignées : contre divers insectes
🐛 Chrysopes : contre pucerons, cochenilles

Parasitoïdes :
🦟 Trichogrammes : contre chenilles
🐝 Aphidius : contre pucerons

Favoriser les auxiliaires :
• Bandes fleuries en bordure de champ
• Haies diversifiées
• Réduire les traitements chimiques
• Zones refuges (tas de pierres, bois)

Lâchers d'auxiliaires :
Possible pour : coccinelles, chrysopes, trichogrammes
Moment : début d'infestation
Fréquence : selon l'espèce

Avantages :
✓ Pas de résidus
✓ Pas de résistance
✓ Action durable
✓ Gratuit (auxiliaires naturels)`,
            images: [
              'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1563291069-9cc868219fdb?q=80&w=800&auto=format&fit=crop'
            ]
          }
        }
      ],
      participants: 312
    },
    {
      _id: '4',
      title: 'Irrigation efficiente à faible coût',
      description: "Tutoriel sur la micro-irrigation et la gestion de l'eau en période sèche.",
      category: 'Irrigation',
      type: 'tutoriel',
      access: 'premium',
      duration: 60,
      thumbnail: 'https://i.pinimg.com/1200x/5e/e9/f3/5ee9f3590a98cd3b2d57cc0ea709a308.jpg',
      lessons: [
        {
          title: 'Introduction à la micro-irrigation',
          type: 'video',
          duration: 12,
          payload: {
            url: 'https://youtu.be/oYBocFbnNe0',
            thumbnail: 'https://i.pinimg.com/1200x/5e/e9/f3/5ee9f3590a98cd3b2d57cc0ea709a308.jpg'
          }
        },
        {
          title: 'Systèmes de micro-irrigation',
          type: 'article',
          duration: 18,
          payload: {
            text: `La micro-irrigation permet d'économiser jusqu'à 50% d'eau tout en améliorant les rendements.

Types de systèmes :

1. Goutte à goutte
• Goutteurs en ligne ou à la demande
• Débit : 2-4 litres/heure
• Idéal pour cultures en ligne
• Coût : 1000-3000 €/ha

2. Micro-aspersion
• Jets fins en forme de parapluie
• Rayon : 1-3 mètres
• Bon pour cultures serrées
• Coût : 1500-4000 €/ha

3. Irrigation localisée enterrée
• Tuyaux poreux enterrés
• Très efficace en zones arides
• Durée de vie : 10-15 ans
• Coût initial élevé mais rentable

Composants essentiels :
✓ Tête de réseau (filtres, régulateur)
✓ Réseau de distribution (tuyaux)
✓ Distributeurs (goutteurs, asperseurs)
✓ Vannes et robinets

Calcul des besoins :
Volume = Surface × ETc × Efficacité
ETc = Évapotranspiration de la culture`,
            images: [
              'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1597633425046-08f5110420b5?q=80&w=800&auto=format&fit=crop'
            ]
          }
        },
        {
          title: 'Installation et maintenance',
          type: 'article',
          duration: 15,
          payload: {
            text: `Une installation correcte et un entretien régulier garantissent la durabilité du système.

Étapes d'installation :

1. Planification
• Cartographie de la parcelle
• Calcul des débits nécessaires
• Choix des équipements
• Plan du réseau

2. Installation
• Pose de la tête de réseau
• Déroulement des tuyaux principaux
• Installation des rampes
• Mise en place des goutteurs
• Tests de pression

3. Réglages
• Ajustement de la pression (1-1,5 bar)
• Uniformité de distribution
• Durée d'irrigation
• Fréquence selon culture

Maintenance régulière :

Hebdomadaire :
✓ Vérifier goutteurs bouchés
✓ Contrôler pression
✓ Observer uniformité

Mensuelle :
✓ Nettoyer filtres
✓ Vérifier fuites
✓ Tester vannes

Annuelle :
✓ Rinçage acide du système
✓ Remplacement pièces usées
✓ Contrôle complet

Problèmes courants :
• Bouchage : rincer, filtrer mieux
• Fuites : réparer rapidement
• Pression irrégulière : vérifier réseau`,
            images: [
              'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800&auto=format&fit=crop'
            ]
          }
        },
        {
          title: 'Planification des irrigations',
          type: 'article',
          duration: 15,
          payload: {
            text: `Une planification intelligente optimise l'eau et les rendements.

Besoins en eau par stade :

Tomate :
• Germination : 10-15 mm/semaine
• Croissance : 20-30 mm/semaine
• Floraison/fructification : 30-40 mm/semaine
• Maturation : 15-20 mm/semaine

Facteurs à considérer :
🌡️ Température (évapotranspiration)
💧 Pluie attendue
🌱 Stade de la culture
🏜️ Type de sol
🌬️ Vent et humidité

Outils d'aide à la décision :
• Sondes tensiométriques (tension de l'eau)
• Sondes capacitives (% humidité)
• Stations météo (ETP)
• Applications mobiles

Calcul pratique :
Dose = (ETP × Kc × Surface) / Efficacité
ETP = Évapotranspiration potentielle
Kc = Coefficient cultural

Exemple :
ETP = 5 mm/jour
Kc tomate en fructification = 1,2
Surface = 1 ha
Efficacité goutte à goutte = 90%

Dose = (5 × 1,2 × 10000) / 0,9 = 66 667 litres/ha/jour

Horaires optimaux :
🌅 Tôt le matin (5h-8h) : -30% évaporation
🌆 Fin d'après-midi (17h-19h) : acceptable
❌ Jamais en plein soleil : évaporation maximale`,
            images: [
              'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=800&auto=format&fit=crop'
            ]
          }
        }
      ],
      participants: 178
    },
    {
      _id: '5',
      title: 'Compostage et fertilité des sols',
      description: "Fiche pratique sur la fabrication et l'usage du compost pour enrichir le sol.",
      category: 'Fertilité des sols',
      type: 'fiche',
      access: 'free',
      duration: 35,
      thumbnail: 'https://i.pinimg.com/1200x/34/94/fb/3494fb78d2e23eefcfcb77e130f1c052.jpg',
      lessons: [
        {
          title: 'Principes du compostage',
          type: 'article',
          duration: 12,
          payload: {
            text: `Le compost est un amendement organique précieux, gratuit et écologique.

Qu'est-ce que le compostage ?
C'est la décomposition de matières organiques par des micro-organismes en présence d'oxygène, produisant un humus riche et stable.

Avantages du compost :
✓ Améliore structure du sol
✓ Augmente rétention d'eau (20-30%)
✓ Apporte nutriments progressivement
✓ Stimule vie microbienne
✓ Réduit déchets organiques

Éléments essentiels :

1. Matières carbonées (brunes) - C
• Feuilles sèches, paille
• Branchages broyés
• Cartons non imprimés
• Rapport C/N : 30/1

2. Matières azotées (vertes) - N
• Tontes de gazon
• Déchets de cuisine
• Fumiers frais
• Rapport C/N : 15/1

3. Équilibre C/N idéal : 25-30/1
Mix : 2/3 bruns + 1/3 verts

Conditions de réussite :
🌡️ Température : 50-70°C (phase active)
💧 Humidité : 50-60% (éponge essorée)
💨 Aération : retournement régulier
⚖️ Volume minimum : 1 m³`,
            images: [
              'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1591025207163-942350e47db2?q=80&w=800&auto=format&fit=crop'
            ]
          }
        },
        {
          title: 'Fabrication du compost',
          type: 'article',
          duration: 13,
          payload: {
            text: `Un bon compost nécessite méthode et patience, mais le résultat en vaut la peine !

Méthode en tas :

Étape 1 : Préparation (Jour 0)
• Choisir emplacement ombragé
• Sol drainant, près de la source d'eau
• Commencer par couche drainante (branches)

Étape 2 : Montage en couches
Alterner :
1. 15-20 cm matières brunes
2. 5-10 cm matières vertes
3. Arroser légèrement
4. Répéter jusqu'à 1,5 m de haut

Étape 3 : Phase active (0-3 mois)
• Température monte à 60-70°C
• Retourner toutes les 2-3 semaines
• Vérifier humidité
• Ajouter eau si trop sec

Étape 4 : Maturation (3-6 mois)
• Température redescend
• Retourner mensuellement
• Odeur de terre de forêt
• Couleur brun foncé

À NE PAS composter :
❌ Viandes, poissons
❌ Produits laitiers
❌ Plantes malades
❌ Mauvaises herbes en graines
❌ Excréments d'animaux carnivores

Test de maturité :
✓ Aspect grumeleux, brun foncé
✓ Odeur agréable de sous-bois
✓ Température ambiante
✓ Matériaux non identifiables`,
            images: [
              'https://images.unsplash.com/photo-1526401485004-2fda9f4a27d6?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=800&auto=format&fit=crop'
            ]
          }
        },
        {
          title: 'Utilisation du compost',
          type: 'article',
          duration: 10,
          payload: {
            text: `Le compost mûr est un trésor pour vos cultures. Voici comment l'utiliser efficacement.

Dosages recommandés :

Potager :
• 3-5 kg/m² incorporé avant plantation
• 2-3 cm en paillage
• Application annuelle

Vergers :
• 10-15 kg/arbre adulte
• En couronne autour du tronc
• Automne ou printemps

Grandes cultures :
• 20-40 tonnes/ha
• Tous les 2-3 ans
• Avant labour ou en surface

Méthodes d'application :

1. Incorporation légère
• Mélanger aux premiers 10-15 cm
• Avec griffe ou motoculteur
• Ne pas enterrer profondément

2. Paillage de surface
• Couche de 2-3 cm
• Protège et nourrit
• Réduit arrosage

3. Thé de compost
• 1 kg compost dans 10 L eau
• Laisser macérer 24-48h
• Diluer 1:10 pour arrosage

Bénéfices mesurés :
📈 Rendement : +15-30%
💧 Rétention d'eau : +25%
🌱 Germination : +20%
🐛 Vie du sol : x5

Précautions :
⚠️ Ne pas surdoser (salinité)
⚠️ Compost bien mûr uniquement
⚠️ Éviter contact direct avec graines`,
            images: [
              'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&auto=format&fit=crop'
            ]
          }
        }
      ],
      participants: 267
    },
    {
      _id: '6',
      title: 'Sécurité phytosanitaire et EPI',
      description: 'Tutoriel sur le port des équipements de protection individuelle et les bonnes pratiques.',
      category: 'Sécurité',
      type: 'tutoriel',
      access: 'premium',
      duration: 50,
      thumbnail: 'https://i.pinimg.com/1200x/33/08/5c/33085cd8206cbfcd07c4b4a60bea9993.jpg',
      lessons: [
        {
          title: 'Introduction à la sécurité',
          type: 'video',
          duration: 10,
          payload: {
            url: 'https://youtu.be/oYBocFbnNe0',
            thumbnail: 'https://i.pinimg.com/1200x/33/08/5c/33085cd8206cbfcd07c4b4a60bea9993.jpg'
          }
        },
        {
          title: 'Les EPI indispensables',
          type: 'article',
          duration: 15,
          payload: {
            text: `La protection individuelle est votre première ligne de défense contre les produits chimiques.

EPI obligatoires par zone protégée :

1. Protection respiratoire 😷
• Masque à cartouches filtrantes
• Cartouches A2P3 pour phytos
• Demi-masque ou masque complet
• Remplacer selon utilisation

2. Protection des mains 🧤
• Gants nitrile ou néoprène
• Non poudrés, longue manchette
• Vérifier absence de trous
• Changer dès perforation

3. Protection des yeux 🥽
• Lunettes ou écran facial
• Joints étanches
• Anti-buée
• Nettoyer après usage

4. Protection du corps 👔
• Combinaison type 3 ou 4
• Étanche aux liquides
• Avec capuche
• À usage unique ou lavable

5. Protection des pieds 👢
• Bottes PVC ou caoutchouc
• Imperméables
• Faciles à nettoyer
• Semelles antidérapantes

Ordre d'habillage :
1. Lire l'étiquette du produit
2. Bottes
3. Combinaison
4. Masque (ajuster sangles)
5. Lunettes
6. Gants (par-dessus manchettes)

Stockage des EPI :
✓ Lieu sec et ventilé
✓ À l'abri du soleil
✓ Séparé des produits
✓ Contrôle régulier de l'état`,
            images: [
              'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?q=80&w=800&auto=format&fit=crop'
            ]
          }
        },
        {
          title: 'Préparation sécurisée',
          type: 'article',
          duration: 12,
          payload: {
            text: `La phase de préparation est la plus dangereuse : concentration maximale du produit.

Zone de préparation :
• Extérieur ou local ventilé
• Sol imperméable
• Point d'eau proche
• Trousse de premiers secours
• Fiche de données de sécurité (FDS)

Étapes de préparation :

1. Avant de commencer
✓ Lire l'étiquette complètement
✓ Vérifier compatibilité des produits
✓ Calculer dose exacte
✓ Préparer matériel de mesure
✓ Porter tous les EPI

2. Remplissage de la cuve
• Remplir cuve à 1/3 d'eau
• Mettre agitateur en marche
• Verser produit lentement
• Ne jamais souffler dans les buses
• Compléter avec de l'eau

3. Pendant la préparation
⚠️ Ne jamais manger ou boire
⚠️ Ne pas fumer
⚠️ Éviter éclaboussures
⚠️ Travailler au-dessus cuve
⚠️ Fermer emballages entre doses

4. Après la préparation
• Rincer bidons (triple rinçage)
• Verser eau de rinçage dans cuve
• Fermer hermétiquement la cuve
• Nettoyer zone de préparation
• Se laver les mains (avec gants)

En cas d'incident :
☎️ 15 (SAMU) ou 112 (Urgences)
Avoir sous la main : étiquette produit + FDS`,
            images: [
              'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=800&auto=format&fit=crop'
            ]
          }
        },
        {
          title: 'Après-traitement et décontamination',
          type: 'article',
          duration: 13,
          payload: {
            text: `La décontamination correcte prévient l'exposition résiduelle et la contamination croisée.

Procédure de décontamination :

1. Rincer le matériel
• Vider fond de cuve au champ traité
• Rincer pulvérisateur (3 fois)
• Nettoyer filtres et buses
• Vérifier absence de dépôts

2. Retirer les EPI (ordre inverse)
1. Retirer gants extérieurs
2. Enlever bottes
3. Retirer combinaison (rouler vers extérieur)
4. Enlever lunettes
5. Retirer masque (ne pas toucher filtre)
6. Retirer gants intérieurs

3. Nettoyage des EPI réutilisables
• Laver gants et bottes à l'eau savonneuse
• Rincer abondamment
• Faire sécher à l'air libre
• Vérifier état avant rangement

4. Hygiène corporelle
🚿 Douche complète obligatoire
🧴 Savon et shampoing
👔 Changer tous les vêtements
🧺 Laver vêtements séparément

Gestion des déchets :

Emballages vides :
• Triple rinçage dans la cuve
• Perforation pour inutilisation
• Stockage temporaire sécurisé
• Remise au collecteur agréé

EPI à usage unique :
• Ne jamais réutiliser
• Sac fermé hermétiquement
• Filière d'élimination spécialisée

Eaux de rinçage :
• Jamais dans égouts/rivières
• Épandage au champ traité
• Ou système de traitement

Premiers secours :

Contact peau :
Enlever vêtements, laver 15 min eau + savon

Projection yeux :
Rincer 15 min à l'eau claire, paupières ouvertes

Inhalation :
Sortir au grand air, position semi-assise

Ingestion :
Ne pas faire vomir, donner à boire

➡️ Appeler centre antipoison : 01 40 05 48 48
Avoir l'étiquette du produit !`,
            images: [
              'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=800&auto=format&fit=crop'
            ]
          }
        },
        {
          title: 'Quiz de sécurité final',
          type: 'quiz',
          duration: 5,
          payload: {
            questions: [
              { 
                question: 'Quel EPI protège les voies respiratoires ?', 
                choices: ['Gants', 'Bottes', 'Masque à cartouches', 'Lunettes'], 
                answerIndex: 2 
              },
              { 
                question: 'Après traitement, il faut...', 
                choices: ['Jeter les EPI', 'Se doucher et nettoyer le matériel', 'Dormir', 'Manger'], 
                answerIndex: 1 
              },
              {
                question: 'Le triple rinçage des emballages sert à...',
                choices: ['Décorer', 'Récupérer le produit et décontaminer', 'Perdre du temps', 'Rien'],
                answerIndex: 1
              }
            ]
          }
        }
      ],
      participants: 203
    }
  ])

  const selectQuizAnswer = (formationId, questionIndex, choiceIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [formationId]: {
        ...(prev[formationId] || {}),
        [questionIndex]: choiceIndex
      }
    }))
  }

  const submitQuiz = (formationId, lessonIndex, questions) => {
    const answers = quizAnswers[formationId] || {}
    let correct = 0
    questions.forEach((q, idx) => {
      if (answers[idx] === q.answerIndex) correct++
    })
    const percent = Math.round((correct / questions.length) * 100)
    setQuizResults(prev => ({
      ...prev,
      [formationId]: { correct, total: questions.length, percent }
    }))
    
    if (percent >= 70) {
      markLessonCompleted(formationId, lessonIndex)
      alert(`Félicitations ! Vous avez réussi le quiz avec ${percent}%`)
    } else {
      alert(`Score: ${percent}%. Révisez et réessayez (minimum 70% requis)`)
    }
  }

  const getLessons = (formation) => {
    return formation?.lessons || []
  }

  const syncProgressFromLessons = (formationId, lessons, completedMap) => {
    const total = lessons.length || 1
    const completed = Object.values(completedMap || {}).filter(Boolean).length
    const percent = Math.round((completed / total) * 100)
    setFormationProgress(prev => ({ ...prev, [formationId]: percent }))
  }

  const handleStartFormation = (formationId) => {
    if (!followedFormations.includes(formationId)) {
      setFollowedFormations(prev => [...prev, formationId])
    }
    setLessonState(prev => {
      const next = { ...prev }
      if (!next[formationId]) next[formationId] = { current: 0, completed: {} }
      return next
    })
  }

  const markLessonCompleted = (formationId, lessonIndex) => {
    setLessonState(prev => {
      const current = prev[formationId] || { current: 0, completed: {} }
      const updated = {
        ...prev,
        [formationId]: {
          current: Math.max(current.current, lessonIndex),
          completed: { ...current.completed, [lessonIndex]: true }
        }
      }
      const formation = allFormations.find(f => f._id === formationId)
      syncProgressFromLessons(formationId, getLessons(formation), updated[formationId].completed)
      return updated
    })
  }

  const goToLesson = (formationId, lessons, nextIndex) => {
    const bounded = Math.max(0, Math.min(lessons.length - 1, nextIndex))
    setCurrentLessonIndex(bounded)
    setLessonState(prev => {
      const current = prev[formationId] || { current: 0, completed: {} }
      return { ...prev, [formationId]: { ...current, current: bounded } }
    })
  }

  const getFormationStatus = (formationId) => {
    const progress = formationProgress[formationId] || 0
    if (progress === 100) return 'completed'
    if (progress > 0) return 'in_progress'
    if (followedFormations.includes(formationId)) return 'available'
    return 'available'
  }

  const filteredFormations = React.useMemo(() => {
    const term = (searchTerm || '').toLowerCase()
    return allFormations
      .filter(f => !term || f.title?.toLowerCase().includes(term) || f.description?.toLowerCase().includes(term))
      .filter(f => categoryFilter === 'all' || f.category === categoryFilter)
      .filter(f => typeFilter === 'all' || f.type === typeFilter)
      .filter(f => accessFilter === 'all' || f.access === accessFilter)
      .filter(f => {
        const status = getFormationStatus(f._id)
        if (statusFilter === 'all') return true
        if (statusFilter === 'available' && status === 'available') return true
        if (statusFilter === 'in_progress' && status === 'in_progress') return true
        if (statusFilter === 'completed' && status === 'completed') return true
        return false
      })
  }, [allFormations, statusFilter, formationProgress, searchTerm, categoryFilter, typeFilter, accessFilter, followedFormations])

  const openDetails = (formation) => {
    setSelectedFormation(formation)
    setLessonState(prev => {
      if (!prev[formation._id]) return { ...prev, [formation._id]: { current: 0, completed: {} } }
      return prev
    })
    setShowDetails(true)
  }

  const closeDetails = () => {
    setShowDetails(false)
    setSelectedFormation(null)
  }

  const openPlayer = (formation) => {
    setSelectedFormation(formation)
    const lessons = getLessons(formation)
    const st = lessonState[formation._id] || { current: 0, completed: {} }
    setCurrentLessonIndex(Math.min(st.current || 0, Math.max(lessons.length - 1, 0)))
    setShowDetails(false)
    setShowPlayer(true)
  }

  const closePlayer = () => {
    setShowPlayer(false)
    setSelectedFormation(null)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryFilter = (e) => {
    setCategoryFilter(e.target.value)
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Terminée'
      case 'in_progress': return 'En cours'
      default: return 'Disponible'
    }
  }

  const formatDuration = (minutes) => {
    const hours = Math.ceil(minutes / 60)
    return hours > 1 ? `${hours} heures` : `${hours} heure`
  }

  const allCategories = [...new Set(allFormations.map(f => f.category))].filter(c => c)

  return (
    <ProducerLayout>
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
              <GraduationCap className="w-8 h-8 text-green-600 mr-3" />
              Espace Formations
            </h1>
            <p className="text-lg text-gray-600">Développez vos compétences avec nos modules de formation.</p>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Filtres</span>
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                value={categoryFilter}
                onChange={handleCategoryFilter}
              >
                <option value="all">Toutes catégories</option>
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="all">Tous types</option>
                <option value="tutoriel">Tutoriels</option>
                <option value="fiche">Fiches</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" value={accessFilter} onChange={e => setAccessFilter(e.target.value)}>
                <option value="all">Tous accès</option>
                <option value="free">Gratuit</option>
                <option value="premium">Premium</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">Tous statuts</option>
                <option value="available">Disponible</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminée</option>
              </select>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredFormations.map((formation) => {
            const status = getFormationStatus(formation._id)
            const progress = formationProgress[formation._id] || 0
            const lessons = getLessons(formation)
            
            return (
              <div 
                key={formation._id} 
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-200"
              >
                <div className="h-48 w-full bg-gray-100 overflow-hidden">
                  <img src={formation.thumbnail} alt={formation.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800 leading-snug flex-1">
                      {formation.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(status)}`}>
                      {getStatusLabel(status)}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${formation.access === 'premium' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {formation.access === 'premium' ? 'Premium' : 'Gratuit'}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${formation.type === 'tutoriel' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                      {formation.type === 'tutoriel' ? 'Tutoriel' : 'Fiche'}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-3 text-sm line-clamp-2">
                    {formation.description}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1 text-blue-600" />
                      <span>{lessons.length} leçons</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-orange-600" />
                      <span>{formatDuration(formation.duration)}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1 text-green-600" />
                      <span>{formation.participants}</span>
                    </div>
                  </div>

                  {(status === 'in_progress' || status === 'completed') && (
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full transition-all duration-500" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>{progress}%</span>
                        <span>{lessons.length} leçons</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openDetails(formation)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      Détails
                    </button>
                    {status === 'available' ? (
                      <button
                        onClick={() => { handleStartFormation(formation._id); openPlayer(formation) }}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <Play className="w-4 h-4" />
                        <span>Débuter</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => openPlayer(formation)}
                        className="flex items-center justify-center space-x-2 px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                      >
                        <Play className="w-4 h-4" />
                        <span>Continuer</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {showDetails && selectedFormation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={closeDetails} />
            <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="h-64 w-full bg-gray-100 overflow-hidden flex-shrink-0">
                <img src={selectedFormation.thumbnail} alt={selectedFormation.title} className="w-full h-full object-cover" />
              </div>
              <button className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100" onClick={closeDetails}>
                <X className="w-5 h-5" />
              </button>
              <div className="p-6 overflow-y-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedFormation.title}</h3>
                <p className="text-gray-700 mb-4">{selectedFormation.description}</p>
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-orange-600" />{formatDuration(selectedFormation.duration)}</div>
                  <div className="flex items-center"><Users className="w-4 h-4 mr-2 text-green-600" />{selectedFormation.participants} inscrits</div>
                  <div className="flex items-center"><BookOpen className="w-4 h-4 mr-2 text-blue-600" />{getLessons(selectedFormation).length} leçons</div>
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={closeDetails} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Fermer</button>
                  <button onClick={() => { handleStartFormation(selectedFormation._id); openPlayer(selectedFormation) }} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Débuter</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPlayer && selectedFormation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={closePlayer} />
            <div className="relative bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-xl overflow-hidden grid grid-cols-12">
              <div className="col-span-3 h-full border-r overflow-y-auto">
                <div className="p-4 flex items-center justify-between border-b">
                  <h4 className="font-semibold text-gray-800">Sommaire</h4>
                  <button className="text-gray-500 hover:text-gray-700" onClick={closePlayer}><X className="w-5 h-5" /></button>
                </div>
                {(() => {
                  const lessons = getLessons(selectedFormation)
                  const st = lessonState[selectedFormation._id] || { current: 0, completed: {} }
                  return (
                    <ul className="divide-y">
                      {lessons.map((ls, idx) => (
                        <li key={idx} className={`p-3 cursor-pointer hover:bg-gray-50 ${idx === currentLessonIndex ? 'bg-blue-50' : ''}`} onClick={() => goToLesson(selectedFormation._id, lessons, idx)}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {ls.type === 'video' ? <Video className="w-4 h-4 text-red-500" /> : ls.type === 'quiz' ? <CheckCircle className="w-4 h-4 text-purple-500" /> : <FileText className="w-4 h-4 text-blue-500" />}
                              <span className="text-sm text-gray-800 line-clamp-2">{ls.title}</span>
                            </div>
                            {st.completed[idx] && <CheckCircle className="w-4 h-4 text-green-600" />}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{ls.duration} min</div>
                        </li>
                      ))}
                    </ul>
                  )
                })()}
              </div>

              <div className="col-span-9 h-full overflow-y-auto flex flex-col">
                {(() => {
                  const lessons = getLessons(selectedFormation)
                  const st = lessonState[selectedFormation._id] || { current: 0, completed: {} }
                  const percent = formationProgress[selectedFormation._id] || 0
                  const hasLessons = lessons.length > 0
                  const safeIndex = hasLessons ? Math.max(0, Math.min(lessons.length - 1, currentLessonIndex)) : 0
                  const current = hasLessons ? lessons[safeIndex] : null
                  
                  return (
                    <>
                      <div className="p-4 border-b flex-shrink-0">
                        <h3 className="text-xl font-bold text-gray-900">{selectedFormation.title}</h3>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-green-600 h-2.5 rounded-full transition-all" style={{ width: `${percent}%` }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{percent}%</span>
                            <span>{lessons.length} leçons</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 flex-1 overflow-auto">
                        {!hasLessons ? (
                          <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                            Aucun contenu disponible
                          </div>
                        ) : current.type === 'video' ? (
                          <div>
                            {(() => {
                              const url = current.payload.url || ''
                              const isYouTube = /youtu\.be|youtube\.com/.test(url)
                              if (!url) {
                                return (
                                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 mb-4">
                                    Aucune vidéo fournie
                                  </div>
                                )
                              }
                              if (isYouTube) {
                                // Build embed URL from various YouTube formats
                                let videoId = null
                                const idMatch = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/)
                                if (idMatch && idMatch[1]) {
                                  videoId = idMatch[1]
                                }
                                const embedUrl = videoId
                                  ? `https://www.youtube.com/embed/${videoId}`
                                  : url.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')
                                return (
                                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-black mb-4">
                                    <iframe
                                      src={embedUrl}
                                      title="YouTube video player"
                                      className="w-full h-full"
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                      allowFullScreen
                                    />
                                  </div>
                                )
                              }
                              return (
                                <video controls className="w-full max-h-[60vh] rounded-lg bg-black mb-4">
                                  <source src={url} type="video/mp4" />
                                  Votre navigateur ne supporte pas la vidéo HTML5.
                                </video>
                              )
                            })()}
                            {current.payload.thumbnail && (
                              <img src={current.payload.thumbnail} alt="Aperçu" className="w-full rounded-lg mt-4" />
                            )}
                          </div>
                        ) : current.type === 'article' ? (
                          <article className="prose max-w-none">
                            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed mb-6">
                              {current.payload.text}
                            </div>
                            {current.payload.images && current.payload.images.length > 0 && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                {current.payload.images.map((img, idx) => (
                                  <img 
                                    key={idx} 
                                    src={img} 
                                    alt={`Illustration ${idx + 1}`} 
                                    className="w-full rounded-lg shadow-md"
                                  />
                                ))}
                              </div>
                            )}
                          </article>
                        ) : current.type === 'quiz' ? (
                          <div>
                            <h4 className="text-lg font-semibold mb-4">Quiz d'évaluation</h4>
                            <div className="space-y-4">
                              {current.payload.questions.map((q, qi) => {
                                const selected = (quizAnswers[selectedFormation._id] || {})[qi]
                                return (
                                  <div key={qi} className="border rounded-lg p-4 bg-gray-50">
                                    <div className="font-medium text-gray-800 mb-3">{qi + 1}. {q.question}</div>
                                    <div className="space-y-2">
                                      {q.choices.map((choice, ci) => (
                                        <label key={ci} className="flex items-center gap-2 text-gray-700 cursor-pointer hover:bg-white p-2 rounded">
                                          <input
                                            type="radio"
                                            name={`q-${qi}`}
                                            checked={selected === ci}
                                            onChange={() => selectQuizAnswer(selectedFormation._id, qi, ci)}
                                            className="w-4 h-4 text-green-600"
                                          />
                                          <span>{choice}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                            <div className="mt-6 flex items-center gap-3">
                              <button
                                onClick={() => submitQuiz(selectedFormation._id, currentLessonIndex, current.payload.questions)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                              >
                                Valider le quiz
                              </button>
                              {quizResults[selectedFormation._id] && (
                                <div className={`text-sm font-medium px-4 py-2 rounded-lg ${
                                  quizResults[selectedFormation._id].percent >= 70 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-orange-100 text-orange-800'
                                }`}>
                                  Score: {quizResults[selectedFormation._id].correct}/{quizResults[selectedFormation._id].total} ({quizResults[selectedFormation._id].percent}%)
                                </div>
                              )}
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <div className="p-4 border-t flex items-center justify-between gap-2 flex-shrink-0 bg-gray-50">
                        <button 
                          disabled={!hasLessons || safeIndex <= 0} 
                          onClick={() => goToLesson(selectedFormation._id, lessons, safeIndex - 1)} 
                          className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${
                            !hasLessons || safeIndex <= 0 
                              ? 'text-gray-400 cursor-not-allowed border-gray-200' 
                              : 'text-gray-700 hover:bg-white border-gray-300'
                          }`}
                        >
                          <ChevronLeft className="w-4 h-4" /> Précédent
                        </button>
                        <div className="flex items-center gap-2">
                          {hasLessons && !st.completed[safeIndex] && (
                            <button 
                              onClick={() => markLessonCompleted(selectedFormation._id, safeIndex)} 
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                            >
                              Marquer comme terminé
                            </button>
                          )}
                          {hasLessons && st.completed[safeIndex] && (
                            <span className="text-sm text-green-600 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" /> Terminé
                            </span>
                          )}
                        </div>
                        <button 
                          disabled={!hasLessons || safeIndex >= lessons.length - 1} 
                          onClick={() => goToLesson(selectedFormation._id, lessons, safeIndex + 1)} 
                          className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${
                            !hasLessons || safeIndex >= lessons.length - 1 
                              ? 'text-gray-400 cursor-not-allowed border-gray-200' 
                              : 'text-gray-700 hover:bg-white border-gray-300'
                          }`}
                        >
                          Suivant <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </ProducerLayout>
  )
}

export default ProducerFormations