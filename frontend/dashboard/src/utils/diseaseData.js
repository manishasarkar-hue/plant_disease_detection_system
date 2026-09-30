/**
 * PlantGuard AI - Disease Knowledge & Class Label Formatter
 * Provides user-friendly disease names, scientific taxonomy, symptoms,
 * and care protocols for the 15 model classification classes.
 */

export const DISEASE_METADATA = {
  Pepper__bell___Bacterial_spot: {
    crop: 'Bell Pepper',
    diseaseName: 'Pepper Bell — Bacterial Spot',
    scientificName: 'Xanthomonas campestris pv. vesicatoria',
    severity: 'severe',
    status: 'Infected',
    isHealthy: false,
    symptoms: [
      'Small, circular to angular water-soaked dark brown spots on foliage.',
      'Lesions enlarge with yellow chlorotic halos, leading to severe leaf drop.',
      'Blister-like rough brown corky lesions developing on pepper fruit surface.'
    ],
    organicCare: [
      'Apply fixed copper or Bordeaux mixture spray in early morning hours.',
      'Remove and destroy heavily blighted lower leaves with sanitized shears.',
      'Dust foliage with bio-fungicide (Bacillus subtilis or Trichoderma viride).'
    ],
    chemicalCare: [
      'Foliar spray with Copper Oxychloride 50 WP (2.5g/L) combined with Mancozeb.',
      'Alternate with Streptomycin sulfate formulations where locally registered.'
    ],
    prevention: 'Use certified disease-free seeds. Avoid overhead irrigation to minimize leaf moisture.'
  },

  Pepper__bell___healthy: {
    crop: 'Bell Pepper',
    diseaseName: 'Healthy & Disease-Free',
    scientificName: 'Capsicum annuum',
    severity: 'healthy',
    status: 'Healthy',
    isHealthy: true,
    symptoms: [
      'Vibrant uniform deep green chlorophyll distribution across veins.',
      'Smooth, intact leaf margins with zero fungal spot lesions or chlorosis.',
      'Turgid cellular structure with robust photosynthetic leaf efficiency.'
    ],
    organicCare: [
      'Maintain standard organic seaweed extract foliar spray every 14 days.',
      'Ensure balanced nitrogen-phosphorus-potassium (NPK) compost top-dressing.',
      'Companion planting with marigolds to deter soil nematodes and aphids.'
    ],
    chemicalCare: [
      'No chemical fungicide intervention required for healthy foliage.',
      'Continue routine preventative micronutrient booster (Zinc + Boron).'
    ],
    prevention: 'Optimal moisture retention at 60-70% field capacity. Routine scouting once weekly.'
  },

  Potato___Early_blight: {
    crop: 'Potato',
    diseaseName: 'Potato Early Blight',
    scientificName: 'Alternaria solani',
    severity: 'moderate',
    status: 'Infected',
    isHealthy: false,
    symptoms: [
      'Dark brown to black necrotic spots with characteristic concentric "target" rings.',
      'Chlorotic yellow margins surrounding expanding target lesions.',
      'Premature leaf senescence starting from older bottom leaves upward.'
    ],
    organicCare: [
      'Apply cold-pressed Neem Oil spray (5ml/L) or copper soap bio-fungicide.',
      'Remove and safely dispose of all diseased lower canopy leaves.',
      'Incorporate bio-control agents (Bacillus amyloliquefaciens) into root zone.'
    ],
    chemicalCare: [
      'Foliar spray with Mancozeb 75 WP (2g/L) or Chlorothalonil before canopy closure.',
      'Rotate with Azoxystrobin (0.5ml/L) to prevent chemical resistance.'
    ],
    prevention: 'Practice 3-year crop rotation with non-solanaceous crops. Deep straw mulching to block soil splash.'
  },

  Potato___Late_blight: {
    crop: 'Potato',
    diseaseName: 'Potato Late Blight',
    scientificName: 'Phytophthora infestans',
    severity: 'severe',
    status: 'Infected',
    isHealthy: false,
    symptoms: [
      'Water-soaked dark lesions rapidly expanding across leaf margins and petioles.',
      'White downy fungal mildew growth visible on leaf undersides in high humidity.',
      'Foul odor and sudden collapse of potato canopy vine foliage.'
    ],
    organicCare: [
      'Immediately prune and burn heavily infected foliage to prevent tuber contamination.',
      'Apply copper sulfate + hydrated lime (Bordeaux mixture 1%) thoroughly.',
      'Hill up potato rows with extra soil to shield subsurface tubers from wash-in spores.'
    ],
    chemicalCare: [
      'Spray systemic Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ @ 2.5g/L).',
      'Follow up with Cymoxanil 8% + Mancozeb 64% WP after 7 days if wet weather continues.'
    ],
    prevention: 'Plant certified blight-free seed tubers. Avoid overhead irrigation during cooler evening temps.'
  },

  Potato___healthy: {
    crop: 'Potato',
    diseaseName: 'Healthy & Disease-Free',
    scientificName: 'Solanum tuberosum',
    severity: 'healthy',
    status: 'Healthy',
    isHealthy: true,
    symptoms: [
      'Lush, uniformly green compound leaves without necrotic spotting.',
      'Strong stem vigor with intact cuticle layer and normal leaf expansion.',
      'Zero evidence of fungal sporulation, mildew, or bacterial wilt.'
    ],
    organicCare: [
      'Continue balanced potassium-rich organic fertilizers for tuber development.',
      'Apply compost tea foliar spray to fortify natural leaf microflora.'
    ],
    chemicalCare: [
      'No chemical fungicide intervention required for healthy potato plants.',
      'Maintain standard preventative mineral nutrition.'
    ],
    prevention: 'Ensure uniform soil moisture and hill soil around base to shield developing tubers.'
  },

  Tomato_Bacterial_spot: {
    crop: 'Tomato',
    diseaseName: 'Tomato Bacterial Spot',
    scientificName: 'Xanthomonas perforans',
    severity: 'severe',
    status: 'Infected',
    isHealthy: false,
    symptoms: [
      'Small, circular dark brown spots with translucent greasy halos on foliage.',
      'Severe blighting, leaf yellowing, and premature foliage loss.',
      'Black elevated scab-like pustules on developing tomato fruits.'
    ],
    organicCare: [
      'Foliar spray with fixed copper bactericides combined with Bacillus subtilis.',
      'Prune off heavily infected lower foliage on dry sunny days only.',
      'Apply potassium silicate sprays to strengthen leaf cuticle resistance.'
    ],
    chemicalCare: [
      'Apply Copper Hydroxide combined with Mancozeb for synergistic bacterial knockdown.',
      'Use Kasugamycin formulations where approved for agricultural use.'
    ],
    prevention: 'Use disease-free certified seeds. Avoid working with plants while foliage is wet.'
  },

  Tomato_Early_blight: {
    crop: 'Tomato',
    diseaseName: 'Tomato Early Blight',
    scientificName: 'Alternaria solani',
    severity: 'moderate',
    status: 'Infected',
    isHealthy: false,
    symptoms: [
      'Dark brown to black necrotic spots with concentric ring "target" pattern.',
      'Chlorosis (yellowing) surrounding older bottom foliage.',
      'Premature leaf drop leading to exposed sunscald on fruits.'
    ],
    organicCare: [
      'Apply cold-pressed Neem Oil spray (5ml/L) in early morning hours.',
      'Remove and safely dispose of all diseased lower canopy leaves.',
      'Dust with organic bio-fungicide (Trichoderma viride or Bacillus subtilis).'
    ],
    chemicalCare: [
      'Foliar spray with Copper Oxychloride 50 WP @ 2.5g per Liter of water.',
      'Alternate with Mancozeb 75 WP (2g/L) every 7-10 days during rainy weather.',
      'Avoid continuous single-action fungicides to prevent resistance.'
    ],
    prevention: 'Maintain drip irrigation to keep foliage dry. Mulch soil around base to stop soil-splash spore transmission.'
  },

  Tomato_Late_blight: {
    crop: 'Tomato',
    diseaseName: 'Tomato Late Blight',
    scientificName: 'Phytophthora infestans',
    severity: 'severe',
    status: 'Infected',
    isHealthy: false,
    symptoms: [
      'Large, irregular water-soaked greasy olive-brown lesions on leaves and stems.',
      'Delicate white fungal down visible on leaf undersides in wet, cool conditions.',
      'Rapid canopy wilt and brown leathery decay on developing fruits.'
    ],
    organicCare: [
      'Immediately remove and dispose of infected plants in sealed bags (do not compost).',
      'Apply preventative copper hydroxide sprays before humid, overcast rain events.',
      'Maximize plant spacing to accelerate canopy drying after rain.'
    ],
    chemicalCare: [
      'Apply Dimethomorph 50 WP (1g/L) or Famoxadone + Cymoxanil.',
      'Foliar spray with Mefenoxam + Mancozeb (Ridomil Gold) at first confirmation.'
    ],
    prevention: 'Ensure minimum 60cm plant spacing. Never irrigate overhead in the evening.'
  },

  Tomato_Leaf_Mold: {
    crop: 'Tomato',
    diseaseName: 'Tomato Leaf Mold',
    scientificName: 'Passalora fulva',
    severity: 'mild',
    status: 'Infected',
    isHealthy: false,
    symptoms: [
      'Pale green to yellowish indistinct patches on upper leaf surfaces.',
      'Olive-green to velvety brown mold growth on lower leaf surfaces.',
      'Foliage curls, withers, and drops prematurely in high humidity.'
    ],
    organicCare: [
      'Maximize greenhouse/polyhouse ventilation to keep relative humidity below 85%.',
      'Spray potassium bicarbonate or copper octanoate solution.',
      'Prune bottom foliage to promote cross-ventilation.'
    ],
    chemicalCare: [
      'Apply Chlorothalonil 75 WP or Thiophanate-methyl if severe in protected structures.'
    ],
    prevention: 'Maintain warm dry leaf surfaces. Use drip irrigation and space plants generously.'
  },

  Tomato_Septoria_leaf_spot: {
    crop: 'Tomato',
    diseaseName: 'Tomato Septoria Leaf Spot',
    scientificName: 'Septoria lycopersici',
    severity: 'moderate',
    status: 'Infected',
    isHealthy: false,
    symptoms: [
      'Numerous small circular spots (2-3mm) with ash-gray centers and dark borders.',
      'Tiny black pycnidia spore dots visible inside lesion centers under magnification.',
      'Leaves turn completely yellow, wither, and fall, exposing fruit to sunscald.'
    ],
    organicCare: [
      'Remove infected bottom leaves at the earliest sign of spotting.',
      'Apply biological fungicides containing Bacillus subtilis.',
      'Mulch heavily around base of tomato vines to prevent soil-to-leaf splashing.'
    ],
    chemicalCare: [
      'Apply Mancozeb 75 WP (2g/L) or Chlorothalonil at 7 to 10-day intervals.',
      'Spray Difenoconazole 25 EC during severe disease pressure.'
    ],
    prevention: 'Rotate tomatoes on a 2-year cycle away from solanaceous nightshades. Destroy crop debris in autumn.'
  },

  Tomato_Spider_mites_Two_spotted_spider_mite: {
    crop: 'Tomato',
    diseaseName: 'Tomato Two-Spotted Spider Mite',
    scientificName: 'Tetranychus urticae',
    severity: 'moderate',
    status: 'Infected',
    isHealthy: false,
    symptoms: [
      'Fine golden-yellow stippling and speckling across upper leaf surfaces.',
      'Delicate silky webbing spanning the undersides of leaves and growing terminals.',
      'Leaves turn yellow, bronze, and desiccate under heavy mite populations.'
    ],
    organicCare: [
      'Introduce biological predators such as Phytoseiulus persimilis predatory mites.',
      'Spray cold water or organic insecticidal potassium soap on leaf undersides.',
      'Apply horticultural neem oil (5ml/L) focusing thoroughly on foliage undersides.'
    ],
    chemicalCare: [
      'Apply Abamectin 1.8 EC (0.5ml/L) or Spiromesifen 22.9 SC.',
      'Rotate chemical classes to prevent rapid acaricide resistance.'
    ],
    prevention: 'Avoid excessive nitrogen fertilization. Maintain humidity during hot dry periods.'
  },

  Tomato__Target_Spot: {
    crop: 'Tomato',
    diseaseName: 'Tomato Target Spot',
    scientificName: 'Corynespora cassiicola',
    severity: 'moderate',
    status: 'Infected',
    isHealthy: false,
    symptoms: [
      'Brown, pinpoint circular lesions that expand into target-like concentric rings.',
      'Extensive chlorosis surrounding lesions causing premature canopy defoliation.',
      'Sunken brown circular lesions with dark margins on mature fruit.'
    ],
    organicCare: [
      'Prune lower leaves to enhance sunlight penetration and rapid foliage drying.',
      'Spray copper hydroxide or copper soap preventive fungicides.',
      'Remove and burn infected residue after harvest.'
    ],
    chemicalCare: [
      'Apply Azoxystrobin 23 SC (1ml/L) or Pyraclostrobin.',
      'Alternate with Chlorothalonil to manage resistance.'
    ],
    prevention: 'Maintain drip irrigation and avoid wetting plant foliage. Eliminate nearby volunteer weeds.'
  },

  Tomato__Tomato_YellowLeaf__Curl_Virus: {
    crop: 'Tomato',
    diseaseName: 'Tomato Yellow Leaf Curl Virus',
    scientificName: 'TYLCV (Begomovirus)',
    severity: 'severe',
    status: 'Infected',
    isHealthy: false,
    symptoms: [
      'Pronounced upward curling and cupping of leaflet margins.',
      'Severe interveinal chlorosis (yellowing) with stunted apical growth.',
      'Bushy stunted plant habit with heavy flower abortion and negligible fruit set.'
    ],
    organicCare: [
      'Immediately rogue out and destroy infected viral plants (they cannot be cured).',
      'Install 50-mesh fine insect exclusion netting in nursery beds.',
      'Deploy yellow sticky insect traps (1 trap per 15m²) to catch whitefly vectors.'
    ],
    chemicalCare: [
      'Control the Bemisia tabaci whitefly vector with Imidacloprid 17.8 SL (0.3ml/L).',
      'Alternate with Acetamiprid 20 SP or Pyriproxyfen.'
    ],
    prevention: 'Plant TYLCV-resistant tomato hybrids. Establish clean whitefly-free seedlings under protected netting.'
  },

  Tomato__Tomato_mosaic_virus: {
    crop: 'Tomato',
    diseaseName: 'Tomato Mosaic Virus',
    scientificName: 'ToMV (Tobamovirus)',
    severity: 'moderate',
    status: 'Infected',
    isHealthy: false,
    symptoms: [
      'Mottled alternating light and dark green mosaic patterns on foliage.',
      'Distorted, crinkled leaflets with distinctive "shoestring" or fern-like narrowing.',
      'Uneven fruit color development with internal brown necrotic vascular ring.'
    ],
    organicCare: [
      'Rogue out and burn infected plants immediately to prevent mechanical transmission.',
      'Sanitize all hands, tools, and stakes in 20% nonfat dry milk or 10% trisodium phosphate.',
      'Strictly prohibit tobacco smoking or handling near tomato crop stands.'
    ],
    chemicalCare: [
      'No chemical viricide exists; control relies entirely on strict mechanical hygiene and sanitation.'
    ],
    prevention: 'Plant ToMV-resistant cultivars. Use certified virus-free seed treated with dry heat.'
  },

  Tomato_healthy: {
    crop: 'Tomato',
    diseaseName: 'Healthy & Disease-Free',
    scientificName: 'Solanum lycopersicum',
    severity: 'healthy',
    status: 'Healthy',
    isHealthy: true,
    symptoms: [
      'Uniform emerald green coloration without chlorotic patches or spots.',
      'Intact leaf margins and healthy glandular trichome hairs.',
      'Active apical growth, normal flowering trusses, and vigorous fruit development.'
    ],
    organicCare: [
      'Continue balanced organic fertilizing with compost tea or fish emulsion.',
      'Maintain consistent soil moisture through scheduled drip irrigation.',
      'Mulch soil to retain root coolness and suppress weed competition.'
    ],
    chemicalCare: [
      'No chemical intervention needed for disease-free foliage.',
      'Maintain standard preventative calcium-magnesium foliar nutrition.'
    ],
    prevention: 'Continue routine leaf scouting once a week. Stake plants for aeration and support.'
  }
};

