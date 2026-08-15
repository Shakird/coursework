export const PRODUCTS = [
  {
    id: "signature-sourdough",
    name: "Signature Country Sourdough",
    priceCents: 900,
    category: "bread",
    note: "Rye starter, 48-hour ferment.",
  },
  {
    id: "seeded-multigrain",
    name: "Seeded Multigrain Batard",
    priceCents: 950,
    category: "bread",
    note: "Flax, sunflower, and sesame.",
  },
  {
    id: "honey-rye",
    name: "Honey Rye Pan Loaf",
    priceCents: 850,
    category: "bread",
    note: "This week's featured item.",
  },
  {
    id: "everyday-baguette",
    name: "Everyday Baguette",
    priceCents: 600,
    category: "bread",
    note: "Best within a few hours.",
  },
  {
    id: "cheddar-scallion",
    name: "Sharp Cheddar and Scallion Boule",
    priceCents: 1200,
    category: "bread",
    note: "Weekends only.",
  },
  {
    id: "butter-croissant",
    name: "Butter Croissant",
    priceCents: 375,
    category: "pastry",
    note: "Twenty-seven layers.",
  },
  {
    id: "almond-croissant",
    name: "Almond Croissant",
    priceCents: 475,
    category: "pastry",
    note: "Filled with frangipane.",
  },
  {
    id: "fruit-danish",
    name: "Seasonal Fruit Danish",
    priceCents: 450,
    category: "pastry",
    note: "Whatever the orchard stand has.",
  },
  {
    id: "cinnamon-knot",
    name: "Cinnamon Knot",
    priceCents: 400,
    category: "pastry",
    note: "Cardamom dough, coarse sugar.",
  },
  {
    id: "morning-bun",
    name: "Morning Bun",
    priceCents: 425,
    category: "pastry",
    note: "Orange zest and brown sugar.",
  },
  {
    id: "pastry-box-six",
    name: "Mixed Pastry Box (six)",
    priceCents: 1800,
    category: "pastry",
    note: "Baker's choice, or tell us what to include.",
  },
  {
    id: "pastry-box-twelve",
    name: "Mixed Pastry Box (twelve)",
    priceCents: 3400,
    category: "pastry",
    note: "Baker's choice, or tell us what to include.",
  },

  /*
    Ready-made six-inch cakes. These sit finished in the case, so unlike a
    custom cake they have one fixed price and can be reserved with a click: if
    nobody collects it, the cake simply goes back on display.

    Custom cakes are deliberately absent from this list. They are quoted by
    size, flavor, and filling, ordered by phone, and paid for before baking,
    so there is no single price that could honestly appear on a button.
  */
  {
    id: "cake-vanilla-bean",
    name: "Vanilla Bean Six-Inch Cake",
    priceCents: 3200,
    category: "cake",
    note: "Swiss meringue buttercream. Serves six to eight.",
  },
  {
    id: "cake-dark-chocolate",
    name: "Dark Chocolate Six-Inch Cake",
    priceCents: 3200,
    category: "cake",
    note: "Salted caramel. Serves six to eight.",
  },
  {
    id: "cake-lemon-poppyseed",
    name: "Lemon Poppyseed Six-Inch Cake",
    priceCents: 3200,
    category: "cake",
    note: "Cream cheese frosting. Serves six to eight.",
  },
  {
    id: "cake-spiced-carrot",
    name: "Spiced Carrot Six-Inch Cake",
    priceCents: 3200,
    category: "cake",
    note: "Walnut and mascarpone. Serves six to eight.",
  },
];

export function findProduct(id) {
  if (typeof id !== "string" || id === "") {
    return undefined;
  }
  return PRODUCTS.find((product) => product.id === id);
}

export function productsByCategory(category) {
  return PRODUCTS.filter((product) => product.category === category);
}

export function formatPrice(cents) {
  const dollars = Math.floor(cents / 100);
  const remainder = cents % 100;
  return `$${dollars}.${String(remainder).padStart(2, "0")}`;
}