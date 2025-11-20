import React, { useState } from 'react';
import { Restaurant, Language, LocalizedString } from '../types';
import { MapPin, Clock, Phone, Utensils, Heart, Info } from 'lucide-react';

const TEXTS = {
  title: {
    es: "Bienvenidos a Las Palmas",
    en: "Welcome to Las Palmas",
    it: "Benvenuti a Las Palmas"
  },
  subtitle: {
    es: "Guía Gastronómica para el Grupo Erasmus",
    en: "Gastronomic Guide for the Erasmus Group",
    it: "Guida Gastronomica per il Gruppo Erasmus"
  },
  startPoint: {
    es: "Punto de partida",
    en: "Starting point",
    it: "Punto di partenza"
  },
  sections: {
    veryClose: {
      title: { es: "Muy Cerca", en: "Very Close", it: "Molto Vicino" },
      subtitle: { es: "A menos de 5 min caminando", en: "Less than 5 min walk", it: "A meno di 5 minuti a piedi" }
    },
    shortWalk: {
      title: { es: "Paseo Corto", en: "Short Walk", it: "Breve Passeggiata" },
      subtitle: { es: "5 - 10 min caminando", en: "5 - 10 min walk", it: "5 - 10 minuti a piedi" }
    },
    beachWalk: {
      title: { es: "Paseo por la Playa", en: "Beach Walk", it: "Passeggiata in Spiaggia" },
      subtitle: { es: "15 - 20 min caminando", en: "15 - 20 min walk", it: "15 - 20 minuti a piedi" }
    }
  },
  tips: {
    title: { es: "Consejos Útiles", en: "Useful Tips", it: "Consigli Utili" },
    schedule: {
      title: { es: "Horarios", en: "Schedules", it: "Orari" },
      text: { 
        es: "En España se come tarde (13:30-15:00) y cena tarde (20:30-22:00), aunque los sitios turísticos abren antes.",
        en: "In Spain, lunch (13:30-15:00) and dinner (20:30-22:00) are late, though tourist spots open earlier.",
        it: "In Spagna si pranza tardi (13:30-15:00) e si cena tardi (20:30-22:00), anche se i luoghi turistici aprono prima."
      }
    },
    coffee: {
      title: { es: "Café", en: "Coffee", it: "Caffè" },
      text: { 
        es: "Pide 'Espresso' o 'Café solo'. El café español a veces es torrefacto y sabe distinto al italiano.",
        en: "Order 'Espresso' or 'Café solo'. Spanish coffee is sometimes roasted with sugar and tastes different.",
        it: "Chiedi 'Espresso' o 'Café solo'. Il caffè spagnolo a volte è tostato con zucchero e ha un sapore diverso."
      }
    },
    tip: {
      title: { es: "Propina", en: "Tipping", it: "Mancia" },
      text: { 
        es: "No es obligatoria, pero se agradece un 5-10% si el servicio fue bueno.",
        en: "Not mandatory, but 5-10% is appreciated if service was good.",
        it: "Non è obbligatoria, ma il 5-10% è gradito se il servizio è stato buono."
      }
    },
    water: {
      title: { es: "Agua", en: "Water", it: "Acqua" },
      text: { 
        es: "Mejor pedir 'Agua mineral' (embotellada) para evitar cambios de sabor del agua del grifo.",
        en: "Better to order 'Mineral water' (bottled) to avoid tap water taste differences.",
        it: "Meglio ordinare 'Acqua minerale' (in bottiglia) per evitare il sapore dell'acqua del rubinetto."
      }
    }
  },
  labels: {
    note: { es: "Nota", en: "Note", it: "Nota" },
    price: { es: "Precio medio", en: "Avg Price", it: "Prezzo medio" }
  }
};