/**
 * Format a raw model class label into a clean, human-readable format.
 * Examples:
 *   - "Tomato_Early_blight" -> "Tomato Early Blight"
 *   - "Pepper__bell___Bacterial_spot" -> "Pepper Bell — Bacterial Spot"
 *   - "Tomato__Tomato_YellowLeaf__Curl_Virus" -> "Tomato Yellow Leaf Curl Virus"
 *   - "Tomato_healthy" -> "Tomato Healthy"
 */
export function formatClassName(rawClassName) {
  if (!rawClassName) return 'Unknown Plant';
  if (DISEASE_METADATA[rawClassName]) {
    return DISEASE_METADATA[rawClassName].diseaseName;
  }

  // Fallback cleaner
  return rawClassName
    .replace(/___/g, ' — ')
    .replace(/__/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Get comprehensive disease information for a predicted class.
 * Falls back to structured defaults if an unknown class is encountered.
 */
export function getDiseaseDetails(className, confidence = 1.0) {
  const meta = DISEASE_METADATA[className];
  const isHealthy = className ? className.toLowerCase().includes('healthy') : false;

  if (meta) {
    return {
      ...meta,
      rawClassName: className,
      confidence: typeof confidence === 'number' ? Math.round(confidence * 1000) / 10 : 95.0,
      confidenceDecimal: confidence
    };
  }

  // Generic fallback for unmapped classes
  const formatted = formatClassName(className);
  const parts = formatted.split('—').map(s => s.trim());
  const crop = parts[0] || 'Plant';
  const condition = parts[1] || parts[0] || 'Condition';

  return {
    crop,
    diseaseName: formatted,
    scientificName: `${crop} species`,
    severity: isHealthy ? 'healthy' : 'moderate',
    status: isHealthy ? 'Healthy' : 'Infected',
    isHealthy,
    rawClassName: className,
    confidence: typeof confidence === 'number' ? Math.round(confidence * 1000) / 10 : 95.0,
    confidenceDecimal: confidence,
    symptoms: isHealthy
      ? ['Uniform foliage coloration with healthy cellular structure.']
      : ['Leaf discoloration or lesion pattern identified by neural classifier.'],
    organicCare: isHealthy
      ? ['Maintain regular watering and compost nutrition.']
      : ['Prune visibly affected leaves and apply neem oil.'],
    chemicalCare: isHealthy
      ? ['No chemical treatment required.']
      : ['Consult your local agricultural extension service for registered fungicides.'],
    prevention: 'Maintain clean tools, proper plant spacing, and drip irrigation.'
  };
}
