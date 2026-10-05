/**
 * TypePaws - Long Paragraphs Dataset
 * Curated long-form stories, essays, and articles unlocked after completing all 100 Beginner lessons.
 */

const LONG_PARAGRAPHS = [
  {
    id: "p_1",
    title: "The Whispering Library of Barnaby the Cat",
    category: "Whimsical Stories",
    length: "Medium (145 words)",
    text: "Deep inside the sunlit attic of an ancient brick townhouse, Barnaby the ginger cat presided over what he considered the finest collection of literature in the entire feline world. Shelves crafted from fragrant cedar wood stretched from floor to ceiling, housing leather-bound volumes on the history of sunbeams, the aerodynamic flight patterns of colorful garden butterflies, and the subtle philosophy of prolonged midday naps. Every afternoon, as the grandfather clock chimed three times, Barnaby would leap gracefully onto his favorite velvet armchair, adjust his imaginary reading spectacles, and gaze with profound contemplation upon the rhythmic tapping of the antique typewriter on the wooden writing desk. To Barnaby, every clatter of the keyboard was a tiny musical note composing a symphony of human thoughts, and he listened with unblinking curiosity until the golden twilight faded into night."
  },
  {
    id: "p_2",
    title: "The Legend of the Mechanical Keyboard",
    category: "Tech History",
    length: "Medium (155 words)",
    text: "In the bustling summer of 1868, Christopher Latham Sholes patented what would become the cornerstone of modern digital communication: the commercial typewriter. Facing the persistent mechanical dilemma of typewriter metal bars tangling together when rapid typists struck adjacent keys in quick succession, Sholes carefully analyzed letter frequencies in the English language. His ingenious solution was the QWERTY layout, designed to deliberately distribute high-frequency digraphs across opposite sides of the keyboard mechanism. Although electronic keyboards eventually replaced metal hammers with digital capacitive switches and laser optics, the legendary QWERTY layout endured through centuries. Today, millions of writers, software developers, and passionate touch typists tap upon mechanical switches with calibrated tactile bumps, finding soothing acoustic satisfaction in the crisp, rhythmic cadence that connects human imagination directly to glowing monitors across the globe."
  },
  {
    id: "p_3",
    title: "The Gentle Giant of the Kelp Forest",
    category: "Nature & Animals",
    length: "Medium (140 words)",
    text: "Beneath the undulating turquoise waves of the Pacific coastline lies an underwater wonderland of towering giant kelp forests. Swaying gracefully with the cold oceanic currents, these marine towers provide sanctuary to sea otters, one of nature's most endearing creatures. Wrapped securely in kelp fronds so they do not drift away into the open sea while napping, otters float comfortably on their backs, holding hands in peaceful companion rafts. They possess the densest fur in the animal kingdom, with nearly one million hairs per square inch, keeping them completely dry in frigid waters. Using smooth ocean pebbles placed upon their bellies as natural anvils, they crack open hard clam shells with remarkable dexterity, proving that gentle curiosity and clever tool use flourish beneath the sunlit ocean canopy."
  },
  {
    id: "p_4",
    title: "Camus on Inner Summer & Resilience",
    category: "Philosophy & Literature",
    length: "Long (170 words)",
    text: "In the midst of winter, when freezing gales stripped the bare branches and frozen shadows stretched long across the stone courtyard, I finally discovered that within my deepest consciousness there lay an invincible summer. It is during our most formidable challenges that our genuine human spirit awakens from silent slumber. We often search for tranquility in distant lands, across boundless oceans, and within the fleeting applause of external crowds, only to realize that true composure resides within our own disciplined minds. The practice of persistent craftsmanship, whether carving marble, composing poetic verses, or training one's fingers to dance across letters without faltering, teaches us that mastery is not a destination of sudden fortune. It is an unhurried, faithful pilgrimage composed of thousand quiet moments, where each focused effort builds an unshakeable citadel of inner strength, impervious to the howling tempests of doubt."
  },
  {
    id: "p_5",
    title: "The Symphony of Deep Space Exploration",
    category: "Science & Cosmos",
    length: "Long (180 words)",
    text: "On a serene autumn evening in 1977, Voyager 1 launched into the celestial dark, carrying aboard its modest golden phonograph record the greetings of Earth in fifty-five languages, the songs of humpback whales, and the evocative music of Beethoven. Decades later, having crossed the invisible threshold of the heliopause into the uncharted expanse of interstellar space, the solitary voyager continues to whisper faint radio telemetry back across billions of kilometers of silent vacuum. Looking back toward the inner solar system, its cameras captured a fragile, solitary pale blue dot suspended within a radiant beam of scattered sunlight. That minute pixel, as astronomer Carl Sagan beautifully observed, is home to every person we have ever loved, every idea we have ever conceived, and every dream we have ever pursued. In the grand tapestry of cosmic time, our journey has barely begun, yet our curiosity illuminates the infinite dark."
  }
];

if (typeof window !== 'undefined') {
  window.LONG_PARAGRAPHS = LONG_PARAGRAPHS;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LONG_PARAGRAPHS;
}