const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "Restaurante Hermanos García",
    description: {
      es: "Comida casera y abundante. Es lo más parecido a la comida 'de la nonna' (abuela) pero canaria.",
      en: "Homemade and abundant food. Closest thing to 'grandma's food' but Canarian.",
      it: "Cibo fatto in casa e abbondante. La cosa più simile alla cucina 'della nonna' ma canaria."
    },
    type: {
      es: "Comida Española / Menú del día",
      en: "Spanish Food / Daily Menu",
      it: "Cucina Spagnola / Menù del giorno"
    },
    starDish: {
      es: "Ropa Vieja, Paella o Pescado a la plancha",
      en: "Ropa Vieja, Paella or Grilled Fish",
      it: "Ropa Vieja, Paella o Pesce alla griglia"
    },
    price: { es: "10€ - 12€", en: "10€ - 12€", it: "10€ - 12€" },
    distance: { es: "140m (2 min)", en: "140m (2 min)", it: "140m (2 min)" },
    address: "C. del General Vives, 59",
    hours: { es: "Lun-Sáb 08:00–23:00", en: "Mon-Sat 08:00–23:00", it: "Lun-Sab 08:00–23:00" },
    phone: "+34 928 22 29 55",
    note: {
      es: "Comida muy sana. Excelente para presupuestos ajustados.",
      en: "Very healthy food. Excellent for tight budgets.",
      it: "Cibo molto sano. Eccellente per budget limitati."
    },
    category: 'VERY_CLOSE'
  },
  {
    id: 2,
    name: "Bodegón El Biberón",
    description: {
      es: "El lugar perfecto para probar las famosas 'tapas' españolas en un ambiente rústico.",
      en: "The perfect place to try famous Spanish 'tapas' in a rustic atmosphere.",
      it: "Il posto perfetto per provare le famose 'tapas' spagnole in un ambiente rustico."
    },
    type: {
      es: "Tapas, Picoteo Canario y Parrilla",
      en: "Tapas, Canarian Snacks and Grill",
      it: "Tapas, Spuntini Canari e Griglia"
    },
    starDish: {
      es: "Tabla de embutidos, Papas arrugadas con mojo",
      en: "Cured meats board, Wrinkled potatoes with mojo",
      it: "Tagliere di salumi, Patate 'arrugadas' con mojo"
    },
    price: { es: "15€ - 20€", en: "15€ - 20€", it: "15€ - 20€" },
    distance: { es: "160m (2 min)", en: "160m (2 min)", it: "160m (2 min)" },
    address: "C. Pedro Castillo Westerling, 15",
    hours: { es: "Todos los días 13:00–00:00", en: "Daily 13:00–00:00", it: "Tutti i giorni 13:00–00:00" },
    phone: "+34 928 27 13 95",
    note: {
      es: "Tienen opciones sin gluten. Muy buen ambiente para grupos grandes.",
      en: "Gluten-free options available. Great atmosphere for large groups.",
      it: "Hanno opzioni senza glutine. Ottima atmosfera per grandi gruppi."
    },
    category: 'VERY_CLOSE'
  },
  {
    id: 3,
    name: "O Sole Mío",
    description: {
      es: "Si los niños (o los profesores) extrañan Italia, esta es la opción segura cerca del hotel.",
      en: "If the kids (or teachers) miss Italy, this is the safe option near the hotel.",
      it: "Se i bambini (o gli insegnanti) sentono la mancanza dell'Italia, questa è l'opzione sicura vicino all'hotel."
    },
    type: {
      es: "Italiana / Pizzería tradicional",
      en: "Italian / Traditional Pizzeria",
      it: "Italiana / Pizzeria tradizionale"
    },
    starDish: {
      es: "Pizza al horno de leña o Lasaña",
      en: "Wood-fired Pizza or Lasagna",
      it: "Pizza cotta a legna o Lasagna"
    },
    price: { es: "15€ - 25€", en: "15€ - 25€", it: "15€ - 25€" },
    distance: { es: "300m (4 min)", en: "300m (4 min)", it: "300m (4 min)" },
    address: "C. Luis Morote, 26",
    hours: { es: "Todos los días 13:00–23:30", en: "Daily 13:00–23:30", it: "Tutti i giorni 13:00–23:30" },
    phone: "+34 928 26 44 54",
    category: 'VERY_CLOSE'
  },
  {
    id: 4,
    name: "Burger King",
    description: {
      es: "Opción rápida frente al mar. Lo conocen, es seguro y a los niños les gusta.",
      en: "Fast option by the sea. Known, safe, and kids like it.",
      it: "Opzione veloce di fronte al mare. Lo conoscono, è sicuro e piace ai bambini."
    },
    type: {
      es: "Fast Food",
      en: "Fast Food",
      it: "Fast Food"
    },
    starDish: {
      es: "Whopper / Menú infantil",
      en: "Whopper / Kids Menu",
      it: "Whopper / Menu bambini"
    },
    price: { es: "8€ - 10€", en: "8€ - 10€", it: "8€ - 10€" },
    distance: { es: "250m (3 min)", en: "250m (3 min)", it: "250m (3 min)" },
    address: "Paseo de Las Canteras, 52",
    hours: { es: "Abierto hasta tarde", en: "Open late", it: "Aperto fino a tardi" },
    category: 'VERY_CLOSE'
  },
  {
    id: 5,
    name: "Rockabilly Burger Bar",
    description: {
      es: "No es comida rápida; son hamburguesas gourmet de alta calidad.",
      en: "Not fast food; these are high-quality gourmet burgers.",
      it: "Non è fast food; sono hamburger gourmet di alta qualità."
    },
    type: {
      es: "Hamburguesería Gourmet",
      en: "Gourmet Burger Bar",
      it: "Hamburgeria Gourmet"
    },
    starDish: {
      es: "Hamburguesa Black Angus con papas caseras",
      en: "Black Angus Burger with homemade fries",
      it: "Hamburger Black Angus con patatine fatte in casa"
    },
    price: { es: "15€", en: "15€", it: "15€" },
    distance: { es: "550m (7 min)", en: "550m (7 min)", it: "550m (7 min)" },
    address: "C. Torres Quevedo, 18",
    hours: { es: "13:00–16:00 / 20:00–00:00", en: "13:00–16:00 / 20:00–00:00", it: "13:00–16:00 / 20:00–00:00" },
    phone: "+34 828 01 33 20",
    note: {
      es: "¡Las mejores burgers de la zona!",
      en: "The best burgers in the area!",
      it: "I migliori hamburger della zona!"
    },
    category: 'SHORT_WALK'
  },
  {
    id: 6,
    name: "SHINTORI II",
    description: {
      es: "Buffet libre de sushi y comida asiática a la carta. ¡Los niños pagan menos!",
      en: "All-you-can-eat sushi and Asian food à la carte. Kids pay less!",
      it: "Buffet di sushi e cucina asiatica alla carta. I bambini pagano meno!"
    },
    type: {
      es: "Japonés / Sushi Buffet",
      en: "Japanese / Sushi Buffet",
      it: "Giapponese / Buffet di Sushi"
    },
    starDish: {
      es: "Barco de Sushi variado o Tempura",
      en: "Assorted Sushi Boat or Tempura",
      it: "Barca di Sushi misto o Tempura"
    },
    price: { 
      es: "18.90€ Adultos | ~9.90€ Niños", 
      en: "18.90€ Adults | ~9.90€ Kids", 
      it: "18.90€ Adulti | ~9.90€ Bambini" 
    },
    distance: { es: "600m (8 min)", en: "600m (8 min)", it: "600m (8 min)" },
    address: "C. Olof Palme, 19",
    hours: { es: "13:00–16:30 / 20:00–23:30", en: "13:00–16:30 / 20:00–23:30", it: "13:00–16:30 / 20:00–23:30" },
    phone: "+34 928 22 06 77",
    category: 'SHORT_WALK'
  },
  {
    id: 8,
    name: "Addio Mare",
    description: {
      es: "Pizzería muy famosa en la isla. Ubicada en una plaza llena de vida local.",
      en: "Very famous pizzeria on the island. Located in a square full of local life.",
      it: "Pizzeria molto famosa sull'isola. Situata in una piazza piena di vita locale."
    },
    type: {
      es: "Italiana / Pizzería",
      en: "Italian / Pizzeria",
      it: "Italiana / Pizzeria"
    },
    starDish: {
      es: "Pizza 'Pizza solomillo' (con carne)",
      en: "Sirloin Pizza (with meat)",
      it: "Pizza al Filetto"
    },
    price: { es: "15€ - 20€", en: "15€ - 20€", it: "15€ - 20€" },
    distance: { es: "1.5 km (18-20 min)", en: "1.5 km (18-20 min)", it: "1.5 km (18-20 min)" },
    address: "Plaza del Pilar, 5",
    hours: { es: "13:00–00:00", en: "13:00–00:00", it: "13:00–00:00" },
    phone: "+34 828 98 48 57",
    note: {
      es: "La 'Pizza de solomillo' es legendaria aquí.",
      en: "The 'Sirloin Pizza' is legendary here.",
      it: "La 'Pizza al filetto' è leggendaria qui."
    },
    category: 'BEACH_WALK'
  },
  {
    id: 9,
    name: "Oh! Que Bueno",
    description: {
      es: "Ideal si quieren probar sabores latinos (venezolanos) y hamburguesas divertidas.",
      en: "Ideal if you want to try Latin flavors (Venezuelan) and fun burgers.",
      it: "Ideale se si vogliono provare sapori latini (venezuelani) e hamburger divertenti."
    },
    type: {
      es: "Grill / Hamburguesas / Arepas",
      en: "Grill / Burgers / Arepas",
      it: "Griglia / Hamburger / Arepas"
    },
    starDish: {
      es: "Tequeños, Arepas o Hamburguesas",
      en: "Tequeños, Arepas or Burgers",
      it: "Tequeños, Arepas o Hamburger"
    },
    price: { es: "12€ - 15€", en: "12€ - 15€", it: "12€ - 15€" },
    distance: { es: "1.5 km", en: "1.5 km", it: "1.5 km" },
    address: "Plaza del Pilar, 14",
    hours: { es: "13:00–00:00", en: "13:00–00:00", it: "13:00–00:00" },
    phone: "+34 928 27 48 74",
    note: {
      es: "A los niños les encantan los tequeños.",
      en: "Kids love the tequeños.",
      it: "I bambini adorano i tequeños."
    },
    category: 'BEACH_WALK'
  }
];

