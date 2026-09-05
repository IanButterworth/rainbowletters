// Language packs for Rainbow Letters. Each pack has the on-screen text, the
// picture that pops out of each letter, the words that trigger an emoji
// shower, and which speech voices to prefer. Words are matched without
// accents, so MAMA finds MAMÁ, and the accented spelling is what gets spoken.
window.RL_LANGUAGES = (() => {
  // "WORD emoji WORD emoji ..." into an object; keeps the lists readable.
  function pairs(text) {
    const out = {};
    const t = text.trim().split(/\s+/);
    for (let i = 0; i + 1 < t.length; i += 2) out[t[i]] = t[i + 1];
    return out;
  }

  const data = {
    es: {
      name: 'Español',
      speech: 'es-ES',
      voices: ['Mónica', 'Monica', 'Paulina', 'Google español', 'Microsoft Elvira', 'Microsoft Sabina', 'Microsoft Dalia', 'Jorge', 'Juan'],
      ui: {
        title: 'Letras Arcoíris',
        tap: 'Pulsa una tecla o toca para jugar',
        hint: '¡Escribe una letra!',
        greeting: '¡Vamos a escribir letras de arcoíris!',
        music: 'Música',
        fullscreen: 'Pantalla completa',
        language: 'Idioma',
      },
      letters: pairs(`
        A 🌳 B 🐳 C 🐰 D 🦖 E 🐘 F 🌸 G 🐱 H 🍦 I 🦎 J 🦒 K 🐨 L 🦁 M 🦋
        N ☁️ Ñ 🐃 O 🐻 P 🐶 Q 🧀 R 🐸 S ☀️ T 🐢 U 🦄 V 🐮 W 🧇 X 🩻 Y 🪀 Z 🥕
      `),
      words: pairs(`
        GATO 🐱 GATITO 🐱 PERRO 🐶 PERRITO 🐶 PEZ 🐟 PÁJARO 🐦 ABEJA 🐝 RANA 🐸 CERDO 🐷 CERDITO 🐷
        VACA 🐮 PATO 🦆 OSO 🐻 CONEJO 🐰 CABALLO 🐴 PONI 🐴 LEÓN 🦁 TIGRE 🐯 MONO 🐵 ELEFANTE 🐘
        JIRAFA 🦒 CEBRA 🦓 BÚHO 🦉 MARIPOSA 🦋 CARACOL 🐌 TORTUGA 🐢 BALLENA 🐳 DELFÍN 🐬 PULPO 🐙
        PINGÜINO 🐧 POLLO 🐔 POLLITO 🐥 OVEJA 🐑 RATÓN 🐭 DINOSAURIO 🦖 DINO 🦖 DRAGÓN 🐉 TIBURÓN 🦈
        CANGREJO 🦀 UNICORNIO 🦄 ZORRO 🦊 LOBO 🐺 KOALA 🐨 PANDA 🐼 BICHO 🐛 GUSANO 🐛 MARIQUITA 🐞
        ARAÑA 🕷️ HORMIGA 🐜 IGUANA 🦎
        SOL ☀️ LUNA 🌙 ESTRELLA ⭐ ESTRELLAS ⭐ ARCOÍRIS 🌈 NUBE ☁️ LLUVIA 🌧️ NIEVE ❄️ FLOR 🌸 FLORES 🌸
        ÁRBOL 🌳 ROSA 🌹 HOJA 🍃 TIERRA 🌍 PLANETA 🪐 COHETE 🚀 MAR 🌊 PLAYA 🏖️ AGUA 💧 FUEGO 🔥
        CORAZÓN 💖 AMOR 💖 ABRAZO 🤗 BESO 😘 FELIZ 😊 SONRISA 😊 RISA 😂 HOLA 👋 ADIÓS 👋 SÍ 👍 NO 🙅
        FIESTA 🎉 BRILLO ✨ BRILLOS ✨ MAGIA ✨
        MAMÁ 👩 MAMI 👩 PAPÁ 👨 PAPI 👨 BEBÉ 👶 ABUELA 👵 ABUELITA 👵 ABUELO 👴 ABUELITO 👴
        HERMANA 👧 HERMANO 👦 NIÑA 👧 NIÑO 👦 AMIGO 🧑‍🤝‍🧑 AMIGA 🧑‍🤝‍🧑 YO 🙋 TÚ 👉
        PASTEL 🎂 TARTA 🎂 TORTA 🎂 CUMPLEAÑOS 🎂 MANZANA 🍎 PLÁTANO 🍌 BANANA 🍌 FRESA 🍓 UVA 🍇 UVAS 🍇
        NARANJA 🍊 PIZZA 🍕 GALLETA 🍪 CARAMELO 🍬 DULCE 🍬 PIRULETA 🍭 HELADO 🍦 DONA 🍩 HUEVO 🥚
        LECHE 🥛 QUESO 🧀 PAN 🍞 ZANAHORIA 🥕 SANDÍA 🍉 CEREZA 🍒 LIMÓN 🍋 PERA 🍐 PIÑA 🍍
        CHOCOLATE 🍫 MIEL 🍯 JUGO 🧃 ZUMO 🧃 SOPA 🍲
        COCHE 🚗 CARRO 🚗 AUTO 🚗 AUTOBÚS 🚌 BUS 🚌 CAMIÓN 🚚 TREN 🚂 AVIÓN ✈️ BARCO ⛵ BICI 🚲
        BICICLETA 🚲 TRACTOR 🚜 MOTO 🏍️
        PELOTA ⚽ BALÓN ⚽ LIBRO 📚 SOMBRERO 🎩 ZAPATO 👟 ZAPATOS 👟 CALCETÍN 🧦 VESTIDO 👗 CORONA 👑
        PRINCESA 👸 PRÍNCIPE 🤴 REINA 👸 REY 🤴 CASTILLO 🏰 HADA 🧚 VARITA 🪄 SIRENA 🧜‍♀️ ROBOT 🤖
        FANTASMA 👻 PIRATA 🏴‍☠️ GLOBO 🎈 GLOBOS 🎈 REGALO 🎁 MÚSICA 🎵 CANCIÓN 🎵 BAILE 💃 BAILAR 💃
        TAMBOR 🥁 PIANO 🎹 GUITARRA 🎸 CASA 🏠 ESCUELA 🏫 COLE 🏫 PARQUE 🎡 CAMA 🛏️ BAÑO 🛁
        MUÑECA 🪆 JUGUETE 🧸 OSITO 🧸 COMETA 🪁 BURBUJA 🫧 BURBUJAS 🫧 PUZLE 🧩 TELÉFONO 📱
        OJO 👁️ OJOS 👀 NARIZ 👃 OREJA 👂 MANO 🖐️ PIE 🦶 DIENTE 🦷
        ROJO 🔴 AZUL 🔵 VERDE 🟢 AMARILLO 🟡 MORADO 🟣 NEGRO ⚫ BLANCO ⚪
        UNO 1️⃣ DOS 2️⃣ TRES 3️⃣ CUATRO 4️⃣ CINCO 5️⃣ SEIS 6️⃣ SIETE 7️⃣ OCHO 8️⃣ NUEVE 9️⃣ DIEZ 🔟
        CACA 💩 PEDO 💨 ZOO 🦁 GRANJA 🚜
      `),
    },

    en: {
      name: 'English',
      speech: 'en-US',
      voices: ['Samantha', 'Karen', 'Moira', 'Tessa', 'Google US English', 'Google UK English Female', 'Microsoft Aria', 'Microsoft Zira', 'Daniel', 'Alex'],
      ui: {
        title: 'Rainbow Letters',
        tap: 'Press any key or tap to play',
        hint: 'Type a letter!',
        greeting: "Let's type some rainbow letters!",
        music: 'Music on / off',
        fullscreen: 'Full screen',
        language: 'Language',
      },
      letters: pairs(`
        A 🍎 B 🐝 C 🐱 D 🐶 E 🐘 F 🐸 G 🍇 H 💖 I 🍦 J 🧃 K 🪁 L 🦁 M 🌙
        N 🍜 O 🐙 P 🐷 Q 👸 R 🌈 S ⭐ T 🐯 U 🦄 V 🎻 W 🐳 X 🩻 Y 🧶 Z 🦓
      `),
      words: pairs(`
        CAT 🐱 KITTY 🐱 KITTEN 🐱 DOG 🐶 PUPPY 🐶 FISH 🐟 BIRD 🐦 BEE 🐝 FROG 🐸 PIG 🐷 COW 🐮 DUCK 🦆
        BEAR 🐻 BUNNY 🐰 RABBIT 🐰 HORSE 🐴 PONY 🐴 LION 🦁 TIGER 🐯 MONKEY 🐵 ELEPHANT 🐘 GIRAFFE 🦒
        ZEBRA 🦓 OWL 🦉 BUTTERFLY 🦋 BUG 🐛 LADYBUG 🐞 SNAIL 🐌 TURTLE 🐢 WHALE 🐳 DOLPHIN 🐬
        OCTOPUS 🐙 PENGUIN 🐧 CHICKEN 🐔 CHICK 🐥 SHEEP 🐑 MOUSE 🐭 DINO 🦖 DINOSAUR 🦖 DRAGON 🐉
        SHARK 🦈 CRAB 🦀 UNICORN 🦄 UNICORNS 🦄 FOX 🦊 WOLF 🐺 KOALA 🐨 PANDA 🐼 SPIDER 🕷️ ANT 🐜
        SUN ☀️ MOON 🌙 STAR ⭐ STARS ⭐ RAINBOW 🌈 CLOUD ☁️ RAIN 🌧️ SNOW ❄️ SNOWMAN ⛄ FLOWER 🌸
        FLOWERS 🌸 TREE 🌳 ROSE 🌹 SUNFLOWER 🌻 LEAF 🍃 EARTH 🌍 PLANET 🪐 ROCKET 🚀 SEA 🌊 OCEAN 🌊
        BEACH 🏖️ WATER 💧 FIRE 🔥
        HEART 💖 HEARTS 💖 LOVE 💖 HUG 🤗 KISS 😘 HAPPY 😊 SMILE 😊 SILLY 🤪 FUNNY 😂 SLEEPY 😴 WOW 🤩
        YAY 🎉 PARTY 🎉 FUN 🎉 HI 👋 HELLO 👋 BYE 👋 YES 👍 NO 🙅 OK 👌 SPARKLE ✨ SPARKLES ✨
        GLITTER ✨ MAGIC ✨
        MOM 👩 MUM 👩 MOMMY 👩 MUMMY 👩 MAMA 👩 DAD 👨 DADDY 👨 PAPA 👨 BABY 👶 GRANDMA 👵 NANA 👵
        GRANNY 👵 GRANDPA 👴 SISTER 👧 BROTHER 👦 GIRL 👧 BOY 👦 FRIEND 🧑‍🤝‍🧑 ME 🙋 YOU 👉
        CAKE 🎂 BIRTHDAY 🎂 APPLE 🍎 BANANA 🍌 STRAWBERRY 🍓 GRAPES 🍇 ORANGE 🍊 PIZZA 🍕 COOKIE 🍪
        COOKIES 🍪 CANDY 🍬 LOLLIPOP 🍭 ICECREAM 🍦 DONUT 🍩 EGG 🥚 MILK 🥛 CHEESE 🧀 BREAD 🍞
        CARROT 🥕 WATERMELON 🍉 CHERRY 🍒 PEACH 🍑 PEAR 🍐 LEMON 🍋 PINEAPPLE 🍍 CUPCAKE 🧁
        CHOCOLATE 🍫 HONEY 🍯 JUICE 🧃 SOUP 🍲 PASTA 🍝
        CAR 🚗 BUS 🚌 TRUCK 🚚 TRAIN 🚂 PLANE ✈️ BOAT ⛵ BIKE 🚲 TRACTOR 🚜
        BALL ⚽ BOOK 📚 HAT 🎩 SHOE 👟 SHOES 👟 SOCK 🧦 SOCKS 🧦 DRESS 👗 CROWN 👑 PRINCESS 👸
        PRINCE 🤴 QUEEN 👸 KING 🤴 CASTLE 🏰 FAIRY 🧚 WAND 🪄 MERMAID 🧜‍♀️ ROBOT 🤖 GHOST 👻
        PIRATE 🏴‍☠️ BALLOON 🎈 BALLOONS 🎈 GIFT 🎁 PRESENT 🎁 MUSIC 🎵 SONG 🎵 DANCE 💃 DRUM 🥁
        PIANO 🎹 GUITAR 🎸 HOUSE 🏠 HOME 🏠 SCHOOL 🏫 PARK 🎡 BED 🛏️ BATH 🛁 DOLL 🪆 TOY 🧸 TEDDY 🧸
        PUZZLE 🧩 KITE 🪁 BUBBLE 🫧 BUBBLES 🫧
        EYE 👁️ EYES 👀 NOSE 👃 EAR 👂 HAND 🖐️ FOOT 🦶 TOOTH 🦷
        RED 🔴 BLUE 🔵 GREEN 🟢 YELLOW 🟡 PINK 🩷 PURPLE 🟣 BLACK ⚫ WHITE ⚪
        ONE 1️⃣ TWO 2️⃣ THREE 3️⃣ FOUR 4️⃣ FIVE 5️⃣ SIX 6️⃣ SEVEN 7️⃣ EIGHT 8️⃣ NINE 9️⃣ TEN 🔟 ABC 🔤
        POOP 💩 POO 💩 BOO 👻 ZOO 🦁 FARM 🚜
      `),
    },

    fr: {
      name: 'Français',
      speech: 'fr-FR',
      voices: ['Amélie', 'Amelie', 'Audrey', 'Aurélie', 'Google français', 'Microsoft Denise', 'Microsoft Julie', 'Thomas'],
      ui: {
        title: 'Lettres Arc-en-ciel',
        tap: 'Appuie sur une touche ou touche l’écran pour jouer',
        hint: 'Tape une lettre !',
        greeting: 'On écrit des lettres arc-en-ciel !',
        music: 'Musique',
        fullscreen: 'Plein écran',
        language: 'Langue',
      },
      letters: pairs(`
        A ✈️ B 🍌 C 🐱 D 🦖 E 🐘 F 🌸 G 🎂 H 🦉 I 🏝️ J 🧸 K 🐨 L 🦁 M 🏠
        N ☁️ O 🐻 P 🐟 Q 4️⃣ R 🦊 S ☀️ T 🐢 U 1️⃣ V 🐮 W 🚃 X 🩻 Y 👀 Z 🦓
      `),
      words: pairs(`
        CHAT 🐱 CHATON 🐱 CHIEN 🐶 CHIOT 🐶 POISSON 🐟 OISEAU 🐦 ABEILLE 🐝 GRENOUILLE 🐸 COCHON 🐷
        VACHE 🐮 CANARD 🦆 OURS 🐻 LAPIN 🐰 CHEVAL 🐴 PONEY 🐴 LION 🦁 TIGRE 🐯 SINGE 🐵 ÉLÉPHANT 🐘
        GIRAFE 🦒 ZÈBRE 🦓 HIBOU 🦉 PAPILLON 🦋 ESCARGOT 🐌 TORTUE 🐢 BALEINE 🐳 DAUPHIN 🐬 PIEUVRE 🐙
        PINGOUIN 🐧 POULE 🐔 POUSSIN 🐥 MOUTON 🐑 SOURIS 🐭 DINOSAURE 🦖 DINO 🦖 DRAGON 🐉 REQUIN 🦈
        CRABE 🦀 LICORNE 🦄 RENARD 🦊 LOUP 🐺 KOALA 🐨 PANDA 🐼 COCCINELLE 🐞 ARAIGNÉE 🕷️ FOURMI 🐜
        SOLEIL ☀️ LUNE 🌙 ÉTOILE ⭐ ÉTOILES ⭐ ARCENCIEL 🌈 NUAGE ☁️ PLUIE 🌧️ NEIGE ❄️ FLEUR 🌸 FLEURS 🌸
        ARBRE 🌳 ROSE 🌹 FEUILLE 🍃 TERRE 🌍 PLANÈTE 🪐 FUSÉE 🚀 MER 🌊 PLAGE 🏖️ EAU 💧 FEU 🔥
        COEUR 💖 AMOUR 💖 CÂLIN 🤗 BISOU 😘 CONTENT 😊 SOURIRE 😊 RIRE 😂 BONJOUR 👋 SALUT 👋 COUCOU 👋
        OUI 👍 NON 🙅 FÊTE 🎉 BRAVO 🎉 MAGIE ✨
        MAMAN 👩 PAPA 👨 BÉBÉ 👶 MAMIE 👵 PAPI 👴 SOEUR 👧 FRÈRE 👦 FILLE 👧 GARÇON 👦 AMI 🧑‍🤝‍🧑
        AMIE 🧑‍🤝‍🧑 MOI 🙋 TOI 👉
        GÂTEAU 🎂 ANNIVERSAIRE 🎂 POMME 🍎 BANANE 🍌 FRAISE 🍓 RAISIN 🍇 ORANGE 🍊 PIZZA 🍕 BISCUIT 🍪
        BONBON 🍬 SUCETTE 🍭 GLACE 🍦 BEIGNET 🍩 OEUF 🥚 LAIT 🥛 FROMAGE 🧀 PAIN 🍞 CAROTTE 🥕
        PASTÈQUE 🍉 CERISE 🍒 CITRON 🍋 POIRE 🍐 ANANAS 🍍 CHOCOLAT 🍫 MIEL 🍯 JUS 🧃 SOUPE 🍲 CRÊPE 🥞
        VOITURE 🚗 AUTO 🚗 BUS 🚌 CAMION 🚚 TRAIN 🚂 AVION ✈️ BATEAU ⛵ VÉLO 🚲 TRACTEUR 🚜 MOTO 🏍️
        BALLON 🎈 BALLE ⚽ LIVRE 📚 CHAPEAU 🎩 CHAUSSURE 👟 CHAUSSETTE 🧦 ROBE 👗 COURONNE 👑
        PRINCESSE 👸 PRINCE 🤴 REINE 👸 ROI 🤴 CHÂTEAU 🏰 FÉE 🧚 BAGUETTE 🪄 SIRÈNE 🧜‍♀️ ROBOT 🤖
        FANTÔME 👻 PIRATE 🏴‍☠️ CADEAU 🎁 MUSIQUE 🎵 CHANSON 🎵 DANSE 💃 TAMBOUR 🥁 PIANO 🎹 GUITARE 🎸
        MAISON 🏠 ÉCOLE 🏫 PARC 🎡 LIT 🛏️ BAIN 🛁 POUPÉE 🪆 JOUET 🧸 NOUNOURS 🧸 DOUDOU 🧸 BULLE 🫧
        BULLES 🫧 PUZZLE 🧩 TÉLÉPHONE 📱
        OEIL 👁️ YEUX 👀 NEZ 👃 OREILLE 👂 MAIN 🖐️ PIED 🦶 DENT 🦷
        ROUGE 🔴 BLEU 🔵 VERT 🟢 JAUNE 🟡 VIOLET 🟣 NOIR ⚫ BLANC ⚪
        UN 1️⃣ DEUX 2️⃣ TROIS 3️⃣ QUATRE 4️⃣ CINQ 5️⃣ SIX 6️⃣ SEPT 7️⃣ HUIT 8️⃣ NEUF 9️⃣ DIX 🔟
        CACA 💩 PROUT 💨 ZOO 🦁 FERME 🚜
      `),
    },

    de: {
      name: 'Deutsch',
      speech: 'de-DE',
      voices: ['Anna', 'Petra', 'Google Deutsch', 'Microsoft Katja', 'Microsoft Hedda', 'Markus'],
      ui: {
        title: 'Regenbogen-Buchstaben',
        tap: 'Drück eine Taste oder tipp, um zu spielen',
        hint: 'Tipp einen Buchstaben!',
        greeting: 'Lass uns Regenbogen-Buchstaben tippen!',
        music: 'Musik',
        fullscreen: 'Vollbild',
        language: 'Sprache',
      },
      letters: pairs(`
        A 🍎 B 🐻 C 🤡 D 🐉 E 🐘 F 🐟 G 🦒 H 🐶 I 🦔 J 🧥 K 🐱 L 🦁 M 🐭
        N 👃 O 🐙 P 🐴 Q 🟦 R 🌈 S ☀️ T 🐯 U ⏰ V 🐦 W 🐳 X 🎹 Y ⛵ Z 🦓
      `),
      words: pairs(`
        KATZE 🐱 KÄTZCHEN 🐱 HUND 🐶 WELPE 🐶 FISCH 🐟 VOGEL 🐦 BIENE 🐝 FROSCH 🐸 SCHWEIN 🐷 KUH 🐮
        ENTE 🦆 BÄR 🐻 HASE 🐰 KANINCHEN 🐰 PFERD 🐴 PONY 🐴 LÖWE 🦁 TIGER 🐯 AFFE 🐵 ELEFANT 🐘
        GIRAFFE 🦒 ZEBRA 🦓 EULE 🦉 SCHMETTERLING 🦋 SCHNECKE 🐌 SCHILDKRÖTE 🐢 WAL 🐳 DELFIN 🐬
        KRAKE 🐙 PINGUIN 🐧 HUHN 🐔 KÜKEN 🐥 SCHAF 🐑 MAUS 🐭 DINOSAURIER 🦖 DINO 🦖 DRACHE 🐉 HAI 🦈
        KRABBE 🦀 EINHORN 🦄 FUCHS 🦊 WOLF 🐺 KOALA 🐨 PANDA 🐼 MARIENKÄFER 🐞 SPINNE 🕷️ AMEISE 🐜
        IGEL 🦔
        SONNE ☀️ MOND 🌙 STERN ⭐ STERNE ⭐ REGENBOGEN 🌈 WOLKE ☁️ REGEN 🌧️ SCHNEE ❄️ BLUME 🌸 BLUMEN 🌸
        BAUM 🌳 ROSE 🌹 BLATT 🍃 ERDE 🌍 PLANET 🪐 RAKETE 🚀 MEER 🌊 STRAND 🏖️ WASSER 💧 FEUER 🔥
        HERZ 💖 LIEBE 💖 UMARMUNG 🤗 KUSS 😘 GLÜCKLICH 😊 LÄCHELN 😊 LACHEN 😂 HALLO 👋 TSCHÜSS 👋
        JA 👍 NEIN 🙅 PARTY 🎉 JUHU 🎉 TOLL 🤩 MAGIE ✨ ZAUBER ✨
        MAMA 👩 MAMI 👩 PAPA 👨 PAPI 👨 BABY 👶 OMA 👵 OPA 👴 SCHWESTER 👧 BRUDER 👦 MÄDCHEN 👧
        JUNGE 👦 FREUND 🧑‍🤝‍🧑 FREUNDIN 🧑‍🤝‍🧑 ICH 🙋 DU 👉
        KUCHEN 🎂 TORTE 🎂 GEBURTSTAG 🎂 APFEL 🍎 BANANE 🍌 ERDBEERE 🍓 TRAUBE 🍇 TRAUBEN 🍇 ORANGE 🍊
        PIZZA 🍕 KEKS 🍪 BONBON 🍬 LUTSCHER 🍭 EIS 🍦 DONUT 🍩 EI 🥚 MILCH 🥛 KÄSE 🧀 BROT 🍞
        KAROTTE 🥕 MÖHRE 🥕 MELONE 🍉 KIRSCHE 🍒 ZITRONE 🍋 BIRNE 🍐 ANANAS 🍍 SCHOKOLADE 🍫 HONIG 🍯
        SAFT 🧃 SUPPE 🍲 NUDELN 🍜
        AUTO 🚗 BUS 🚌 LASTER 🚚 LKW 🚚 ZUG 🚂 FLUGZEUG ✈️ BOOT ⛵ SCHIFF 🚢 RAD 🚲 FAHRRAD 🚲
        TRAKTOR 🚜 MOTORRAD 🏍️
        BALL ⚽ BUCH 📚 HUT 🎩 SCHUH 👟 SCHUHE 👟 SOCKE 🧦 KLEID 👗 KRONE 👑 PRINZESSIN 👸 PRINZ 🤴
        KÖNIGIN 👸 KÖNIG 🤴 SCHLOSS 🏰 BURG 🏰 FEE 🧚 ZAUBERSTAB 🪄 MEERJUNGFRAU 🧜‍♀️ ROBOTER 🤖
        GEIST 👻 PIRAT 🏴‍☠️ LUFTBALLON 🎈 BALLON 🎈 GESCHENK 🎁 MUSIK 🎵 LIED 🎵 TANZ 💃 TANZEN 💃
        TROMMEL 🥁 KLAVIER 🎹 GITARRE 🎸 HAUS 🏠 SCHULE 🏫 KITA 🏫 PARK 🎡 BETT 🛏️ BAD 🛁 PUPPE 🪆
        SPIELZEUG 🧸 TEDDY 🧸 DRACHEN 🪁 SEIFENBLASE 🫧 PUZZLE 🧩 HANDY 📱
        AUGE 👁️ AUGEN 👀 NASE 👃 OHR 👂 HAND 🖐️ FUSS 🦶 ZAHN 🦷
        ROT 🔴 BLAU 🔵 GRÜN 🟢 GELB 🟡 LILA 🟣 ROSA 🩷 SCHWARZ ⚫ WEISS ⚪
        EINS 1️⃣ ZWEI 2️⃣ DREI 3️⃣ VIER 4️⃣ FÜNF 5️⃣ SECHS 6️⃣ SIEBEN 7️⃣ ACHT 8️⃣ NEUN 9️⃣ ZEHN 🔟
        KACKA 💩 KACKE 💩 PUPS 💨 ZOO 🦁 BAUERNHOF 🚜
      `),
    },

    pt: {
      name: 'Português',
      speech: 'pt-BR',
      voices: ['Luciana', 'Joana', 'Google português do Brasil', 'Microsoft Francisca', 'Microsoft Maria', 'Joaquim', 'Felipe'],
      ui: {
        title: 'Letras Arco-íris',
        tap: 'Aperta uma tecla ou toca para jogar',
        hint: 'Escreve uma letra!',
        greeting: 'Vamos escrever letras de arco-íris!',
        music: 'Música',
        fullscreen: 'Tela cheia',
        language: 'Idioma',
      },
      letters: pairs(`
        A 🐝 B ⚽ C 🐶 D 🦖 E 🐘 F 🌸 G 🐱 H 🦛 I 🏝️ J 🐊 K 🥝 L 🦁 M 🐵
        N ☁️ O 🥚 P 🐟 Q 🧀 R 🐭 S ☀️ T 🐢 U 🦄 V 🐮 W 🧇 X ☕ Y 🧘 Z 🦓
      `),
      words: pairs(`
        GATO 🐱 GATINHO 🐱 CACHORRO 🐶 CÃO 🐶 CACHORRINHO 🐶 PEIXE 🐟 PÁSSARO 🐦 PASSARINHO 🐦 ABELHA 🐝
        SAPO 🐸 PORCO 🐷 PORQUINHO 🐷 VACA 🐮 PATO 🦆 URSO 🐻 COELHO 🐰 CAVALO 🐴 PÔNEI 🐴 LEÃO 🦁
        TIGRE 🐯 MACACO 🐵 ELEFANTE 🐘 GIRAFA 🦒 ZEBRA 🦓 CORUJA 🦉 BORBOLETA 🦋 CARACOL 🐌
        TARTARUGA 🐢 BALEIA 🐳 GOLFINHO 🐬 POLVO 🐙 PINGUIM 🐧 GALINHA 🐔 PINTINHO 🐥 OVELHA 🐑 RATO 🐭
        DINOSSAURO 🦖 DINO 🦖 DRAGÃO 🐉 TUBARÃO 🦈 CARANGUEJO 🦀 UNICÓRNIO 🦄 RAPOSA 🦊 LOBO 🐺
        COALA 🐨 PANDA 🐼 JOANINHA 🐞 ARANHA 🕷️ FORMIGA 🐜 JACARÉ 🐊
        SOL ☀️ LUA 🌙 ESTRELA ⭐ ESTRELAS ⭐ ARCOÍRIS 🌈 NUVEM ☁️ CHUVA 🌧️ NEVE ❄️ FLOR 🌸 FLORES 🌸
        ÁRVORE 🌳 ROSA 🌹 FOLHA 🍃 TERRA 🌍 PLANETA 🪐 FOGUETE 🚀 MAR 🌊 PRAIA 🏖️ ÁGUA 💧 FOGO 🔥
        CORAÇÃO 💖 AMOR 💖 ABRAÇO 🤗 BEIJO 😘 FELIZ 😊 SORRISO 😊 RISO 😂 OI 👋 OLÁ 👋 TCHAU 👋
        ADEUS 👋 SIM 👍 NÃO 🙅 FESTA 🎉 OBA 🎉 UAU 🤩 MAGIA ✨
        MAMÃE 👩 MÃE 👩 PAPAI 👨 PAI 👨 BEBÊ 👶 VOVÓ 👵 AVÓ 👵 VOVÔ 👴 AVÔ 👴 IRMÃ 👧 IRMÃO 👦
        MENINA 👧 MENINO 👦 AMIGO 🧑‍🤝‍🧑 AMIGA 🧑‍🤝‍🧑 EU 🙋 VOCÊ 👉 TU 👉
        BOLO 🎂 ANIVERSÁRIO 🎂 MAÇÃ 🍎 BANANA 🍌 MORANGO 🍓 UVA 🍇 UVAS 🍇 LARANJA 🍊 PIZZA 🍕
        BISCOITO 🍪 BOLACHA 🍪 BALA 🍬 DOCE 🍬 PIRULITO 🍭 SORVETE 🍦 GELADO 🍦 ROSQUINHA 🍩 OVO 🥚
        LEITE 🥛 QUEIJO 🧀 PÃO 🍞 CENOURA 🥕 MELANCIA 🍉 CEREJA 🍒 LIMÃO 🍋 PERA 🍐 ABACAXI 🍍
        CHOCOLATE 🍫 MEL 🍯 SUCO 🧃 SOPA 🍲
        CARRO 🚗 ÔNIBUS 🚌 AUTOCARRO 🚌 CAMINHÃO 🚚 TREM 🚂 COMBOIO 🚂 AVIÃO ✈️ BARCO ⛵ BICICLETA 🚲
        BICI 🚲 TRATOR 🚜 MOTO 🏍️
        BOLA ⚽ LIVRO 📚 CHAPÉU 🎩 SAPATO 👟 SAPATOS 👟 MEIA 🧦 VESTIDO 👗 COROA 👑 PRINCESA 👸
        PRÍNCIPE 🤴 RAINHA 👸 REI 🤴 CASTELO 🏰 FADA 🧚 VARINHA 🪄 SEREIA 🧜‍♀️ ROBÔ 🤖 FANTASMA 👻
        PIRATA 🏴‍☠️ BALÃO 🎈 BALÕES 🎈 PRESENTE 🎁 MÚSICA 🎵 CANÇÃO 🎵 DANÇA 💃 DANÇAR 💃 TAMBOR 🥁
        PIANO 🎹 VIOLÃO 🎸 GUITARRA 🎸 CASA 🏠 ESCOLA 🏫 PARQUE 🎡 CAMA 🛏️ BANHO 🛁 BONECA 🪆
        BRINQUEDO 🧸 URSINHO 🧸 PIPA 🪁 BOLHA 🫧 BOLHAS 🫧 QUEBRACABEÇA 🧩 CELULAR 📱 TELEFONE 📱
        OLHO 👁️ OLHOS 👀 NARIZ 👃 ORELHA 👂 MÃO 🖐️ PÉ 🦶 DENTE 🦷
        VERMELHO 🔴 AZUL 🔵 VERDE 🟢 AMARELO 🟡 ROXO 🟣 PRETO ⚫ BRANCO ⚪
        UM 1️⃣ DOIS 2️⃣ TRÊS 3️⃣ QUATRO 4️⃣ CINCO 5️⃣ SEIS 6️⃣ SETE 7️⃣ OITO 8️⃣ NOVE 9️⃣ DEZ 🔟
        COCÔ 💩 PUM 💨 ZOO 🦁 ZOOLÓGICO 🦁 FAZENDA 🚜
      `),
    },

    it: {
      name: 'Italiano',
      speech: 'it-IT',
      voices: ['Alice', 'Federica', 'Google italiano', 'Microsoft Elsa', 'Microsoft Isabella', 'Luca'],
      ui: {
        title: 'Lettere Arcobaleno',
        tap: 'Premi un tasto o tocca per giocare',
        hint: 'Scrivi una lettera!',
        greeting: 'Scriviamo delle lettere arcobaleno!',
        music: 'Musica',
        fullscreen: 'Schermo intero',
        language: 'Lingua',
      },
      letters: pairs(`
        A 🐝 B 🍌 C 🐶 D 🦖 E 🐘 F 🌸 G 🐱 H 🏨 I 🏝️ J 👖 K 🐨 L 🦁 M 🍎
        N ☁️ O 🐻 P 🐟 Q 4️⃣ R 🐸 S ☀️ T 🐢 U 🍇 V 🌋 W 🧇 X 🎹 Y 🪀 Z 🦓
      `),
      words: pairs(`
        GATTO 🐱 GATTINO 🐱 MICIO 🐱 CANE 🐶 CAGNOLINO 🐶 PESCE 🐟 UCCELLO 🐦 UCCELLINO 🐦 APE 🐝
        RANA 🐸 MAIALE 🐷 MAIALINO 🐷 MUCCA 🐮 ANATRA 🦆 PAPERA 🦆 ORSO 🐻 CONIGLIO 🐰 CAVALLO 🐴
        PONY 🐴 LEONE 🦁 TIGRE 🐯 SCIMMIA 🐵 ELEFANTE 🐘 GIRAFFA 🦒 ZEBRA 🦓 GUFO 🦉 FARFALLA 🦋
        LUMACA 🐌 TARTARUGA 🐢 BALENA 🐳 DELFINO 🐬 POLPO 🐙 PINGUINO 🐧 GALLINA 🐔 PULCINO 🐥
        PECORA 🐑 TOPO 🐭 TOPOLINO 🐭 DINOSAURO 🦖 DINO 🦖 DRAGO 🐉 SQUALO 🦈 GRANCHIO 🦀 UNICORNO 🦄
        VOLPE 🦊 LUPO 🐺 KOALA 🐨 PANDA 🐼 COCCINELLA 🐞 RAGNO 🕷️ FORMICA 🐜
        SOLE ☀️ LUNA 🌙 STELLA ⭐ STELLE ⭐ ARCOBALENO 🌈 NUVOLA ☁️ PIOGGIA 🌧️ NEVE ❄️ FIORE 🌸 FIORI 🌸
        ALBERO 🌳 ROSA 🌹 FOGLIA 🍃 TERRA 🌍 PIANETA 🪐 RAZZO 🚀 MARE 🌊 SPIAGGIA 🏖️ ACQUA 💧 FUOCO 🔥
        CUORE 💖 AMORE 💖 ABBRACCIO 🤗 BACIO 😘 FELICE 😊 SORRISO 😊 RISATA 😂 CIAO 👋 SÌ 👍 NO 🙅
        FESTA 🎉 EVVIVA 🎉 WOW 🤩 MAGIA ✨
        MAMMA 👩 PAPÀ 👨 BABBO 👨 BIMBO 👶 BIMBA 👶 BEBÈ 👶 NONNA 👵 NONNO 👴 SORELLA 👧 FRATELLO 👦
        BAMBINA 👧 BAMBINO 👦 AMICO 🧑‍🤝‍🧑 AMICA 🧑‍🤝‍🧑 IO 🙋 TU 👉
        TORTA 🎂 COMPLEANNO 🎂 MELA 🍎 BANANA 🍌 FRAGOLA 🍓 UVA 🍇 ARANCIA 🍊 PIZZA 🍕 BISCOTTO 🍪
        CARAMELLA 🍬 LECCALECCA 🍭 GELATO 🍦 CIAMBELLA 🍩 UOVO 🥚 LATTE 🥛 FORMAGGIO 🧀 PANE 🍞
        CAROTA 🥕 ANGURIA 🍉 CILIEGIA 🍒 LIMONE 🍋 PERA 🍐 ANANAS 🍍 CIOCCOLATO 🍫 MIELE 🍯 SUCCO 🧃
        PASTA 🍝 SPAGHETTI 🍝 ZUPPA 🍲
        MACCHINA 🚗 AUTO 🚗 AUTOBUS 🚌 CAMION 🚚 TRENO 🚂 AEREO ✈️ BARCA ⛵ NAVE 🚢 BICI 🚲
        BICICLETTA 🚲 TRATTORE 🚜 MOTO 🏍️
        PALLA ⚽ PALLONE ⚽ LIBRO 📚 CAPPELLO 🎩 SCARPA 👟 SCARPE 👟 CALZINO 🧦 VESTITO 👗 CORONA 👑
        PRINCIPESSA 👸 PRINCIPE 🤴 REGINA 👸 RE 🤴 CASTELLO 🏰 FATA 🧚 BACCHETTA 🪄 SIRENA 🧜‍♀️
        ROBOT 🤖 FANTASMA 👻 PIRATA 🏴‍☠️ PALLONCINO 🎈 REGALO 🎁 MUSICA 🎵 CANZONE 🎵 BALLO 💃
        BALLARE 💃 TAMBURO 🥁 PIANOFORTE 🎹 PIANO 🎹 CHITARRA 🎸 CASA 🏠 SCUOLA 🏫 ASILO 🏫 PARCO 🎡
        LETTO 🛏️ BAGNO 🛁 BAMBOLA 🪆 GIOCATTOLO 🧸 ORSETTO 🧸 AQUILONE 🪁 BOLLA 🫧 BOLLE 🫧 PUZZLE 🧩
        TELEFONO 📱
        OCCHIO 👁️ OCCHI 👀 NASO 👃 ORECCHIO 👂 MANO 🖐️ PIEDE 🦶 DENTE 🦷
        ROSSO 🔴 BLU 🔵 VERDE 🟢 GIALLO 🟡 VIOLA 🟣 NERO ⚫ BIANCO ⚪
        UNO 1️⃣ DUE 2️⃣ TRE 3️⃣ QUATTRO 4️⃣ CINQUE 5️⃣ SEI 6️⃣ SETTE 7️⃣ OTTO 8️⃣ NOVE 9️⃣ DIECI 🔟
        CACCA 💩 PUZZETTA 💨 ZOO 🦁 FATTORIA 🚜
      `),
    },

    sv: {
      name: 'Svenska',
      speech: 'sv-SE',
      voices: ['Alva', 'Klara', 'Google svenska', 'Microsoft Sofie', 'Microsoft Hillevi', 'Oskar'],
      ui: {
        title: 'Regnbågsbokstäver',
        tap: 'Tryck på en tangent eller peka för att spela',
        hint: 'Skriv en bokstav!',
        greeting: 'Vi skriver regnbågsbokstäver!',
        music: 'Musik',
        fullscreen: 'Helskärm',
        language: 'Språk',
      },
      letters: pairs(`
        A 🐵 B 🐻 C 🚲 D 🐬 E 🐘 F 🐟 G 🐸 H 🐶 I 🦔 J 🍓 K 🐱 L 🦁 M 🌙
        N 🧸 O 🐍 P 🐧 Q 👸 R 🌈 S ☀️ T 🚂 U 🦉 V 🐳 W 🧇 X 🎹 Y 🥣 Z 🦓
        Å ⛈️ Ä 🍎 Ö 🏝️
      `),
      words: pairs(`
        KATT 🐱 KATTUNGE 🐱 KISSE 🐱 HUND 🐶 VALP 🐶 FISK 🐟 FÅGEL 🐦 BI 🐝 GRODA 🐸 GRIS 🐷 KO 🐮
        ANKA 🦆 BJÖRN 🐻 KANIN 🐰 HÄST 🐴 PONNY 🐴 LEJON 🦁 TIGER 🐯 APA 🐵 ELEFANT 🐘 GIRAFF 🦒
        ZEBRA 🦓 UGGLA 🦉 FJÄRIL 🦋 SNIGEL 🐌 SKÖLDPADDA 🐢 VAL 🐳 DELFIN 🐬 BLÄCKFISK 🐙 PINGVIN 🐧
        HÖNA 🐔 KYCKLING 🐥 FÅR 🐑 MUS 🐭 DINOSAURIE 🦖 DINO 🦖 DRAKE 🐉 HAJ 🦈 KRABBA 🦀
        ENHÖRNING 🦄 RÄV 🦊 VARG 🐺 KOALA 🐨 PANDA 🐼 NYCKELPIGA 🐞 SPINDEL 🕷️ MYRA 🐜 IGELKOTT 🦔
        ÄLG 🦌 ORM 🐍
        SOL ☀️ MÅNE 🌙 STJÄRNA ⭐ STJÄRNOR ⭐ REGNBÅGE 🌈 MOLN ☁️ REGN 🌧️ SNÖ ❄️ SNÖGUBBE ⛄ BLOMMA 🌸
        BLOMMOR 🌸 TRÄD 🌳 ROS 🌹 LÖV 🍃 JORDEN 🌍 PLANET 🪐 RAKET 🚀 HAV 🌊 STRAND 🏖️ VATTEN 💧
        ELD 🔥 ÅSKA ⛈️
        HJÄRTA 💖 KÄRLEK 💖 KRAM 🤗 PUSS 😘 GLAD 😊 LEENDE 😊 SKRATT 😂 HEJ 👋 HEJDÅ 👋 JA 👍 NEJ 🙅
        FEST 🎉 KALAS 🎉 HURRA 🎉 MAGI ✨ GLITTER ✨
        MAMMA 👩 PAPPA 👨 BEBIS 👶 MORMOR 👵 FARMOR 👵 MORFAR 👴 FARFAR 👴 SYSTER 👧 BROR 👦
        FLICKA 👧 POJKE 👦 KOMPIS 🧑‍🤝‍🧑 VÄN 🧑‍🤝‍🧑 JAG 🙋 DU 👉
        TÅRTA 🎂 FÖDELSEDAG 🎂 KAKA 🍪 KEX 🍪 ÄPPLE 🍎 BANAN 🍌 JORDGUBBE 🍓 DRUVA 🍇 DRUVOR 🍇
        APELSIN 🍊 PIZZA 🍕 GODIS 🍬 KLUBBA 🍭 GLASS 🍦 MUNK 🍩 ÄGG 🥚 MJÖLK 🥛 OST 🧀 BRÖD 🍞
        MOROT 🥕 VATTENMELON 🍉 KÖRSBÄR 🍒 CITRON 🍋 PÄRON 🍐 ANANAS 🍍 CHOKLAD 🍫 HONUNG 🍯
        JUICE 🧃 SAFT 🧃 SOPPA 🍲 PASTA 🍝 KORV 🌭 PANNKAKA 🥞 VÅFFLA 🧇 BULLE 🧁
        BIL 🚗 BUSS 🚌 LASTBIL 🚚 TÅG 🚂 FLYGPLAN ✈️ BÅT ⛵ CYKEL 🚲 TRAKTOR 🚜 MOTORCYKEL 🏍️
        BOLL ⚽ BOK 📚 HATT 🎩 SKO 👟 SKOR 👟 STRUMPA 🧦 KLÄNNING 👗 KRONA 👑 PRINSESSA 👸 PRINS 🤴
        DROTTNING 👸 KUNG 🤴 SLOTT 🏰 FE 🧚 ÄLVA 🧚 TROLLSTAV 🪄 SJÖJUNGFRU 🧜‍♀️ ROBOT 🤖 SPÖKE 👻
        PIRAT 🏴‍☠️ BALLONG 🎈 BALLONGER 🎈 PRESENT 🎁 MUSIK 🎵 SÅNG 🎵 DANS 💃 DANSA 💃 TRUMMA 🥁
        PIANO 🎹 GITARR 🎸 HUS 🏠 HEM 🏠 SKOLA 🏫 DAGIS 🏫 FÖRSKOLA 🏫 PARK 🎡 SÄNG 🛏️ BAD 🛁
        DOCKA 🪆 LEKSAK 🧸 NALLE 🧸 BUBBLA 🫧 BUBBLOR 🫧 PUSSEL 🧩 TELEFON 📱 MOBIL 📱
        ÖGA 👁️ ÖGON 👀 NÄSA 👃 ÖRA 👂 HAND 🖐️ FOT 🦶 TAND 🦷
        RÖD 🔴 BLÅ 🔵 GRÖN 🟢 GUL 🟡 LILA 🟣 ROSA 🩷 SVART ⚫ VIT ⚪
        ETT 1️⃣ TVÅ 2️⃣ TRE 3️⃣ FYRA 4️⃣ FEM 5️⃣ SEX 6️⃣ SJU 7️⃣ ÅTTA 8️⃣ NIO 9️⃣ TIO 🔟
        BAJS 💩 PRUTT 💨 FIS 💨 ZOO 🦁 DJURPARK 🦁 BONDGÅRD 🚜
      `),
    },
  };

  // The order the picker shows them in; the first is also the fallback default.
  return { order: ['en', 'es', 'sv', 'fr', 'de', 'pt', 'it'], data };
})();
