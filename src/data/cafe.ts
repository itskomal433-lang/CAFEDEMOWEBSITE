/**
 * Single source of truth for Bloom Café content.
 * Authentic Australian specialty coffee, wholesome food & cozy moments.
 */

import heroArch from "@/assets/bloom-hero-arch.jpg";
import latteStory from "@/assets/bloom-latte-story.jpg";
import classicLatte from "@/assets/bloom-classic-latte.jpg";
import flatWhite from "@/assets/bloom-flat-white.jpg";
import cappuccino from "@/assets/bloom-cappuccino.jpg";
import icedMatcha from "@/assets/bloom-iced-matcha.jpg";
import vanillaColdBrew from "@/assets/bloom-vanilla-cold-brew.jpg";
import espressoTonic from "@/assets/bloom-espresso-tonic.jpg";
import berryPancakes from "@/assets/bloom-berry-pancakes.jpg";
import avocadoToast from "@/assets/bloom-avocado-toast.jpg";
import truffleScramble from "@/assets/bloom-truffle-scramble.jpg";
import chocolateCake from "@/assets/bloom-chocolate-cake.jpg";
import pottedPlant from "@/assets/bloom-potted-plant.jpg";
import almondCroissant from "@/assets/bloom-almond-croissant.jpg";
import raspberryTart from "@/assets/bloom-raspberry-tart.jpg";
import grainBowl from "@/assets/bloom-grain-bowl.jpg";

import chickenFocaccia from "@/assets/food-chicken-sandwich.jpg";
import salmonBagel from "@/assets/food-breakfast-bagel.jpg";
import orangeJuice from "@/assets/drink-juice.jpg";
import hibiscusSpritz from "@/assets/drink-frappe.jpg";
import briocheToast from "@/assets/drink-dulce-macchiato.jpg";

export const images = {
  heroArch,
  latteStory,
  classicLatte,
  flatWhite,
  cappuccino,
  icedMatcha,
  vanillaColdBrew,
  espressoTonic,
  berryPancakes,
  avocadoToast,
  truffleScramble,
  chocolateCake,
  pottedPlant,
  almondCroissant,
  raspberryTart,
  grainBowl,
  chickenFocaccia,
  salmonBagel,
  orangeJuice,
  hibiscusSpritz,
  briocheToast,
};

export const cafe = {
  name: "Bloom Café",
  tagline: "Coffee • Food • Good Times",
  motto: "Good coffee, good food, Good Mood Everyday",
  storyHeadline: "Brewed with passion, served with love.",
  category: "Specialty Coffee & Brunch",
  phone: "(03) 9123 4567",
  phoneHref: "tel:+61391234567",
  whatsapp: "+61412345678",
  whatsappDisplay: "+61 412 345 678",
  whatsappHref: "https://wa.me/61412345678?text=Hi%20Bloom%20Caf%C3%A9!%20%E2%98%95%20I'd%20like%20to%20ask%20about%20your%20menu%20and%20orders.",
  email: "hello@bloomcafe.com",
  emailHref: "mailto:hello@bloomcafe.com",
  priceRange: "$$",
  rating: 4.9,
  reviewCount: 520,
  services: ["Dine-in", "Takeaway", "Table Reservations", "Catering"],
  address: {
    street: "123 Café Street",
    city: "Melbourne",
    state: "VIC",
    zip: "3000",
    country: "Australia",
  },
  social: {
    instagram: "https://instagram.com",
    instagramHandle: "@bloomcafemelbourne",
    facebook: "https://facebook.com",
    pinterest: "https://pinterest.com",
    tiktok: "https://tiktok.com",
  },
} as const;

export const fullAddress = `${cafe.address.street}, ${cafe.address.city}, ${cafe.address.state} ${cafe.address.zip}, ${cafe.address.country}`;

export const mapsUrl = "https://maps.app.goo.gl/HyNW4dykJD3Gb44b6";
export const directionsUrl = "https://maps.app.goo.gl/HyNW4dykJD3Gb44b6";