const SectionHeader: React.FC<{ title: LocalizedString; subtitle: LocalizedString; icon: React.ReactNode; lang: Language }> = ({ title, subtitle, icon, lang }) => (
  <div className="mb-6 mt-10 first:mt-0 border-b pb-2 border-indigo-100">
    <div className="flex items-center gap-2 text-indigo-600 mb-1">
      {icon}
      <h3 className="font-bold text-xl uppercase tracking-wide">{title[lang]}</h3>
    </div>
    <p className="text-slate-500 text-sm">{subtitle[lang]}</p>
  </div>
);

const RestaurantCard: React.FC<{ item: Restaurant; lang: Language }> = ({ item, lang }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-bold text-lg text-slate-800">{item.name}</h4>
      <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full">
        {item.price[lang]}
      </span>
    </div>
    <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
      <MapPin size={14} />
      <span>{item.distance[lang]}</span>
      <span className="mx-1">•</span>
      <span>{item.type[lang]}</span>
    </div>
    
    <p className="text-slate-600 text-sm mb-4 flex-grow italic">"{item.description[lang]}"</p>
    
    <div className="space-y-2 text-sm border-t pt-3 border-slate-50">
      <div className="flex items-start gap-2">
        <Heart size={16} className="text-rose-500 shrink-0 mt-0.5" />
        <span className="text-slate-700 font-medium">{item.starDish[lang]}</span>
      </div>
      <div className="flex items-center gap-2 text-slate-500">
        <Clock size={16} className="shrink-0" />
        <span>{item.hours[lang]}</span>
      </div>
      <div className="flex items-center gap-2 text-slate-500">
        <MapPin size={16} className="shrink-0" />
        <span className="truncate">{item.address}</span>
      </div>
    </div>
    
    {item.note && (
      <div className="mt-4 bg-amber-50 text-amber-800 text-xs p-2 rounded-md border border-amber-100 flex gap-2">
        <Info size={14} className="shrink-0 mt-0.5" />
        <span><strong>{TEXTS.labels.note[lang]}:</strong> {item.note[lang]}</span>
      </div>
    )}
  </div>
);

