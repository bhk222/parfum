import { useState, ChangeEvent } from 'react';

const etapes = [
  {
    titre: "Définir le concept",
    description: "Choisissez le style et l’inspiration de votre parfum (ex: frais, boisé, floral, oriental…).",
    question: "Quel est le style ou l’émotion que vous souhaitez transmettre ?",
    inputType: "text",
    suggestion: "Astuce IA : Inspirez-vous d’un souvenir, d’un lieu ou d’une saison. Exemples : Fraîcheur printanière, élégance boisée, énergie citronnée."
  },
  {
    titre: "Sélectionner les matières premières",
    description: "Listez les huiles essentielles et absolues disponibles. Classez-les par familles olfactives.",
    question: "Quelles matières premières souhaitez-vous utiliser ?",
    inputType: "textarea",
    suggestion: "Suggestion IA : Pour un parfum frais, privilégiez citron, menthe, eucalyptus. Pour un boisé, pensez cyprès, oliban, bois de santal."
  },
  {
    titre: "Créer la pyramide olfactive",
    description: "Définissez les notes de tête, cœur et fond pour structurer votre parfum.",
    question: "Comment répartir vos ingrédients entre tête, cœur et fond ?",
    inputType: "textarea",
    suggestion: "Astuce IA : Notes de tête (agrumes, aromates), cœur (fleurs, épices), fond (bois, résines, muscs). Ex : Citron en tête, ylang-ylang en cœur, oliban en fond."
  },
  {
    titre: "Élaborer la formule",
    description: "Définissez les pourcentages de chaque ingrédient en respectant la sécurité.",
    question: "Indiquez les proportions de chaque ingrédient :",
    inputType: "textarea",
    suggestion: "Recommandation IA : Tête 20-30%, cœur 30-40%, fond 30-40%. Respectez les limites IFRA pour chaque matière."
  },
  {
    titre: "Mélanger et tester",
    description: "Préparez un essai, laissez reposer et testez la senteur, la qualité et la longévité.",
    question: "Avez-vous réalisé un essai ? Quelles sont vos premières impressions ?",
    inputType: "textarea",
    suggestion: "Conseil IA : Notez la première impression, la tenue après 1h, 4h, 8h. Testez sur mouillette et peau."
  },
  {
    titre: "Ajuster la formule",
    description: "Modifiez la formule selon les résultats des tests.",
    question: "Quels ajustements souhaitez-vous apporter ?",
    inputType: "textarea",
    suggestion: "Astuce IA : Si le parfum manque de fraîcheur, augmentez les agrumes. Pour plus de tenue, renforcez les notes de fond."
  },
  {
    titre: "Finaliser et conditionner",
    description: "Préparez la version finale et embouteillez.",
    question: "Votre parfum est-il prêt à être conditionné ?",
    inputType: "text",
    suggestion: "Conseil IA : Utilisez un flacon propre, opaque si possible. Filtrez le mélange pour éliminer les impuretés."
  },
  {
    titre: "Créer la fiche technique",
    description: "Documentez la formule, les ingrédients et les conseils d’utilisation.",
    question: "Voulez-vous générer la fiche technique ?",
    inputType: "checkbox",
    suggestion: "Astuce IA : Indiquez la composition, les propriétés olfactives, les précautions et la date de création."
  }
];

export default function AssistantParfum() {
  const [etape, setEtape] = useState<number>(0);
  const [reponses, setReponses] = useState<Record<number, string | boolean>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.type === 'checkbox') {
      setReponses({ ...reponses, [etape]: (e.target as HTMLInputElement).checked });
    } else {
      setReponses({ ...reponses, [etape]: e.target.value });
    }
  };

  const handleNext = () => {
    if (etape < etapes.length - 1) setEtape(etape + 1);
  };

  const handlePrev = () => {
    if (etape > 0) setEtape(etape - 1);
  };

  const current = etapes[etape];

  return (
    <div style={{ maxWidth: 600, margin: 'auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #ccc', padding: 24 }}>
      <h2>Assistant de conception de parfum</h2>
      <h3>{current.titre}</h3>
      <p>{current.description}</p>
      <div style={{ background:'#eaf7fa', padding:'8px 12px', borderRadius:6, marginBottom:12, fontStyle:'italic', color:'#2a4d5c' }}>
        {current.suggestion}
      </div>
      <label style={{ fontWeight: 'bold' }}>{current.question}</label>
      {current.inputType === 'text' && (
        <input type="text" value={typeof reponses[etape] === 'string' ? reponses[etape] as string : ''} onChange={handleChange} style={{ width: '100%', margin: '12px 0', padding: 8 }} />
      )}
      {current.inputType === 'textarea' && (
        <textarea value={typeof reponses[etape] === 'string' ? reponses[etape] as string : ''} onChange={handleChange} style={{ width: '100%', margin: '12px 0', padding: 8, minHeight: 60 }} />
      )}
      {current.inputType === 'checkbox' && (
        <input type="checkbox" checked={!!reponses[etape]} onChange={handleChange} />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <button onClick={handlePrev} disabled={etape === 0}>Précédent</button>
        <span>Étape {etape + 1} / {etapes.length}</span>
        <button onClick={handleNext} disabled={etape === etapes.length - 1}>Suivant</button>
      </div>
    </div>
  );
}