export const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  fullAddress,
)}&output=embed`;

/** Editable weekly hours. */
export const hours = [
  { day: "Monday", open: "7:00 AM", close: "9:00 PM" },
  { day: "Tuesday", open: "7:00 AM", close: "9:00 PM" },
  { day: "Wednesday", open: "7:00 AM", close: "9:00 PM" },
  { day: "Thursday", open: "7:00 AM", close: "9:00 PM" },
  { day: "Friday", open: "7:00 AM", close: "9:00 PM" },
  { day: "Saturday", open: "7:00 AM", close: "9:00 PM" },
  { day: "Sunday", open: "7:00 AM", close: "9:00 PM" },
];

export type SpecialtyItem = {
  id: string;
  name: string;
  category: "coffee" | "brunch" | "food" | "dessert" | "bakery";
  description: string;
  price: string;
  numericPrice: number;
  image: string;
  popular?: boolean;
  tags?: string[];
};

export const specialties: SpecialtyItem[] = [
  {
    id: "classic-latte",
    name: "Classic Latte",
    category: "coffee",
    description: "Smooth espresso with steamed silky milk & tulip art.",
    price: "$4.50",
    numericPrice: 4.5,
    image: classicLatte,
    popular: true,
    tags: ["Signature", "Barista Choice"],
  },
  {
    id: "berry-pancakes",
    name: "Berry Pancakes",
    category: "brunch",
    description: "Fluffy pancakes with fresh seasonal berries & pure maple syrup.",
    price: "$8.90",
    numericPrice: 8.9,
    image: berryPancakes,
    popular: true,
    tags: ["All-Day Brunch", "Sweet"],
  },
  {
    id: "avocado-toast",
    name: "Avocado Toast",
    category: "food",
    description: "Fresh crushed avocado with herbs, cherry tomatoes & creamy feta on sourdough.",
    price: "$7.20",
    numericPrice: 7.2,
    image: avocadoToast,
    popular: true,
    tags: ["Vegetarian", "Healthy"],
  },
  {
    id: "chocolate-cake",
    name: "Chocolate Cake",
    category: "dessert",
    description: "Rich, moist & indulgent multi-layered chocolate delight.",
    price: "$6.50",
    numericPrice: 6.5,
    image: chocolateCake,
    popular: true,
    tags: ["House Special", "Decadent"],
  },
];

export type MenuItem = {
  id: string;
  name: string;
  category: "coffee" | "brunch" | "mains" | "bakery" | "beverages";
  description: string;
  price: string;
  dietary?: ("Vegetarian" | "Vegan" | "Gluten-Free" | "Dairy-Free" | "Nut-Free")[];
  image?: string;
  popular?: boolean;
};

export const menuCategories = [
  { id: "all", label: "All Items" },
  { id: "coffee", label: "Specialty Coffee" },
  { id: "brunch", label: "All-Day Brunch" },
  { id: "mains", label: "Artisan Mains" },
  { id: "bakery", label: "Bakery & Sweets" },
  { id: "beverages", label: "Teas & Refreshers" },
] as const;

export const fullMenu: MenuItem[] = [
  // Specialty Coffee
  {
    id: "latte",
    name: "Classic Latte",
    category: "coffee",
    description: "Smooth double shot espresso with velvety steamed milk & delicate tulip art.",
    price: "$4.50",
    popular: true,
    dietary: ["Vegetarian"],
    image: classicLatte,
  },
  {
    id: "flat-white",
    name: "Melbourne Flat White",
    category: "coffee",
    description: "Rich double ristretto blend with silky thin microfoam in a terracotta ceramic cup.",
    price: "$4.80",
    popular: true,
    dietary: ["Vegetarian"],
    image: flatWhite,
  },
  {
    id: "cappuccino",
    name: "Dusted Cappuccino",
    category: "coffee",
    description: "Bold espresso with thick airy velvety milk foam and rich Belgian cocoa powder dusting.",
    price: "$4.60",
    popular: true,
    dietary: ["Vegetarian"],
    image: cappuccino,
  },
  {
    id: "iced-matcha",
    name: "Iced Ceremonial Matcha Latte",
    category: "coffee",
    description: "Uji ceremonial green tea matcha layered over creamy cold oat milk and ice.",
    price: "$5.80",
    popular: true,
    dietary: ["Vegan", "Gluten-Free"],
    image: icedMatcha,
  },
  {
    id: "vanilla-cold-brew",
    name: "Vanilla Sweet Cream Cold Brew",
    category: "coffee",
    description: "16-hour single origin slow cold brew with cascading vanilla sweet cream.",
    price: "$5.50",
    popular: true,
    dietary: ["Vegetarian", "Gluten-Free"],
    image: vanillaColdBrew,
  },
  {
    id: "espresso-tonic",
    name: "Sparkling Citrus Espresso Tonic",
    category: "coffee",
    description: "Effervescent tonic water, chilled espresso float, candied orange slice & fresh rosemary.",
    price: "$5.20",
    popular: true,
    dietary: ["Vegan", "Gluten-Free"],
    image: espressoTonic,
  },

  // All-Day Brunch
  {
    id: "berry-pancakes-menu",
    name: "Berry Pancakes Stack",
    category: "brunch",
    description: "Triple fluffy buttermilk pancakes with fresh organic berries, whipped cream & maple syrup.",
    price: "$8.90",
    popular: true,
    dietary: ["Vegetarian"],
    image: berryPancakes,
  },
  {
    id: "avocado-toast-menu",
    name: "Heirloom Avocado Toast",
    category: "brunch",
    description: "Charred artisan sourdough with smashed Hass avocado, Persian feta, cherry tomatoes & dukkah.",
    price: "$7.20",
    popular: true,
    dietary: ["Vegetarian"],
    image: avocadoToast,
  },
  {
    id: "truffle-scramble",
    name: "Truffle Scrambled Eggs",
    category: "brunch",
    description: "Silky free-range eggs with black truffle butter and fresh snipped chives on toasted brioche.",
    price: "$9.50",
    popular: true,
    dietary: ["Vegetarian"],
    image: truffleScramble,
  },
  {
    id: "brioche-french-toast",
    name: "Caramelized Brioche French Toast",
    category: "brunch",
    description: "Thick cut brioche with caramelized bananas, mascarpone and crushed pecans.",
    price: "$9.20",
    dietary: ["Vegetarian"],
    image: briocheToast,
  },

  // Artisan Mains
  {
    id: "crispy-chicken-focaccia",
    name: "Crispy Herb Chicken Focaccia",
    category: "mains",
    description: "Rosemary focaccia with grilled chicken, sun-dried tomato pesto, rocket & provolone.",
    price: "$10.50",
    popular: true,
    image: chickenFocaccia,
  },
  {
    id: "smoked-salmon-bagel",
    name: "Tasmanian Smoked Salmon Bagel",
    category: "mains",
    description: "Toasted everything bagel with dill cream cheese, capers, pickled red onions and salmon.",
    price: "$11.20",
    popular: true,
    image: salmonBagel,
  },
  {
    id: "mediterranean-bowl",
    name: "Bloom Green Grain Bowl",
    category: "mains",
    description: "Quinoa, roasted sweet potatoes, avocado, massaged kale, chickpeas & tahini lemon dressing.",
    price: "$9.80",
    dietary: ["Vegan", "Gluten-Free"],
    image: grainBowl,
  },

  // Bakery & Sweets
  {
    id: "chocolate-cake-menu",
    name: "Signature Decadent Chocolate Cake",
    category: "bakery",
    description: "Moist multi-tiered chocolate sponge with dark Belgian chocolate ganache.",
    price: "$6.50",
    popular: true,
    dietary: ["Vegetarian"],
    image: chocolateCake,
  },
  {
    id: "almond-croissant",
    name: "Twice-Baked Almond Croissant",
    category: "bakery",
    description: "Flaky butter croissant filled with fragrant frangipane cream and toasted almonds.",
    price: "$4.90",
    popular: true,
    dietary: ["Vegetarian"],
    image: almondCroissant,
  },
  {
    id: "raspberry-pistachio-tart",
    name: "Raspberry Pistachio Tart",
    category: "bakery",
    description: "Crisp shortcrust with pistachio mousseline and fresh tart raspberries.",
    price: "$5.80",
    popular: true,
    dietary: ["Vegetarian"],
    image: raspberryTart,
  },

  // Teas & Refreshers
  {
    id: "fresh-orange-juice",
    name: "Cold-Pressed Fresh Orange Juice",
    category: "beverages",
    description: "100% Valencia oranges squeezed daily with no added sugar on ice.",
    price: "$4.80",
    popular: true,
    dietary: ["Vegan", "Gluten-Free"],
    image: orangeJuice,
  },
  {
    id: "iced-hibiscus-berry",
    name: "Iced Hibiscus Berry Spritz",
    category: "beverages",
    description: "Brewed hibiscus flowers, mint leaves, crushed blackberries & sparkling water.",
    price: "$5.20",
    popular: true,
    dietary: ["Vegan", "Gluten-Free"],
    image: hibiscusSpritz,
  },
];

export const valueProps = [
  {
    id: "coffee",
    title: "PREMIUM COFFEE",
    description: "Finest beans, expertly brewed for you.",
    icon: "coffee",
  },
  {
    id: "ingredients",
    title: "FRESH INGREDIENTS",
    description: "Locally sourced, always fresh & wholesome.",
    icon: "leaf",
  },
  {
    id: "ambience",
    title: "COZY AMBIENCE",
    description: "Warm space, soft music and good vibes.",
    icon: "chair",
  },
  {
    id: "love",
    title: "MADE WITH LOVE",
    description: "Every dish & drink crafted with care.",
    icon: "heart",
  },
];

export const gallery = [
  {
    id: "g1",
    title: "Warm Cafe Interior & Neon Corner",
    category: "Ambiance",
    image: heroArch,
    caption: "Our cozy dining sanctuary filled with natural light & floral accents.",
  },
  {
    id: "g2",
    title: "Artisan Rosette Latte",
    category: "Coffee",
    image: latteStory,
    caption: "Handcrafted with locally roasted beans & velvety microfoam.",
  },
  {
    id: "g3",
    title: "Melbourne Flat White",
    category: "Coffee",
    image: flatWhite,
    caption: "Double ristretto in warm terracotta ceramics with silky microfoam.",
  },
  {
    id: "g4",
    title: "Dusted Cappuccino",
    category: "Coffee",
    image: cappuccino,
    caption: "Thick airy foam with rich dark Belgian cocoa dusting.",
  },
  {
    id: "g5",
    title: "Iced Ceremonial Matcha Latte",
    category: "Coffee",
    image: icedMatcha,
    caption: "Vivid emerald green Uji matcha over fresh cold oat milk.",
  },
  {
    id: "g6",
    title: "Vanilla Sweet Cream Cold Brew",
    category: "Coffee",
    image: vanillaColdBrew,
    caption: "Slow-steeped cold brew with silky cascading sweet cream.",
  },
  {
    id: "g7",
    title: "Sparkling Citrus Espresso Tonic",
    category: "Coffee",
    image: espressoTonic,
    caption: "Chilled bubbly tonic with espresso float, candied orange & rosemary.",
  },
  {
    id: "g8",
    title: "Fresh Berry Pancake Stack",
    category: "Food",
    image: berryPancakes,
    caption: "Fluffy golden pancakes loaded with fresh berries & pure maple syrup.",
  },
  {
    id: "g9",
    title: "Heirloom Avocado Toast",
    category: "Food",
    image: avocadoToast,
    caption: "Crusty sourdough with smashed avocado, cherry tomatoes and Persian feta.",
  },
  {
    id: "g10",
    title: "Truffle Scrambled Eggs",
    category: "Food",
    image: truffleScramble,
    caption: "Soft creamy eggs with truffle butter & fresh chives on golden brioche.",
  },
  {
    id: "g11",
    title: "Decadent Layered Chocolate Cake",
    category: "Bakery",
    image: chocolateCake,
    caption: "Multi-layered rich chocolate sponge with warm glossy ganache.",
  },
  {
    id: "g12",
    title: "Twice-Baked Almond Croissant",
    category: "Bakery",
    image: almondCroissant,
    caption: "Flaky butter croissant dusted with powdered sugar.",
  },
  {
    id: "g13",
    title: "Raspberry Pistachio Tart",
    category: "Bakery",
    image: raspberryTart,
    caption: "Crisp shortcrust filled with pistachio cream and fresh raspberries.",
  },
  {
    id: "g14",
    title: "Bloom Green Grain Bowl",
    category: "Food",
    image: grainBowl,
    caption: "Nutrient-packed colorful bowl with fresh avocado and roasted sweet potatoes.",
  },
];

export const reviews = [
  {
    author: "Elena Rostova",
    role: "Local Food Critic",
    rating: 5,
    text: "Bloom Café is the warmest haven in Melbourne. The coffee is unmatched and the berry pancakes are heavenly!",
    date: "2 days ago",
  },
  {
    author: "James Thornton",
    role: "Regular Customer",
    rating: 5,
    text: "The interior architecture and ambiance make working or catching up with friends such a joy. Truly good vibes everyday.",
    date: "1 week ago",
  },
  {
    author: "Sophie Chen",
    role: "Coffee Enthusiast",
    rating: 5,
    text: "Best latte art in town. The avocado toast with feta on seeded sourdough is my weekend staple.",
    date: "2 weeks ago",
  },
];