export const ErasmusGuide: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<Language>('es');

  return (
    <div className="max-w-5xl mx-auto p-6 pb-20">
      {/* Language Toggle */}
      <div className="fixed top-6 right-6 z-50 flex gap-2 bg-white p-2 rounded-full shadow-lg border border-slate-200">
        <button 
          onClick={() => setCurrentLang('es')}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${currentLang === 'es' ? 'bg-indigo-100 border-2 border-indigo-500' : 'hover:bg-slate-100'}`}
          title="Español"
        >
          🇪🇸
        </button>
        <button 
          onClick={() => setCurrentLang('en')}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${currentLang === 'en' ? 'bg-indigo-100 border-2 border-indigo-500' : 'hover:bg-slate-100'}`}
          title="English"
        >
          🇺🇸
        </button>
        <button 
          onClick={() => setCurrentLang('it')}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${currentLang === 'it' ? 'bg-indigo-100 border-2 border-indigo-500' : 'hover:bg-slate-100'}`}
          title="Italiano"
        >
          🇮🇹
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-12 bg-gradient-to-r from-red-50 via-white to-yellow-50 p-10 rounded-3xl border border-slate-100 shadow-sm mt-10">
        <div className="flex justify-center gap-4 text-4xl mb-4">
          <span>🇪🇸</span>
          <span>🇮🇹</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">
          {TEXTS.title[currentLang]}
        </h1>
        <p className="text-xl text-slate-600 font-medium">{TEXTS.subtitle[currentLang]}</p>
        <div className="mt-6 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-sm text-slate-500 border border-slate-200">
          <MapPin size={16} className="text-red-500" />
          <span>{TEXTS.startPoint[currentLang]}: <strong>Hotel Crisol Faycan</strong></span>
        </div>
      </div>

      {/* Section 1: Very Close */}
      <SectionHeader 
        title={TEXTS.sections.veryClose.title} 
        subtitle={TEXTS.sections.veryClose.subtitle} 
        icon={<MapPin className="text-emerald-500" />} 
        lang={currentLang}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {restaurants.filter(r => r.category === 'VERY_CLOSE').map(r => (
          <RestaurantCard key={r.id} item={r} lang={currentLang} />
        ))}
      </div>

      {/* Section 2: Short Walk */}
      <SectionHeader 
        title={TEXTS.sections.shortWalk.title} 
        subtitle={TEXTS.sections.shortWalk.subtitle} 
        icon={<Utensils className="text-blue-500" />} 
        lang={currentLang}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {restaurants.filter(r => r.category === 'SHORT_WALK').map(r => (
          <RestaurantCard key={r.id} item={r} lang={currentLang} />
        ))}
      </div>

      {/* Section 3: Beach Walk */}
      <SectionHeader 
        title={TEXTS.sections.beachWalk.title} 
        subtitle={TEXTS.sections.beachWalk.subtitle} 
        icon={<MapPin className="text-orange-500" />} 
        lang={currentLang}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {restaurants.filter(r => r.category === 'BEACH_WALK').map(r => (
          <RestaurantCard key={r.id} item={r} lang={currentLang} />
        ))}
      </div>

      {/* Tips Section */}
      <div className="bg-indigo-900 text-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <span className="bg-white text-indigo-900 rounded-full w-8 h-8 flex items-center justify-center text-sm">💡</span>
          {TEXTS.tips.title[currentLang]}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-indigo-800/50 p-4 rounded-lg border border-indigo-700">
            <h4 className="font-bold mb-2 text-indigo-200">{TEXTS.tips.schedule.title[currentLang]} 🕒</h4>
            <p className="text-indigo-100 text-sm">{TEXTS.tips.schedule.text[currentLang]}</p>
          </div>
          <div className="bg-indigo-800/50 p-4 rounded-lg border border-indigo-700">
            <h4 className="font-bold mb-2 text-indigo-200">{TEXTS.tips.coffee.title[currentLang]} ☕</h4>
            <p className="text-indigo-100 text-sm">{TEXTS.tips.coffee.text[currentLang]}</p>
          </div>
          <div className="bg-indigo-800/50 p-4 rounded-lg border border-indigo-700">
            <h4 className="font-bold mb-2 text-indigo-200">{TEXTS.tips.tip.title[currentLang]} 💶</h4>
            <p className="text-indigo-100 text-sm">{TEXTS.tips.tip.text[currentLang]}</p>
          </div>
          <div className="bg-indigo-800/50 p-4 rounded-lg border border-indigo-700">
            <h4 className="font-bold mb-2 text-indigo-200">{TEXTS.tips.water.title[currentLang]} 💧</h4>
            <p className="text-indigo-100 text-sm">{TEXTS.tips.water.text[currentLang]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};