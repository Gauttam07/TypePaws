/**
 * TypePaws - Comprehensive Lessons Dataset
 * Contains 100 numbered practice lessons for each of the 3 Learning Paths:
 * - Beginner (Lessons 1-100): Basics to advanced typing
 * - Intermediate (Lessons 1-100): Intermediate skills to advanced typing
 * - Advanced (Lessons 1-100): Advanced typing to fluent blind touch typing
 */

const LESSONS_DATA = {
  beginner: {
    name: "Beginner: Kitten Steps",
    subtitle: "From home row keys to smooth everyday typing",
    icon: "🐾",
    color: "#4ade80",
    sections: [
      { id: 1, title: "Section 1: Home Row Foundations", range: "Lessons 1-20", desc: "Master the anchor keys: ASDF and JKL;" },
      { id: 2, title: "Section 2: Upper Row Odyssey", range: "Lessons 21-40", desc: "Reach up to QWERTY and UIOP without looking down" },
      { id: 3, title: "Section 3: Lower Row Leap", range: "Lessons 41-60", desc: "Slide down to ZXCVB and NM,./ with confidence" },
      { id: 4, title: "Section 4: Shift & Capitalization Safari", range: "Lessons 61-80", desc: "Two-handed Shift key coordination and punctuation" },
      { id: 5, title: "Section 5: Beginner Sentences & Fluency", range: "Lessons 81-100", desc: "Build smooth 25-35 WPM rhythm with natural English sentences" }
    ],
    lessons: []
  },
  intermediate: {
    name: "Intermediate: Cattitude Cruise",
    subtitle: "Speed, rhythm, numbers, punctuation, and smooth flow",
    icon: "⚡",
    color: "#38bdf8",
    sections: [
      { id: 1, title: "Section 1: Punctuation & Quotes Playground", range: "Lessons 1-20", desc: "Apostrophes, quotes, commas, colons, and dialogue" },
      { id: 2, title: "Section 2: Speed Drills & Common Digraphs", range: "Lessons 21-40", desc: "High-frequency letter clusters: tion, ment, ough, ing" },
      { id: 3, title: "Section 3: Number Row & Symbol Snapping", range: "Lessons 41-60", desc: "Top number row 1-0, percentages, dates, and money signs" },
      { id: 4, title: "Section 4: Rhythm, Cadence & Long Words", range: "Lessons 61-80", desc: "Multi-syllable vocabulary and unbroken typing momentum" },
      { id: 5, title: "Section 5: Real-World Paragraph Sprints", range: "Lessons 81-100", desc: "Fun stories, animal trivia, and realistic typing passages" }
    ],
    lessons: []
  },
  advanced: {
    name: "Advanced: Sonic Claws",
    subtitle: "Fluent touch typing without looking at the keyboard, code, & speed endurance",
    icon: "🔥",
    color: "#f43f5e",
    sections: [
      { id: 1, title: "Section 1: Tricky Finger Gymnastics", range: "Lessons 1-20", desc: "Awkward bigrams, alternating hand sequences, and tricky leaps" },
      { id: 2, title: "Section 2: Code, Symbols & Syntax", range: "Lessons 21-40", desc: "HTML, CSS, JavaScript, brackets, braces, and arrows" },
      { id: 3, title: "Section 3: Tongue Twisters & Lexical Sprint", range: "Lessons 41-60", desc: "Fast phonetic challenges, alliteration, and rapid reflex words" },
      { id: 4, title: "Section 4: Blind Touch-Typing Fluency", range: "Lessons 61-80", desc: "Strict muscle memory drills with zero backspacing hesitations" },
      { id: 5, title: "Section 5: Grandmaster Speed Marathon", range: "Lessons 81-100", desc: "Dense literature, complex essays, and 80-100+ WPM benchmarks" }
    ],
    lessons: []
  }
};

