// Hero centerpiece transparent cutouts
import espressoImg from '../assets/images/hero/espresso-cup.png';
import cappuccinoImg from '../assets/images/hero/cappuccino-cup.png';
import latteImg from '../assets/images/hero/latte-cup.png';
import coldbrewImg from '../assets/images/hero/coldbrew-glass.png';

// Floating ingredient cutouts (transparent PNGs extracted from Magnific PSD exports)
import beansGroupImg from '../assets/images/hero/flying-coffee-beans.png';
import beanSingleImg from '../assets/images/hero/single-coffee-bean.png';
import sugarImg from '../assets/images/hero/sugar-cubes.png';
import cinnamonImg from '../assets/images/hero/cinnamon-sticks.png';
import splashImg from '../assets/images/hero/cream-splash.png';
import mintLeafImg from '../assets/images/hero/mint-leaf.png';

export interface IngredientData {
  id: string;
  name: string;
  image: string;
  position: { x: number; y: number };
  size: number;
  rotation: number;
  depth: number;
}

export interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  cupColor: string;
  liquidColor: string;
  image: string;
  ingredients: IngredientData[];
}

export const slides: SlideData[] = [
  {
    id: 1,
    title: "Classic Espresso",
    subtitle: "PURE & INTENSE",
    description: "Our signature single-origin espresso, roasted to a golden crema with rich notes of dark chocolate and toasted caramel.",
    price: "$4.50",
    cupColor: "#2C1810",
    liquidColor: "#1A0F0A",
    image: espressoImg,
    ingredients: [
      { id: 'e-beans-fg', name: 'Flying Coffee Beans', image: beansGroupImg, position: { x: 24, y: 16 }, size: 180, rotation: 15, depth: 1.75 },
      { id: 'e-bean-fg', name: 'Single Coffee Bean', image: beanSingleImg, position: { x: 82, y: 76 }, size: 150, rotation: -28, depth: 1.75 },
      { id: 'e-cin-mid', name: 'Cinnamon Stick', image: cinnamonImg, position: { x: 16, y: 80 }, size: 120, rotation: 42, depth: 1.0 },
      { id: 'e-sugar-mid', name: 'Sugar Cubes', image: sugarImg, position: { x: 78, y: 20 }, size: 115, rotation: 8, depth: 1.0 },
      { id: 'e-bean-bg-1', name: 'Single Coffee Bean', image: beanSingleImg, position: { x: 44, y: 88 }, size: 72, rotation: 32, depth: 0.3 },
      { id: 'e-bean-bg-2', name: 'Single Coffee Bean', image: beanSingleImg, position: { x: 40, y: 6 }, size: 64, rotation: -15, depth: 0.3 },
    ]
  },
  {
    id: 2,
    title: "Velvet Cappuccino",
    subtitle: "RICH & FOAMY",
    description: "Silky steamed whole milk married with our double-shot espresso, crowned with artisanal foam rosetta art.",
    price: "$5.00",
    cupColor: "#F5EDE4",
    liquidColor: "#C8956C",
    image: cappuccinoImg,
    ingredients: [
      { id: 'c-splash-fg', name: 'Cream Splash', image: splashImg, position: { x: 78, y: 14 }, size: 185, rotation: 6, depth: 1.75 },
      { id: 'c-bean-fg', name: 'Single Coffee Bean', image: beanSingleImg, position: { x: 16, y: 76 }, size: 140, rotation: 22, depth: 1.75 },
      { id: 'c-beans-mid', name: 'Flying Coffee Beans', image: beansGroupImg, position: { x: 60, y: 84 }, size: 130, rotation: -18, depth: 1.0 },
      { id: 'c-leaf-mid', name: 'Mint Leaf', image: mintLeafImg, position: { x: 24, y: 20 }, size: 112, rotation: -22, depth: 1.0 },
      { id: 'c-sugar-bg', name: 'Sugar Cubes', image: sugarImg, position: { x: 40, y: 6 }, size: 76, rotation: 12, depth: 0.3 },
    ]
  },
  {
    id: 3,
    title: "Artisan Iced Latte",
    subtitle: "SMOOTH & CHILLED",
    description: "Layered organic espresso over chilled velvet milk and ice, finished with a luscious cream swirl and hazelnut essence.",
    price: "$5.50",
    cupColor: "#BCAAA4",
    liquidColor: "#3E2723",
    image: latteImg,
    ingredients: [
      { id: 'l-splash-fg', name: 'Cream Splash', image: splashImg, position: { x: 22, y: 18 }, size: 170, rotation: -12, depth: 1.75 },
      { id: 'l-beans-fg', name: 'Flying Coffee Beans', image: beansGroupImg, position: { x: 78, y: 80 }, size: 190, rotation: 24, depth: 1.75 },
      { id: 'l-cin-mid', name: 'Cinnamon Stick', image: cinnamonImg, position: { x: 80, y: 20 }, size: 122, rotation: -30, depth: 1.0 },
      { id: 'l-sugar-mid', name: 'Sugar Cubes', image: sugarImg, position: { x: 16, y: 78 }, size: 110, rotation: 15, depth: 1.0 },
      { id: 'l-bean-bg', name: 'Single Coffee Bean', image: beanSingleImg, position: { x: 50, y: 92 }, size: 70, rotation: 48, depth: 0.3 },
      { id: 'l-leaf-bg', name: 'Mint Leaf', image: mintLeafImg, position: { x: 34, y: 4 }, size: 80, rotation: -38, depth: 0.3 },
    ]
  },
  {
    id: 4,
    title: "Slow-Drip Cold Brew",
    subtitle: "STEEPED & CRISP",
    description: "Steeped for 24 hours in cold filtered mountain water for an ultra-smooth, naturally sweet and chocolatey finish.",
    price: "$4.75",
    cupColor: "#4E342E",
    liquidColor: "#2C1810",
    image: coldbrewImg,
    ingredients: [
      { id: 'b-leaf-fg', name: 'Mint Leaf', image: mintLeafImg, position: { x: 16, y: 16 }, size: 160, rotation: -24, depth: 1.75 },
      { id: 'b-beans-fg', name: 'Flying Coffee Beans', image: beansGroupImg, position: { x: 80, y: 76 }, size: 180, rotation: 30, depth: 1.75 },
      { id: 'b-bean-mid', name: 'Single Coffee Bean', image: beanSingleImg, position: { x: 78, y: 20 }, size: 120, rotation: 14, depth: 1.0 },
      { id: 'b-splash-mid', name: 'Cream Splash', image: splashImg, position: { x: 28, y: 82 }, size: 130, rotation: -10, depth: 1.0 },
      { id: 'b-sugar-bg', name: 'Sugar Cubes', image: sugarImg, position: { x: 40, y: 6 }, size: 80, rotation: 8, depth: 0.3 },
      { id: 'b-cin-bg', name: 'Cinnamon Stick', image: cinnamonImg, position: { x: 58, y: 88 }, size: 88, rotation: 36, depth: 0.3 },
    ]
  }
];