// Helper to generate curated lessons
(function buildAllLessons() {
  // === BEGINNER 100 LESSONS ===
  const bTexts = [
    // Sec 1: 1-20 (Home row)
    { t: "f j f j ff jj fff jjj fj jf f j f j ff jj", title: "F and J Anchors", focus: "f, j", desc: "Feel the bumps on F and J with your index fingers." },
    { t: "d k d k dd kk ddd kkk dk kd d k f j dk fj", title: "Middle Finger Harmony", focus: "d, k", desc: "Use your left middle finger for D and right middle finger for K." },
    { t: "s l s l ss ll sss lll sl ls as df jk l;", title: "Ring Finger Balance", focus: "s, l", desc: "Ring fingers rest on S and L. Keep palms relaxed." },
    { t: "a ; a ; aa ;; aaa ;;; a; ;a as df jk l;", title: "Pinky Foundations", focus: "a, ;", desc: "Your pinkies are quiet heroes. Rest them on A and semicolon." },
    { t: "asdf jkl; asdf jkl; fdsa ;lkj asdf jkl;", title: "Full Home Row Sweep", focus: "a s d f j k l ;", desc: "Slide fingers along the home row in steady rhythm." },
    { t: "g h g h gg hh fg jh gh hg f g h j fgh jhg", title: "Reaching G and H", focus: "g, h", desc: "Stretch index fingers inward: left index to G, right index to H." },
    { t: "asdfg hjkl; asdfg hjkl; gfdsa ;lkjh asdfg", title: "Complete Home Row Drill", focus: "all home row", desc: "All 10 home row keys working together." },
    { t: "fad dad lad glad fall hall half flash flag", title: "First Real Words", focus: "a, d, f, g, h, l, s", desc: "Type real words using only home row keys!" },
    { t: "ask dad as dad had a flag all salad flash", title: "Home Row Mini Sentences", focus: "home row words", desc: "Combine words with spacebar pressed by your thumb." },
    { t: "sad glad half glass flask dash shall fall", title: "Word Flow Workout", focus: "home row words", desc: "Focus on continuous tempo rather than rushing." },
    { t: "dad asked half a salad as all flags fall", title: "Home Row Story", focus: "home row words", desc: "Tell a cute home row story." },
    { t: "f j d k s l a ; g h a s d f g h j k l ;", title: "Home Row Symmetry", focus: "home row symmetry", desc: "Mirror left and right hand actions." },
    { t: "gas lag jag lad lash slag shad flash gal", title: "Speed Drill: Home Row", focus: "home row short words", desc: "Quick clean finger taps on home row." },
    { t: "a fall salad had glass and a glad flag", title: "Salad and Flags", focus: "home row fluency", desc: "Smooth transitions across all four fingers." },
    { t: "add half a glass as dad had said shall", title: "Rhythm Builder", focus: "home row precision", desc: "Steady metronome tempo without looking down." },
    { t: "ask a lad as a flash flags a sad salad", title: "Home Row Agility", focus: "home row agility", desc: "Keep wrists floating gently above the desk." },
    { t: "glad dad had half a flask of fresh milk", title: "Expanding Vocabulary", focus: "home row + e/r preview", desc: "Smooth transition into wider key reaches." },
    { t: "all lads had glad flags and flash sash", title: "Home Row Mastery I", focus: "home row review", desc: "Solidify home row anchors." },
    { t: "fall glass dash flash shall glad ask dad", title: "Home Row Mastery II", focus: "home row speed", desc: "Speed test for Section 1." },
    { t: "dad had a glass flask and half a salad", title: "Section 1 Milestone", focus: "Section 1 Final", desc: "Congratulations! You have mastered the home row!" },

    // Sec 2: 21-40 (Top row)
    { t: "r u r u rr uu fr ju rf uj r u fr ju rf", title: "Reaching R and U", focus: "r, u", desc: "Reach index fingers up: left to R, right to U." },
    { t: "e i e i ee ii de ki ed ik e i de ki ed", title: "Middle Finger Top Row", focus: "e, i", desc: "Middle fingers reach up: left to E, right to I." },
    { t: "w o w o ww oo sw lo ws ol w o sw lo ws", title: "Ring Finger Upper Reach", focus: "w, o", desc: "Ring fingers reach up: left to W, right to O." },
    { t: "q p q p qq pp aq ;p qa p; q p aq ;p qa", title: "Pinky Upper Reach", focus: "q, p", desc: "Pinkies reach up: left to Q, right to P." },
    { t: "t y t y tt yy ft jy tf yj t y ft jy tf", title: "Center Top Reach: T and Y", focus: "t, y", desc: "Index fingers reach up and inward to T and Y." },
    { t: "qwer tyuiop qwer tyuiop poiuyt rewq qwer", title: "Top Row Rainbow Sweep", focus: "top row", desc: "Float smoothly across the entire upper row." },
    { t: "red tree free quiet water write power pop", title: "Top Row Word Harvest", focus: "top row words", desc: "Common words built from upper and home row keys." },
    { t: "you were right to write your true story", title: "Fluid Sentence Step", focus: "home + top row", desc: "Combine home row stability with top row reaches." },
    { t: "two cats purr sweet soft warm fur today", title: "Cute Kitty Words", focus: "home + top row", desc: "Warm purring words for happy typing practice." },
    { t: "we walk out to the park to see the birds", title: "Park Walk Sentence", focus: "smooth reaches", desc: "Keep wrists level and fingers softly curved." },
    { t: "the quick brown fox jumped high up today", title: "The Classic Leaper", focus: "top row flow", desc: "An easy variation of the most famous typing drill." },
    { t: "every day we try to write pure great poetry", title: "Poetic Fingers", focus: "p, o, e, t, r, y", desc: "Gentle reaches up to the top row." },
    { t: "yellow puppy jumps over pretty pink water", title: "Puppy Jumps", focus: "p, y, u, w, o", desc: "Keep your eyes on the screen, not your fingers!" },
    { t: "keep your eyes wide open when you touch type", title: "Touch Typing Rule #1", focus: "touch typing habit", desc: "Trust your finger muscle memory." },
    { t: "our little white kitten likes warm sweet milk", title: "Warm Sweet Milk", focus: "w, e, i, t, y, u", desc: "Notice how quickly your hands find top keys now." },
    { t: "write quick notes with your proud soft paws", title: "Proud Soft Paws", focus: "q, w, r, t, y", desc: "Light, buoyant key strokes like paws on piano keys." },
    { t: "they went out to look at the bright blue sky", title: "Blue Sky Drill", focus: "top row fluency", desc: "Aim for zero pauses between letters." },
    { t: "people who practice typing grow faster daily", title: "Daily Practice Truth", focus: "top row speed", desc: "Consistency beats long rare sessions every time." },
    { t: "pure water poured quietly into the wide pot", title: "Quiet Water", focus: "p, q, w, r, t", desc: "Upper pinky and index coordination." },
    { t: "the little red squirrel hid twenty sweet nuts", title: "Section 2 Milestone", focus: "Section 2 Final", desc: "Mastery of home and top rows combined!" },

    // Sec 3: 41-60 (Lower row)
    { t: "v m v m vv mm fv jm vf mj v m fv jm vf", title: "Reaching V and M", focus: "v, m", desc: "Slide index fingers down: left to V, right to M." },
    { t: "c , c , cc ,, dc k, cd ,k c , dc k, cd", title: "Middle Finger Low Reach", focus: "c, comma", desc: "Middle fingers down: left to C, right to comma." },
    { t: "x . x . xx .. sx l. xs .l x . sx l. xs", title: "Ring Finger Low Reach", focus: "x, period", desc: "Ring fingers down: left to X, right to period." },
    { t: "z / z / zz // az ;/ za /; z / az ;/ za", title: "Pinky Low Reach", focus: "z, slash", desc: "Pinkies down: left to Z, right to forward slash." },
    { t: "b n b n bb nn fb jn bf nb b n fb jn bf", title: "Center Low: B and N", focus: "b, n", desc: "Stretch index fingers down to B and N." },
    { t: "zxcvb nm,./ zxcvb nm,./ /.,mn bvcxz zxcvb", title: "Bottom Row Full Glide", focus: "bottom row", desc: "Glide across the whole bottom row." },
    { t: "cat zoom box vine moon calm mix viz blank", title: "Bottom Row Words", focus: "bottom row vocabulary", desc: "Words featuring z, x, c, v, b, n, m." },
    { t: "my brown cat can climb very fast in trees.", title: "Climbing Cat Sentence", focus: "bottom row in context", desc: "Notice the period at the end! Tap with right ring finger." },
    { t: "the baby rabbit hopped over the mossy path.", title: "Baby Rabbit Path", focus: "b, v, m, p", desc: "Keep cadence smooth and relaxed." },
    { t: "brave men came back with boxes of fresh mint.", title: "Brave Mint Boxes", focus: "b, m, c, x", desc: "Feel each finger know its track." },
    { t: "a lazy zebra can make cozy jumps in the zoo.", title: "Lazy Zebra Zoo", focus: "z, x, c, v", desc: "Pinky precision on the Z key." },
    { t: "mix calm colors on the canvas to make art.", title: "Canvas Art", focus: "c, m, x, v", desc: "Smooth lower row transitions." },
    { t: "nice music makes every moment very cheerful.", title: "Cheerful Music", focus: "m, n, c, v", desc: "A sweet sentence for smooth fingers." },
    { t: "pack my box with five dozen vivid blue cups.", title: "Vivid Blue Cups", focus: "pangram elements", desc: "Touches almost every key on your keyboard." },
    { t: "the clever fox came back from the green maze.", title: "Green Maze", focus: "c, v, b, x, z", desc: "No looking at keys! Keep your eyes on the text." },
    { t: "six black ducks swim next to the wooden boat.", title: "Duck Pond", focus: "x, c, k, b, m", desc: "Steady strokes like water ripples." },
    { t: "baking brown cookies smells very delicious.", title: "Baking Cookies", focus: "b, c, k, v, m", desc: "Yum! Finger accuracy is getting sharp." },
    { t: "we climbed high mountains and saw many birds.", title: "High Mountains", focus: "m, n, c, b", desc: "Stretching fingers naturally without strain." },
    { t: "never look down while typing words on screen.", title: "Blind Touch Habit", focus: "muscle memory", desc: "Your hands already know where every key lives!" },
    { t: "the cozy cat napped calmly beside my warm mug.", title: "Section 3 Milestone", focus: "Section 3 Final", desc: "All three letter rows are now completely unlocked!" },

    // Sec 4: 61-80 (Shift & Capitalization)
    { t: "A S D F J K L ; A S D F J K L ; Apple Jump", title: "Left & Right Shift Keys", focus: "Shift keys", desc: "Use opposite hand Shift: hold Right Shift for A, Left Shift for J." },
    { t: "The Cat Sat On The Mat And Smiled At Me.", title: "Title Case Sentence", focus: "Opposite Shift", desc: "Opposite Shift keying ensures speed and comfort." },
    { t: "Barnaby, the curious cat, loves warm sunny naps.", title: "Commas and Names", focus: "Capital + Comma", desc: "Practice capitalizing proper names." },
    { t: "Where did the little puppy hide its chew toy?", title: "Question Marks", focus: "? mark reach", desc: "Hold Left Shift and tap forward slash for '?'." },
    { t: "Look at that lovely bird flying above the trees!", title: "Exclamation Point", focus: "! mark reach", desc: "Hold Right Shift and tap 1 for '!'." },
    { t: "London, Paris, Tokyo, and New York are big cities.", title: "Global Capitals", focus: "Capital cities", desc: "Rapid shift release and letter follow-through." },
    { t: "\"Practice makes progress,\" said the wise typing owl.", title: "Quote Marks Intro", focus: "Quotation marks", desc: "Hold Left Shift and tap apostrophe key for quotes." },
    { t: "Did Barnaby eat the tuna? Yes, he ate it all!", title: "Dialogue Sparks", focus: "? and ! together", desc: "Combine questions and excited answers." },
    { t: "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.", title: "Days of the Week", focus: "Repeated Capitals", desc: "Smooth alternating shift hands." },
    { t: "Hello World! Welcome to the playful typing academy.", title: "Hello World", focus: "Standard intro", desc: "A classic milestone for every keyboard enthusiast." },
    { t: "Keep calm, take a deep breath, and type with joy.", title: "Calm Mind", focus: "Commas and rhythm", desc: "Typing is like playing a soft musical instrument." },
    { t: "Cats have four paws, sharp whiskers, and soft fur.", title: "Cat Whiskers", focus: "List commas", desc: "Natural punctuation flow." },
    { t: "Can you type forty words every minute? You can!", title: "Goal Setting", focus: "Punctuation cadence", desc: "Believe in your typing paws!" },
    { t: "Pip the hamster runs fast on his little wheel.", title: "Pip the Hamster", focus: "Names and verbs", desc: "Meet Barnaby's energetic friend Pip!" },
    { t: "Bubbles the cheerful blob bounced up and down.", title: "Bubbles the Blob", focus: "Name capitalization", desc: "Meet Bubbles! Mascot friend #3." },
    { t: "\"Hooray!\" shouted the students. \"We did it!\"", title: "Double Quotes Dialogue", focus: "Quotes and Exclamation", desc: "Keep pinky relaxed on Shift." },
    { t: "Spring, Summer, Autumn, and Winter are lovely.", title: "Four Seasons", focus: "Capitalization rhythm", desc: "Feel the rhythmic cadence of capitalized words." },
    { t: "Always stretch your fingers after a long practice!", title: "Ergonomics Tip", focus: "Health & speed", desc: "Shake out your wrists and sit with good posture." },
    { t: "Are you ready to type full stories without pauses?", title: "Readiness Check", focus: "Fluency preparation", desc: "Almost ready for full speed sentences!" },
    { t: "Great job! Your keyboard confidence is shining bright.", title: "Section 4 Milestone", focus: "Section 4 Final", desc: "Section 4 conquered! You are ready for full fluency." },

    // Sec 5: 81-100 (Fluency & Full Sentences)
    { t: "The gentle morning breeze rustled the golden leaves in the quiet garden.", title: "Golden Garden", focus: "Fluency 25 WPM", desc: "Full natural English sentence. Maintain continuous flow." },
    { t: "A cup of warm chamomile tea is the best companion for evening reading.", title: "Evening Tea", focus: "Comfort cadence", desc: "Avoid bursts followed by stops; aim for steady speed." },
    { t: "Whimsical kittens love chasing playful sunbeams across the wooden floor.", title: "Sunbeam Chase", focus: "Smooth vocabulary", desc: "Let your fingers glide gracefully." },
    { t: "Reading wonderful books unlocks doors to magical worlds full of wonder.", title: "Magical Books", focus: "Sentence harmony", desc: "Focus on reading one or two words ahead of what you type." },
    { t: "Every small step of practice brings you closer to effortless touch typing.", title: "Effortless Steps", focus: "Consistency", desc: "Reading ahead is the secret to high typing speed!" },
    { t: "The baker kneaded the warm dough and placed the fresh loaves in the oven.", title: "Fresh Bread", focus: "Common word combos", desc: "Feel the comfortable bounce on the keys." },
    { t: "Curious otters hold paws while sleeping so they never float far away.", title: "Otter Facts", focus: "Fun facts", desc: "Did you know this cute otter trivia?" },
    { t: "Listen to the steady clatter of keys as your fingers dance with ease.", title: "Clatter of Keys", focus: "Rhythm awareness", desc: "Treat typing like making acoustic music." },
    { t: "A friendly smile can brighten someone's day faster than any sunshine.", title: "Bright Smiles", focus: "Everyday vocabulary", desc: "Wholesome phrases encourage happy fingers." },
    { t: "Butterflies taste sweet nectar with their tiny feet as they land softly.", title: "Butterfly Feet", focus: "Complex sentence", desc: "Focus on accuracy first; speed follows naturally." },
    { t: "The cozy fireplace crackled softly while rain tapped against the glass.", title: "Rainy Day Vibe", focus: "Sensory language", desc: "Relax your shoulders and breathe evenly." },
    { t: "Smart typists focus on accuracy because speed is the natural reward.", title: "The Golden Rule", focus: "Accuracy first", desc: "100% accuracy builds unbreakable muscle memory." },
    { t: "Never rush your keystrokes; let each letter land with crisp precision.", title: "Crisp Precision", focus: "Clean strokes", desc: "Each tap is clean, light, and confident." },
    { t: "A little brown owl watched the silent forest under a starry midnight sky.", title: "Midnight Owl", focus: "Descriptive flow", desc: "Notice how effortless top and bottom rows feel now." },
    { t: "Learning a new skill requires patience, curiosity, and a cheerful spirit.", title: "Patience and Curiosity", focus: "Polysyllabic words", desc: "Patience pays off in high WPM gains." },
    { t: "Barnaby the typing cat gave a satisfied purr and patted the spacebar.", title: "Barnaby's Spacebar", focus: "Character story", desc: "Barnaby is proud of your progress!" },
    { t: "The train whistled as it rolled through the lush green valley at dawn.", title: "Dawn Train", focus: "Fluid motion", desc: "Keep continuous typing tempo." },
    { t: "You have traveled from home row basics to full sentences with grace.", title: "Reflection Drill", focus: "Fluency review", desc: "Compare how you felt in lesson 1 to lesson 98!" },
    { t: "Touch typing without looking at the keys gives you wings to fly fast.", title: "Wings to Fly", focus: "Peak Beginner speed", desc: "Target: 30-40 WPM with 95%+ accuracy." },
    { t: "Congratulations! You completed all 100 Beginner Lessons in TypePaws!", title: "Beginner Graduation!", focus: "Beginner Graduation", desc: "Grand milestone! You are now fully prepared for Intermediate!" }
  ];

  // === INTERMEDIATE 100 LESSONS ===
  const iTexts = [
    // Sec 1: 1-20 (Punctuation & Quotes)
    { t: "It's important to remember that don't, can't, won't, and shouldn't use apostrophes.", title: "Contraction Kingdom", focus: "Apostrophes '", desc: "Tap apostrophe with right pinky without moving wrist." },
    { t: "\"The journey of a thousand words,\" said Barnaby, \"begins with one keypress.\"", title: "Nested Quotations", focus: "Quotes & Commas", desc: "Master quotation marks mixed with commas and periods." },
    { t: "Wait—did you hear that? Shh! Listen closely: the cat is typing a secret letter.", title: "Dashes and Colons", focus: "— : ; !", desc: "Em-dashes, colons, and semi-colons expand your expressiveness." },
    { t: "Here's a list: apples, bananas, cherries; sweet treats; and cold lemonade.", title: "Semicolon Lists", focus: "; and :", desc: "Use semicolons to separate detailed complex lists." },
    { t: "She asked, \"Are you sure?\" He replied, \"Absolutely 100% positive!\"", title: "Quick Dialogue Switch", focus: "\" ? ! \"", desc: "Alternate between speech quotes and punctuation." },
    { t: "Self-confidence, well-being, and state-of-the-art practice bring rapid results.", title: "Hyphenated Words", focus: "Hyphen -", desc: "Reach right pinky up to the hyphen key next to zero." },
    { t: "The cat's whiskers, the dog's tail, and the parrot's colorful feathers were clean.", title: "Possessive Apostrophes", focus: "Possessive 's", desc: "Keep right pinky fluid on the apostrophe key." },
    { t: "\"Halt! Who goes there?\" whispered the guard. \"Only a friendly typing companion!\"", title: "Dramatic Dialogue", focus: "Dialogue cadence", desc: "Fast punctuation handling without losing speed." },
    { t: "Note this rule: accuracy > rushing; accuracy brings genuine long-term speed.", title: "Logical Symbols", focus: ": ; >", desc: "Introduce logical comparative signs." },
    { t: "\"To be, or not to be; that is the question:\" wrote the great bard long ago.", title: "Shakespearean Flow", focus: "; : \" ,", desc: "Classic punctuation challenge." },
    { t: "It was a dark, stormy night—the wind howled, yet the keyboard clicked peacefully.", title: "Atmospheric Prose", focus: "Commas, dash", desc: "Balance literary punctuation with smooth rhythm." },
    { t: "Did she say \"tomorrow\" or \"today\"? Check the calendar; it's quite urgent!", title: "Embedded Quotes", focus: "Quotes inside questions", desc: "Notice how punctuation sits inside or outside quotes." },
    { t: "The user-friendly interface made typing-practice an all-around pleasant activity.", title: "Compound Hyphens", focus: "Hyphens in prose", desc: "Clean taps on the hyphen without straying off home row." },
    { t: "Wait! Look up: a shooting star! Make a wish before it fades away into the night.", title: "Exclamatory Pauses", focus: "! : ;", desc: "Dynamic emotional punctuation." },
    { t: "\"Paws on keys, eyes on screen,\" is the motto of every TypePaws champion.", title: "Mascot Creed", focus: "\" , .", desc: "Internalize the academy creed." },
    { t: "The recipe called for: 2 cups flour, 1 tsp salt, and 1/2 cup warm water.", title: "Kitchen Instructions", focus: ": / numbers", desc: "Combine colons with recipes and fractions." },
    { t: "Is it a bird? Is it a plane? No, it's super-fast fingers gliding effortlessly!", title: "Triple Question", focus: "? - !", desc: "Dynamic question marks and hyphens." },
    { t: "\"Never compromise on accuracy,\" Barnaby purred; \"speed will follow on its own.\"", title: "Wise Semicolon", focus: "; \" ,", desc: "Semicolons connect closely related thoughts." },
    { t: "Quick-thinking, sharp-eyed, and nimble-pawed learners type over 50 WPM.", title: "Adjective Triads", focus: "Compound adjectives", desc: "Rhythmic hyphenated phrases." },
    { t: "\"Bravo!\" declared the mentor. \"Your punctuation skills are now second nature.\"", title: "Section 1 Milestone", focus: "Section 1 Final", desc: "Punctuation is now your ally, not an obstacle!" },

    // Sec 2: 21-40 (Speed Drills & Digraphs)
    { t: "tion ment ough ight able ible ness ship hood tion ment ough ight", title: "Common Suffix Sprints", focus: "tion, ment, ough", desc: "Type common suffixes as single muscle impulses." },
    { t: "action section station creation nation mention fraction attraction", title: "The -TION Conga", focus: "tion words", desc: "Think 'tion' as one fluid finger roll." },
    { t: "movement judgment argument treatment equipment settlement pavement", title: "The -MENT Roll", focus: "ment words", desc: "Left and right hand alternating harmony." },
    { t: "though thought through throughout thorough rough tough cough laugh", title: "The Tricky -OUGH Family", focus: "ough combinations", desc: "One of the most common letter clusters in English." },
    { t: "bright flight slight knight delight tonight midnight eyesight moonlight", title: "The -IGHT Sparkle", focus: "ight roll", desc: "I-G-H-T is a fast right-to-left finger wave." },
    { t: "happiness darkness kindness brightness weakness lightness sharpness", title: "The -NESS Wave", focus: "ness words", desc: "Double 's' pinky bounce with ring finger N." },
    { t: "friendship leadership hardship partnership citizenship championship", title: "The -SHIP Cascade", focus: "ship words", desc: "Fluid finger ripple." },
    { t: "beautiful reasonable comfortable noticeable valuable responsible", title: "Able & Ible Flow", focus: "able, ible", desc: "Long, multi-syllable elegance." },
    { t: "incredible development of modern technology requires remarkable patience.", title: "Polysyllabic Sprint", focus: "Long common words", desc: "Don't pause between syllables; read ahead." },
    { t: "understanding international communication strengthens global friendships.", title: "Global Vocabulary", focus: "Long words flow", desc: "Train your eyes to scan three words ahead." },
    { t: "the extraordinary performance brought overwhelming admiration and delight.", title: "Admiration & Delight", focus: "Digraph combos", desc: "Aim for a steady 45+ WPM." },
    { t: "th sh ch wh ph th sh ch wh ph that ship chip when phone that ship", title: "Consonant Digraphs", focus: "th, sh, ch, wh, ph", desc: "Core English consonant pairings." },
    { t: "there their they're which whether where what when why who whose whom", title: "Homophones & Wh-Words", focus: "wh- words", desc: "Common stumbling blocks typed cleanly." },
    { t: "spring string strong strange straight stretch street strike stream", title: "Three-Letter Consonant Clusters", focus: "str- words", desc: "Fast left-hand finger gymnastics: S-T-R." },
    { t: "splash split splash splendid splice splint spleen splendidly", title: "The SPL- Cluster", focus: "spl- words", desc: "Left ring to pinky to ring: S-P-L." },
    { t: "bright thoughts brought tremendous satisfaction throughout the entire team.", title: "Digraph Synthesis", focus: "Mixed clusters", desc: "Smooth continuous keystroke cadence." },
    { t: "quick brown foxes know that quiet practice brings brilliant breakthroughs.", title: "Alliteration Sprint", focus: "br, tr, qu", desc: "No stuttering! Keep tempo even." },
    { t: "concentrate on smooth uninterrupted movement rather than sudden bursts.", title: "Burst Prevention", focus: "Even rhythm", desc: "A flat WPM line is faster than an erratic one." },
    { t: "professional typists maintain relaxed shoulders, wrists, and fingers.", title: "Posture Check", focus: "Ergonomics & speed", desc: "Feel the lightness in your fingertips." },
    { t: "outstanding achievement! your digraph muscle memory is exceptionally sharp.", title: "Section 2 Milestone", focus: "Section 2 Final", desc: "Digraphs conquered! Ready for the number row." },

    // Sec 3: 41-60 (Number Row & Symbols)
    { t: "1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 12 34 56 78 90", title: "Number Row Calibration", focus: "1 2 3 4 5 6 7 8 9 0", desc: "Reach up from home row to the number row." },
    { t: "The flight leaves at 08:45 AM from Gate 14 and arrives at 11:30 PM.", title: "Times and Flight Numbers", focus: "Numbers + Colons", desc: "Mix numbers into normal sentence structures." },
    { t: "In 1969, Apollo 11 landed 2 astronauts on the Moon after 4 days of travel.", title: "Moon Landing 1969", focus: "Historical dates", desc: "Smooth number transitions without pausing." },
    { t: "Order #4092: 3 shirts at $19.99 each and 2 pairs of socks at $5.50 each.", title: "Invoices and Prices", focus: "$ # . numbers", desc: "E-commerce data entry practice." },
    { t: "Our annual revenue grew 25% in 2021, 38% in 2022, and 45% in 2023.", title: "Percentages & Trends", focus: "% sign", desc: "Hold Left Shift and reach 5 for '%'." },
    { t: "Save up to 50% on all items: shirts ($29), pants ($49), and coats ($99).", title: "Parentheses and Currency", focus: "( ) $ %", desc: "Parentheses: Shift + 9 and Shift + 0." },
    { t: "Contact us at support@typepaws.org or call 1-800-555-0199 for help.", title: "Emails and Phone Numbers", focus: "@ - numbers", desc: "Email addresses and telephone formats." },
    { t: "The speed limit is 65 MPH on Route 101, but drops to 25 MPH in town.", title: "Speed Limits and Routes", focus: "Capitals + numbers", desc: "Fast alternating case and numbers." },
    { t: "On 12/25/2025, the grand holiday festival begins at precisely 18:00 hours.", title: "Dates with Slashes", focus: "/ numbers :", desc: "Slashes and double-digit years." },
    { t: "Ingredients: 250g flour, 150ml milk, 2 eggs, 50g butter, and 10g sugar.", title: "Metric Recipe", focus: "Measurements & numbers", desc: "Common unit notations." },
    { t: "Calculate: 15 + 27 = 42, 100 - 36 = 64, and 8 * 9 = 72 in mental math.", title: "Basic Equations", focus: "+ - = *", desc: "Reach up to the plus and equals keys." },
    { t: "A discount of 15% on a $120 item saves you $18, making the final price $102.", title: "Discounts and Savings", focus: "% $ numbers", desc: "Accurate financial typing." },
    { t: "Model X-200 features a 4.5 GHz CPU, 32GB RAM, and a 1TB SSD storage unit.", title: "Tech Specs", focus: "Hardware numbers", desc: "Technical numbers and acronyms." },
    { t: "Between 1990 and 2020, world internet users jumped from 2.6M to 4.8B.", title: "Global Internet Growth", focus: "Decimals and numbers", desc: "Data journalism typing." },
    { t: "Score: Team A scored 98 points while Team B scored 104 in overtime.", title: "Sports Box Scores", focus: "Game scores", desc: "Notice when your fingers want to look down—resist!" },
    { t: "Room 304 is reserved from 09:00 to 17:30 on November 14th, 2024.", title: "Room Reservation", focus: "Times & dates", desc: "Calendar entries." },
    { t: "Coordinates: 37.7749° N, 122.4194° W mark the city of San Francisco.", title: "GPS Coordinates", focus: "Decimals and signs", desc: "Precision decimal typing." },
    { t: "Item 7A: serial #987-654-3210 passed quality inspection with a 99.8% grade.", title: "Serial Numbers", focus: "# - % decimals", desc: "Industrial typing accuracy." },
    { t: "Top 5 scores: 9940, 8820, 7650, 6500, and 5430 points in the arcade.", title: "High Scores", focus: "4-digit numbers", desc: "Fast numeric bursts." },
    { t: "Tremendous! You can now type numbers and symbols without breaking your stride.", title: "Section 3 Milestone", focus: "Section 3 Final", desc: "Number row fluency unlocked!" },

    // Sec 4: 61-80 (Rhythm, Cadence & Long Words)
    { t: "Consistency is the fundamental secret to unlocking breathtaking typing velocity.", title: "The Secret of Cadence", focus: "Rhythm & cadence", desc: "Maintain a steady pulse: tick, tick, tick, tick." },
    { t: "A steady rhythm prevents hand fatigue and allows your mind to anticipate words.", title: "Fatigue Prevention", focus: "Steady tempo", desc: "Do not sprint and freeze; glide at constant tempo." },
    { t: "Anticipation, determination, and perseverance transform beginners into masters.", title: "Trio of Perseverance", focus: "Multi-syllable cadence", desc: "Notice the flowing rhythm of long words." },
    { t: "The extraordinary biodiversity found within tropical rainforests is astonishing.", title: "Rainforest Wonders", focus: "Scientific vocabulary", desc: "Read syllables smoothly without halting." },
    { t: "Metronomic precision enables your fingers to execute complex movements effortlessly.", title: "Metronomic Flow", focus: "Even keystroke timing", desc: "Match keystrokes to an imaginary metronome." },
    { t: "Collaboration between enthusiastic individuals often generates magnificent inventions.", title: "Collaboration & Inventions", focus: "Complex vocabulary", desc: "Keep wrists completely motionless." },
    { t: "Every paragraph is a musical composition played upon the keyboard's eighty-eight keys.", title: "Musical Composition", focus: "Flow state", desc: "Feel the lyrical flow of the sentences." },
    { t: "Smoothness precedes speed; when movements become smooth, speed emerges naturally.", title: "Speed Follows Smoothness", focus: "Mindset drill", desc: "Smoothness is speed in disguise." },
    { t: "Curiosity cultivates knowledge, while disciplined habit establishes genuine expertise.", title: "Curiosity & Discipline", focus: "Philosophical rhythm", desc: "Keep your breathing relaxed and deep." },
    { t: "The atmospheric temperature fluctuated significantly throughout the mountainous expedition.", title: "Mountainous Expedition", focus: "Long words marathon", desc: "Navigate 12+ letter words with ease." },
    { t: "Phenomenal accomplishments arise from small, disciplined daily habits executed faithfully.", title: "Daily Habits", focus: "Complex sentence", desc: "Building stamina for long passages." },
    { t: "Maintaining an uninterrupted typing cadence unlocks what psychologists call a flow state.", title: "The Flow State", focus: "Deep focus", desc: "Notice how time disappears when you are focused." },
    { t: "Barnaby watched with sheer delight as the words flowed like a clear mountain stream.", title: "Mountain Stream", focus: "Poetic cadence", desc: "No tension in shoulders, neck, or jaw." },
    { t: "Comprehensive understanding of language structures enhances both typing and cognition.", title: "Cognitive Harmony", focus: "Academic vocabulary", desc: "Read three words ahead effortlessly." },
    { t: "Architectural elegance combines practical functionality with breathtaking aesthetic beauty.", title: "Architectural Elegance", focus: "Rhythmic balance", desc: "Alternate left and right hands cleanly." },
    { t: "Fascinating historical discoveries continually illuminate our shared human heritage.", title: "Historical Discoveries", focus: "High-cadence drill", desc: "Aim for 50-60 WPM benchmark." },
    { t: "Unwavering concentration during practice sessions produces remarkable long-term dividends.", title: "Long-term Dividends", focus: "Concentration drill", desc: "Stay centered through the entire text." },
    { t: "The rhythmic tapping of keys echoed softly in the quiet library as evening arrived.", title: "Quiet Library", focus: "Atmospheric cadence", desc: "Enjoy the tactile feedback of each key." },
    { t: "Fluidity, accuracy, and confidence are the three cornerstones of master touch typists.", title: "The Three Cornerstones", focus: "Core values", desc: "You have developed true intermediate mastery." },
    { t: "Outstanding work! Your typing cadence is now smooth, rhythmic, and dependable.", title: "Section 4 Milestone", focus: "Section 4 Final", desc: "Section 4 complete! Ready for real-world stories." },

    // Sec 5: 81-100 (Real-World Paragraph Sprints)
    { t: "Honeybees communicate the location of sweet floral blossoms through an intricate dance called the waggle dance.", title: "The Waggle Dance", focus: "Story sprint 1", desc: "Real-world animal knowledge while typing fast." },
    { t: "Octopuses have three hearts, blue copper-based blood, and nine brains that govern their curious, intelligent arms.", title: "Three Hearts of an Octopus", focus: "Story sprint 2", desc: "Keep rhythm steady through scientific facts." },
    { t: "The oldest known living tree on Earth is a bristlecone pine named Methuselah, estimated to be over 4,850 years old.", title: "Ancient Methuselah", focus: "Story sprint 3", desc: "Mix names, numbers, and historical facts." },
    { t: "A cloud of starlings moving together in the dusk sky is called a murmuration, forming mesmerizing fluid waves.", title: "Starling Murmuration", focus: "Story sprint 4", desc: "Fluid poetic prose." },
    { t: "In 1888, the first touch-typist Frank Edward McGurrin won a famous public speed typing contest in Cincinnati, Ohio.", title: "The First Touch Typist", focus: "History of typing", desc: "He proved touch-typing beats looking at keys!" },
    { t: "Coffee was originally discovered in Ethiopia when a shepherd noticed his goats dancing playfully after eating berries.", title: "The Dancing Goats", focus: "Story sprint 5", desc: "Fun folklore sprint." },
    { t: "The northern lights, or aurora borealis, occur when charged solar particles collide with gases in Earth's atmosphere.", title: "Aurora Borealis", focus: "Story sprint 6", desc: "Complex scientific words with apostrophes." },
    { t: "Elephants communicate over vast distances using low-frequency rumbles that travel through the ground for miles.", title: "Elephant Whispers", focus: "Story sprint 7", desc: "Maintain 50+ WPM pace." },
    { t: "Every second, your eyes capture images that your brain processes faster than the most sophisticated supercomputer.", title: "The Human Eye", focus: "Story sprint 8", desc: "Keep your eyes scanning the text smoothly." },
    { t: "Hot air balloons rise because heated air inside the envelope is less dense than the cooler surrounding atmosphere.", title: "Hot Air Balloons", focus: "Story sprint 9", desc: "Clear, crisp, accurate strokes." },
    { t: "The library of Alexandria was once the greatest intellectual treasure of the ancient Mediterranean world.", title: "Library of Alexandria", focus: "Story sprint 10", desc: "Historical narrative typing." },
    { t: "Sea turtles navigate thousands of miles across open ocean using Earth's invisible magnetic field as a compass.", title: "Sea Turtle Compass", focus: "Story sprint 11", desc: "Focus on zero typos on this run." },
    { t: "Deep in the ocean trenches, bioluminescent creatures produce their own magical neon light in complete darkness.", title: "Bioluminescence", focus: "Story sprint 12", desc: "Descriptive science passage." },
    { t: "The Wright brothers achieved the first powered airplane flight on December 17, 1903, in Kitty Hawk, North Carolina.", title: "Kitty Hawk 1903", focus: "Story sprint 13", desc: "Mixed dates, commas, and proper nouns." },
    { t: "Chameleons can move each eye independently, allowing them to look in two completely different directions at once.", title: "Chameleon Eyes", focus: "Story sprint 14", desc: "Stay calm and keep typing." },
    { t: "A single lightning bolt can heat the surrounding air to 30,000 kelvins, five times hotter than the surface of the Sun.", title: "Lightning Bolts", focus: "Story sprint 15", desc: "Intense facts for rapid keystrokes." },
    { t: "Barnaby curled up on the desk, listening to the satisfying rhythmic clatter of another completed typing challenge.", title: "Barnaby's Siesta", focus: "Story sprint 16", desc: "Barnaby is so proud of your dedication." },
    { t: "The Great Barrier Reef is so enormous that it can be clearly observed by astronauts orbiting aboard the space station.", title: "The Great Barrier Reef", focus: "Story sprint 17", desc: "Long sentence endurance drill." },
    { t: "True mastery is not about never making mistakes; it is about recovering instantly and maintaining your inner calm.", title: "Mastery Mindset", focus: "Story sprint 18", desc: "Inner peace leads to outer typing speed." },
    { t: "Sensational achievement! You have mastered all 100 Intermediate Lessons and are now a bona fide typing pro!", title: "Intermediate Graduation!", focus: "Intermediate Graduation", desc: "You have conquered Intermediate! Sonic Claws awaits you!" }
  ];

  // === ADVANCED 100 LESSONS ===
  const aTexts = [
    // Sec 1: 1-20 (Tricky Finger Gymnastics)
    { t: "czar zephyr squawk juxtapose physique syzygy rhythm xylem phlegm", title: "Unusual Bigrams Sprint", focus: "cz, ze, sq, ph, sy", desc: "Awkward letter combinations that challenge standard hand transitions." },
    { t: "awkwardly synchronized gymnasts executed bizarre, perplexing maneuvers.", title: "Bizarre Maneuvers", focus: "wk, ch, ym, zx", desc: "High density of low-frequency finger stretches." },
    { t: "the quick brown fox jumped swiftly over twenty-six lazy sleeping dogs.", title: "Classic Pangram with Twist", focus: "Full alphabet agility", desc: "Hit every letter without hesitation." },
    { t: "Sphinx of black quartz, judge my vow; pack my box with five dozen jugs.", title: "The Dual Pangram", focus: "Pangram mastery", desc: "Zero backspaces allowed on this challenge!" },
    { t: "oxygen, zeppelin, rhythm, jigsaw, kayak, squeeze, buzzard, knuckle, abyss.", title: "Tricky Word Conga", focus: "z, y, k, x, q", desc: "Rare keys linked in rapid succession." },
    { t: "cryptography requires analyzing ciphertext, deciphering complex puzzles.", title: "Cryptographic Cadence", focus: "cr, ph, xt, ip", desc: "Technical vocabulary with awkward leaps." },
    { t: "juxtaposing quaint, whimsical artifacts alongside hypermodern sculptures.", title: "Artistic Juxtaposition", focus: "j, x, q, w, y", desc: "Train your fingers to avoid cross-hand interference." },
    { t: "my humble kayak skimmed through icy fjord waters beneath snowy peaks.", title: "Fjord Kayak", focus: "k, y, j, f, z", desc: "Unusual consonant pairs." },
    { t: "the quirky zoologist quizzed enthusiastic pupils about pygmy marmosets.", title: "Quirky Zoologist", focus: "q, z, y, p, m", desc: "Pinky gymnastics on Q, Z, and P." },
    { t: "labyrinthine catacombs contained mysterious glyphs sculpted in onyx.", title: "Labyrinthine Glyphs", focus: "y, ph, pt, sc", desc: "Fluidity through dense consonant structures." },
    { t: "swiftly jumping zebras quickly puzzled whimsical foxes in breezy zoo.", title: "Breezy Zoo Sprint", focus: "z, q, x, w", desc: "High speed test: maintain 65+ WPM." },
    { t: "exquisite, handcrafted mosaics shimmered radiantly within hazy vaults.", title: "Exquisite Mosaics", focus: "x, q, z, v", desc: "Clean strokes without looking at keyboard." },
    { t: "syzygy describes three celestial bodies aligned in a gravitational dance.", title: "Syzygy Alignment", focus: "sy, zy, gy", desc: "Y and Z alternating agility." },
    { t: "unorthodox hypotheses frequently revolutionize stagnant scientific theories.", title: "Scientific Hypotheses", focus: "un, th, hy, po", desc: "Dense academic cadence." },
    { t: "a blizzard buzzed vigorously outside while cozy hearth fires crackled.", title: "Blizzard Buzz", focus: "zz, gg, cc, ff", desc: "Double letter bounces." },
    { t: "rhythmically, the synchronized typists tapped twenty difficult tongue twisters.", title: "Synchronized Typists", focus: "rh, th, tw", desc: "Clean rhythm without clipping letters." },
    { t: "flabbergasted onlookers witnessed unprecedented velocity and accuracy.", title: "Unprecedented Velocity", focus: "Polysyllabic speed", desc: "Smooth acceleration into higher gears." },
    { t: "pack five dozen liquor jugs with exotic vintage champagne for the banquet.", title: "Banquet Pangram", focus: "Rare letter frequency", desc: "Fast finger transitions across all rows." },
    { t: "hypothetical astrophysical calculations indicate miniature wormhole exits.", title: "Astrophysical Wonders", focus: "Extreme vocabulary", desc: "Keep typing hands relaxed and floating." },
    { t: "Splendid! Your fingers can now navigate any phonetic obstacle with ease.", title: "Section 1 Milestone", focus: "Section 1 Final", desc: "Section 1 mastered! On to code syntax." },

    // Sec 2: 21-40 (Code, Symbols & Syntax)
    { t: "const calculateSpeed = (chars, seconds) => Math.round((chars / 5) / (seconds / 60));", title: "JavaScript Speed Formula", focus: "= ( ) / ; =>", desc: "Real JavaScript formula used right inside this typing app!" },
    { t: "function fetchUserData(id) { return fetch(`/api/users/${id}`).then(r => r.json()); }", title: "Async JavaScript Function", focus: "{ } ` $ / ;", desc: "Braces, backticks, template literals, and promises." },
    { t: "if (accuracy >= 98 && wpm > 60) { unlockBadge('master_typist'); celebrate(); }", title: "Conditional Logic & Operators", focus: ">= && { } ' ;", desc: "Boolean operators and curly braces." },
    { t: "<div class=\"mascot-container\"><span id=\"cat-paw\">🐾</span></div>", title: "HTML5 Markup", focus: "< > / = \"", desc: "Angle brackets, slash closers, and attributes." },
    { t: ".card:hover { transform: scale(1.05); transition: all 0.3s ease-in-out; }", title: "CSS Pseudo-Classes", focus: ". : { } ; -", desc: "CSS styling syntax with colons and hyphens." },
    { t: "def quick_sort(arr): return arr if len(arr) <= 1 else quick_sort([x for x in arr[1:] if x < arr[0]]) + [arr[0]] + quick_sort([x for x in arr[1:] if x >= arr[0]])", title: "Python One-Line Quicksort", focus: ": [ ] <= >= +", desc: "Python list comprehensions and brackets." },
    { t: "for (let i = 0; i < items.length; i++) { sum += items[i] * multiplier; }", title: "Standard For Loop", focus: "( ; ; ) { [ ] }", desc: "Classic loop indexer with square brackets." },
    { t: "SELECT user_id, email, MAX(wpm) FROM typing_records WHERE completed = TRUE GROUP BY 1, 2;", title: "SQL Query Syntax", focus: "CAPITALS, _, ()", desc: "Relational database syntax in uppercase." },
    { t: "export default async function handler(req, res) { const { token } = req.headers; }", title: "API Route Handler", focus: "async { } , ;", desc: "Modern serverless endpoint syntax." },
    { t: "git commit -m \"feat: implement high-speed blind typing mode with zero delay\"", title: "Git Terminal Commands", focus: "git -m \" \" :", desc: "Command line flags and commit messages." },
    { t: "npm install @typepaws/engine --save-dev && npm run test:watch", title: "NPM Package Commands", focus: "@ / -- && :", desc: "Package manager syntax and scripts." },
    { t: "const colors = ['#f43f5e', '#38bdf8', '#4ade80', '#fbbf24', '#a855f7'];", title: "Hex Color Array", focus: "[ ' # ' , ]", desc: "Array of hex color string literals." },
    { t: "try { JSON.parse(rawInput); } catch (err) { console.error(\"Parse failed:\", err); }", title: "Error Handling Block", focus: "try { } catch ( )", desc: "Standard try/catch structure." },
    { t: "import React, { useState, useEffect } from 'react'; // React hooks import", title: "ES6 Module Imports", focus: "import { } from ' ' ; //", desc: "Front-end framework import statement." },
    { t: "docker run -d -p 8080:80 --name typepaws-app -v $(pwd):/app nginx:alpine", title: "Docker Run Flags", focus: "-d -p : -- -v $()", desc: "Container commands and port mapping." },
    { t: "const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;", title: "Regular Expression", focus: "/ ^ [ ] + @ \\ . $ /", desc: "Ultimate symbol challenge: email regex!" },
    { t: "interface UserStats { wpm: number; accuracy: number; completedLessons: string[]; }", title: "TypeScript Interface", focus: "interface { : ; [ ] }", desc: "TypeScript type definitions." },
    { t: "curl -X POST https://api.typepaws.io/v1/scores -H \"Authorization: Bearer xyz\"", title: "cURL API Call", focus: "-X -H : // \" \"", desc: "HTTP REST API terminal request." },
    { t: "markdown: [Link Title](https://example.com) and `inline_code()` with **bold** text.", title: "Markdown Formatting", focus: "[ ] ( ) ` _ *", desc: "Markdown syntax elements." },
    { t: "Brilliant! You can now code and type complex technical syntax at blistering speed.", title: "Section 2 Milestone", focus: "Section 2 Final", desc: "Code syntax mastered! Next up: Tongue Twisters." },

    // Sec 3: 41-60 (Tongue Twisters & Lexical Sprint)
    { t: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?", title: "The Woodchuck Classic", focus: "w, ch, ood, uck", desc: "Fast repetitive consonant cadence." },
    { t: "She sells seashells by the seashore; the shells she sells are surely seashells.", title: "Seashell Shore", focus: "sh, s, ea, ell", desc: "Right pinky vs left ring finger balance." },
    { t: "Peter Piper picked a peck of pickled peppers; a peck of pickled peppers Peter picked.", title: "Pickled Peppers", focus: "p, k, ed, er", desc: "Rapid pinky and middle finger taps." },
    { t: "Betty Botter bought some butter, but she said the butter's bitter.", title: "Bitter Butter", focus: "b, t, er, tt", desc: "B and T alternating bounce." },
    { t: "Fuzzy Wuzzy was a bear; Fuzzy Wuzzy had no hair; Fuzzy Wuzzy wasn't fuzzy, was he?", title: "Fuzzy Wuzzy", focus: "zz, w, y, z", desc: "Double Z pinky acrobatics." },
    { t: "Which witch wished which wicked wish while watching white winter waterfalls?", title: "Which Witch", focus: "wh, tch, ish", desc: "W, H, I, C, H cluster sprints." },
    { t: "Six sleek swans swam swiftly southwards under soft, shimmering silver stars.", title: "Sleek Swans", focus: "s, sw, sl, st", desc: "S-cluster alliteration." },
    { t: "Can you can a can as a canner can can a can without a canned can?", title: "Canner Can", focus: "c, an, er", desc: "Repetitive rhythm without tripping." },
    { t: "A proper copper coffee pot makes remarkably pure, piping hot coffee promptly.", title: "Copper Coffee Pot", focus: "p, c, ff, op", desc: "P and C dexterity." },
    { t: "Red lorry, yellow lorry, red lorry, yellow lorry, red leather, yellow leather.", title: "Lorry & Leather", focus: "l, rr, y, th", desc: "Phonetic tripping hazards." },
    { t: "Unique New York, unique New York, you know you need unique New York uniquely.", title: "Unique New York", focus: "un, iq, ue, n, y", desc: "Alternating vowel-consonant sweeps." },
    { t: "He threw three true free throws through the thrilled crowd's thunderous cheers.", title: "Three Free Throws", focus: "thr, fr, ee, ow", desc: "Triple consonant releases." },
    { t: "Black background, brown background; brisk breezes blow bright blue blossoms.", title: "Brisk Breezes", focus: "bl, br, ck, gr", desc: "B-blend alliteration." },
    { t: "Eleven benevolent elephants elevated eleven elegant elderly elks effortlessly.", title: "Benevolent Elephants", focus: "el, ev, ant, ly", desc: "E and L bouncing cadence." },
    { t: "Lesser leather never weathered wetter weather better than wet weathered leather.", title: "Wetter Weather", focus: "th, er, ett, eath", desc: "Dense repetitive vowel clusters." },
    { t: "Pad kid poured curd pulled cod; quick kings quickly quiz curious quails.", title: "Phonetic Tongue Trap", focus: "p, d, k, q", desc: "Deliberately disjointed muscular hurdles." },
    { t: "Flash message: the fresh fish flesh fluttered furiously from the fisherman's net.", title: "Fresh Fish Flesh", focus: "fl, sh, f, sh", desc: "F and L rapid release." },
    { t: "Round and round the rugged rock the ragged rascal ran with rapid steps.", title: "Rugged Rock", focus: "r, nd, gg, ed", desc: "Rhythm and alliteration combined." },
    { t: "Top typists tap tricky tongue twisters totally tranquil, totally triumphant.", title: "Tranquil Typists", focus: "t, tr, ly, ph", desc: "Mastery through absolute composure." },
    { t: "Phenomenal! Your motor reflexes and articulation are in peak physical form.", title: "Section 3 Milestone", focus: "Section 3 Final", desc: "Tongue twisters conquered! Next: Blind touch-typing drills." },

    // Sec 4: 61-80 (Blind Touch-Typing Fluency Drills)
    { t: "Do not glance down at your keyboard. Your subconscious mind knows every single coordinate.", title: "The Blind Creed", focus: "Pure touch memory", desc: "Keep eyes glued to the text ahead. Zero peeking!" },
    { t: "Muscle memory is built through confident repetitions; trust your hands to guide the way.", title: "Trust Your Hands", focus: "Subconscious typing", desc: "Release manual control; let fingers flow automatically." },
    { t: "When you stop thinking about individual letters, entire words appear on screen like magic.", title: "Word-Level Processing", focus: "Visual chunking", desc: "Read in chunks of 2-3 words rather than single letters." },
    { t: "Fluency means erasing hesitation between keystrokes until your cadence resembles rain.", title: "Rain Cadence", focus: "Even time interval", desc: "Continuous unbroken sound: clack-clack-clack-clack." },
    { t: "True touch typists feel comfortable typing in pitch darkness without losing a beat.", title: "Midnight Mastery", focus: "Sensory detachment", desc: "You don't need light to type when touch is dialed in." },
    { t: "The tactile bumps on the F and J keys are your permanent compass points in the dark.", title: "Anchor Awareness", focus: "F & J homing", desc: "Any time you drift, feel the tactile nubs." },
    { t: "Breathe deeply, drop your shoulders, and let velocity emanate from pure calmness.", title: "Velocity Through Calm", focus: "Physical relaxation", desc: "Tension slows you down; relaxation speeds you up." },
    { t: "Speed is merely a byproduct of precision, rhythm, and unwavering mental presence.", title: "Presence & Precision", focus: "Mental focus", desc: "Be 100% present with each stroke." },
    { t: "Typing eighty words per minute feels effortless when every finger stays in its zone.", title: "Finger Zoning", focus: "80 WPM benchmark", desc: "Strict finger discipline yields massive speed." },
    { t: "Resist the urge to slam the backspace key; maintain forward momentum through the line.", title: "Forward Momentum", focus: "No stuttering", desc: "Keep moving forward like a river." },
    { t: "Notice how your left pinky automatically reaches the Shift key without any conscious effort.", title: "Automatic Shifts", focus: "Shift autonomy", desc: "Subconscious automation in action." },
    { t: "The keyboard is an extension of your thoughts, translating ideas directly into text.", title: "Thought Translation", focus: "Direct brain-to-text", desc: "No middleman: thought becomes letters instantly." },
    { t: "Great writers, coders, and thinkers all share the superpower of fluent touch typing.", title: "The Superpower", focus: "Productivity unlock", desc: "Never lose an idea because typing was too slow." },
    { t: "Your hands glide over the keys like a master pianist performing a beloved concerto.", title: "Pianist Hands", focus: "Artistic grace", desc: "Light touch, minimal finger lift." },
    { t: "Eliminate excess finger movement; keep keystrokes compact, gentle, and centered.", title: "Minimal Movement", focus: "Efficiency of motion", desc: "Travel distance matters at 90+ WPM." },
    { t: "Touch typing without looking preserves your neck posture and shields your vision.", title: "Ergonomic Defense", focus: "Health benefits", desc: "Sit tall, screen at eye level." },
    { t: "Observe the words flowing seamlessly across the monitor like a swift clear river.", title: "Swift River", focus: "Visual tracking", desc: "Gaze rests slightly ahead of current word." },
    { t: "You have transcended mechanical effort; typing has become pure intuitive expression.", title: "Intuitive Expression", focus: "Peak touch fluency", desc: "Mastery is feeling one with the tool." },
    { t: "Barnaby salutes you with his paws high: you are a genuine blind touch-typing wizard!", title: "Cat Wizard Salute", focus: "Mascot tribute", desc: "Barnaby's highest salute!" },
    { t: "Incredible mastery! You have completed Section 4 with total blind touch fluency.", title: "Section 4 Milestone", focus: "Section 4 Final", desc: "Final section ahead: The Grandmaster Speed Marathon!" },

    // Sec 5: 81-100 (Grandmaster Speed Marathon)
    { t: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", title: "Emerson on Authenticity", focus: "Classic literature 1", desc: "Ralph Waldo Emerson's immortal prose." },
    { t: "In the depth of winter, I finally learned that within me there lay an invincible summer.", title: "Camus' Invincible Summer", focus: "Classic literature 2", desc: "Albert Camus on inner resilience." },
    { t: "It is not the critic who counts; not the man who points out how the strong man stumbles, but who is in the arena.", title: "The Man in the Arena", focus: "Historic speech 1", desc: "Theodore Roosevelt's iconic speech." },
    { t: "Two roads diverged in a yellow wood, and I took the one less traveled by, and that has made all the difference.", title: "The Road Not Taken", focus: "Poetic cadence", desc: "Robert Frost's beloved lines." },
    { t: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.", title: "Steve Jobs on Work", focus: "Modern philosophy", desc: "Inspiring words typed at 80+ WPM." },
    { t: "Do not go gentle into that good night, old age should burn and rave at close of day; rage, rage against the dying of the light.", title: "Do Not Go Gentle", focus: "Dylan Thomas", desc: "Powerful, rhythmic poetic intensity." },
    { t: "We are what we repeatedly do. Excellence, then, is not a solitary act, but an ingrained lifelong habit.", title: "Aristotle on Excellence", focus: "Ancient philosophy", desc: "Aristotle's timeless insight on habits." },
    { t: "I have learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.", title: "Maya Angelou Wisdom", focus: "Empathy & prose", desc: "Maya Angelou's memorable truth." },
    { t: "The saddest aspect of life right now is that science gathers knowledge faster than society gathers wisdom.", title: "Isaac Asimov on Science", focus: "Sci-fi intellect", desc: "Isaac Asimov on science and wisdom." },
    { t: "Somewhere, something incredible is waiting to be known, whispered Carl Sagan as he looked up into the infinite cosmos.", title: "Carl Sagan's Cosmos", focus: "Cosmic wonder", desc: "Carl Sagan's inspiring cosmic view." },
    { t: "Life is what happens to you while you're busy making other plans, wrote John Lennon in beautiful melodic harmony.", title: "John Lennon Wisdom", focus: "Lyrical cadence", desc: "Timeless lyrical reflection." },
    { t: "Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do.", title: "Mark Twain on Courage", focus: "Literary courage", desc: "Mark Twain on taking brave leaps." },
    { t: "The secret of change is to focus all of your energy not on fighting the old, but on building the magnificent new.", title: "Socrates on Change", focus: "Socratic focus", desc: "Forward-looking philosophy." },
    { t: "There is nothing noble in being superior to your fellow man; true nobility is being superior to your former self.", title: "Hemingway on Nobility", focus: "Ernest Hemingway", desc: "Self-improvement benchmark." },
    { t: "Success is not final, failure is not fatal: it is the courageous perseverance to continue that counts in the end.", title: "Churchill on Perseverance", focus: "Historic resolve", desc: "Keep typing through mistakes with poise." },
    { t: "The stars don't struggle to shine; they just burn with their own radiant internal energy across the boundless night.", title: "Boundless Stars", focus: "Metaphorical flow", desc: "Let your typing shine effortlessly." },
    { t: "A journey through three hundred lessons has transformed simple keystrokes into an exquisite symphony of digital art.", title: "The Symphony of Typing", focus: "Meta-reflection", desc: "Look how far you have come since lesson 1!" },
    { t: "Your fingers dance across the keyboard with the speed of cheetahs, the precision of falcons, and the grace of cats.", title: "Cheetahs & Falcons", focus: "Grandmaster sprint", desc: "Speed target: 90-100+ WPM." },
    { t: "Barnaby, Pip, and Bubbles stand together on stage, cheering your awe-inspiring typing supremacy and glorious victory!", title: "The Grand Mascot Chorus", focus: "Pre-Graduation Triumph", desc: "All three mascots cheering your triumph!" },
    { t: "GRANDMASTER CHAMPION! You have conquered all 100 Advanced Lessons and attained legendary touch-typing immortality!", title: "Grandmaster Graduation!", focus: "Grandmaster Graduation", desc: "The ultimate peak of TypePaws! You are an undisputed typing deity!" }
  ];

  // Populate datasets
  const levels = [
    { key: 'beginner', texts: bTexts, prefix: 'b' },
    { key: 'intermediate', texts: iTexts, prefix: 'i' },
    { key: 'advanced', texts: aTexts, prefix: 'a' }
  ];

  levels.forEach(lvl => {
    lvl.texts.forEach((item, idx) => {
      const num = idx + 1;
      const secIdx = Math.floor(idx / 20); // 0 to 4
      const section = LESSONS_DATA[lvl.key].sections[secIdx];
      
      let diff = "Easy";
      if (lvl.key === 'intermediate') diff = num > 50 ? "Hard" : "Medium";
      else if (lvl.key === 'advanced') diff = num > 60 ? "Expert" : "Hard";
      else diff = num > 60 ? "Medium" : "Easy";

      LESSONS_DATA[lvl.key].lessons.push({
        id: `${lvl.prefix}_${num}`,
        number: num,
        level: lvl.key,
        title: item.title,
        sectionId: section.id,
        sectionTitle: section.title,
        difficulty: diff,
        focus: item.focus,
        description: item.desc,
        text: item.t,
        targetWpm: lvl.key === 'beginner' ? 25 + Math.floor(num / 10) : (lvl.key === 'intermediate' ? 45 + Math.floor(num / 8) : 70 + Math.floor(num / 5))
      });
    });
  });
})();

// Export globally for browser usage
if (typeof window !== 'undefined') {
  window.LESSONS_DATA = LESSONS_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LESSONS_DATA;
}
