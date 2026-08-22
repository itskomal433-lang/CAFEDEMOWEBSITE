import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/allergens")({
  beforeLoad: () => {
    throw redirect({ to: "/menu" });
  },
  component: () => null,
});

type AllergenKey = "gluten" | "dairy" | "nuts" | "eggs" | "soy";

interface ItemAllergenInfo {
  id: string;
  name: string;
  category: string;
  gluten: boolean; // contains gluten
  dairy: boolean; // contains dairy (can be swapped in drinks)
  nuts: boolean; // contains nuts
  eggs: boolean; // contains eggs
  soy: boolean; // contains soy
  notes: string;
}

const allergenData: ItemAllergenInfo[] = [
  {
    id: "latte",
    name: "Classic Latte",
    category: "Coffee",
    gluten: false,
    dairy: true,
    nuts: false,
    eggs: false,
    soy: false,
    notes: "Oat, Almond, or Soy milk substitution available (Dairy-Free)",
  },
  {
    id: "flat-white",
    name: "Melbourne Flat White",
    category: "Coffee",
    gluten: false,
    dairy: true,
    nuts: false,
    eggs: false,
    soy: false,
    notes: "Can be made dairy-free with plant milk",
  },
  {
    id: "cappuccino",
    name: "Dusted Cappuccino",
    category: "Coffee",
    gluten: false,
    dairy: true,
    nuts: false,
    eggs: false,
    soy: false,
    notes: "Cocoa powder is gluten-free & dairy-free",
  },
  {
    id: "iced-matcha",
    name: "Iced Ceremonial Matcha",
    category: "Coffee",
    gluten: false,
    dairy: false,
    nuts: false,
    eggs: false,
    soy: false,
    notes: "Default made with fresh oat milk (100% Vegan)",
  },
  {
    id: "vanilla-cold-brew",
    name: "Vanilla Sweet Cream Cold Brew",
    category: "Coffee",
    gluten: false,
    dairy: true,
    nuts: false,
    eggs: false,
    soy: false,
    notes: "Sweet cream contains dairy. Can be ordered black or with oat milk",
  },
  {
    id: "espresso-tonic",
    name: "Sparkling Citrus Espresso Tonic",
    category: "Coffee",
    gluten: false,
    dairy: false,
    nuts: false,
    eggs: false,
    soy: false,
    notes: "Naturally Vegan & Gluten-Free",
  },
  {
    id: "berry-pancakes-menu",
    name: "Berry Pancakes Stack",
    category: "Brunch",
    gluten: true,
    dairy: true,
    nuts: false,
    eggs: true,
    soy: false,
    notes: "Contains wheat flour, butter & eggs. Maple syrup is pure 100% organic",
  },
  {
    id: "avocado-toast-menu",
    name: "Heirloom Avocado Toast",
    category: "Brunch",
    gluten: true,
    dairy: true,
    nuts: true,
    eggs: false,
    soy: false,
    notes: "Gluten-free bread available (+ $2.00). Feta contains dairy (can omit). Dukkah contains seeds/nuts",
  },
  {
    id: "truffle-scramble",
    name: "Truffle Scrambled Eggs",
    category: "Brunch",
    gluten: true,
    dairy: true,
    nuts: false,
    eggs: true,
    soy: false,
    notes: "Brioche contains gluten & dairy. Gluten-free toast available",
  },
  {
    id: "brioche-french-toast",
    name: "Caramelized Brioche French Toast",
    category: "Brunch",
    gluten: true,
    dairy: true,
    nuts: true,
    eggs: true,
    soy: false,
    notes: "Contains pecans (tree nuts), dairy & eggs",
  },
  {
    id: "crispy-chicken-focaccia",
    name: "Crispy Herb Chicken Focaccia",
    category: "Mains",
    gluten: true,
    dairy: true,
    nuts: true,
    eggs: false,
    soy: false,
    notes: "Provolone cheese contains dairy. Pesto contains pine nuts",
  },
  {
    id: "smoked-salmon-bagel",
    name: "Tasmanian Smoked Salmon Bagel",
    category: "Mains",
    gluten: true,
    dairy: true,
    nuts: false,
    eggs: false,
    soy: false,
    notes: "Cream cheese contains dairy. Bagel contains gluten & sesame",
  },
  {
    id: "mediterranean-bowl",
    name: "Bloom Green Grain Bowl",
    category: "Mains",
    gluten: false,
    dairy: false,
    nuts: false,
    eggs: false,
    soy: true,
    notes: "Contains edamame (soy). 100% Gluten-Free & Vegan",
  },
  {
    id: "chocolate-cake-menu",
    name: "Signature Decadent Chocolate Cake",
    category: "Bakery",
    gluten: true,
    dairy: true,
    nuts: false,
    eggs: true,
    soy: true,
    notes: "Contains dairy, eggs, and soy lecithin in dark Belgian chocolate",
  },
  {
    id: "almond-croissant",
    name: "Twice-Baked Almond Croissant",
    category: "Bakery",
    gluten: true,
    dairy: true,
    nuts: true,
    eggs: true,
    soy: false,
    notes: "Contains almond frangipane & sliced almonds (tree nuts)",
  },
  {
    id: "raspberry-pistachio-tart",
    name: "Raspberry Pistachio Tart",
    category: "Bakery",
    gluten: true,
    dairy: true,
    nuts: true,
    eggs: true,
    soy: false,
    notes: "Contains pistachio (tree nuts), dairy & eggs",
  },
  {
    id: "fresh-orange-juice",
    name: "Cold-Pressed Fresh Orange Juice",
    category: "Beverages",
    gluten: false,
    dairy: false,
    nuts: false,
    eggs: false,
    soy: false,
    notes: "100% Pure Valencia oranges, no additives",
  },
  {
    id: "iced-hibiscus-berry",
    name: "Iced Hibiscus Berry Spritz",
    category: "Beverages",
    gluten: false,
    dairy: false,
    nuts: false,
    eggs: false,
    soy: false,
    notes: "100% Vegan, Gluten-Free & Caffeine-Free",
  },
];

function AllergensPage() {
  const [filter, setFilter] = useState<string>("all");

  const filteredItems = allergenData.filter((item) => {
    if (filter === "gf") return !item.gluten;
    if (filter === "df") return !item.dairy;
    if (filter === "nf") return !item.nuts;
    if (filter === "vegan") return !item.dairy && !item.eggs;
    return true;
  });

  return (
    <div className="bg-[#FAF6EE] min-h-screen py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <Reveal className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E4ECE6] px-4 py-1 text-xs font-semibold text-[#2C3E2E]">
            <ShieldAlert className="h-3.5 w-3.5 text-[#D07A60]" />
            Transparency & Food Safety
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#2C3E2E]">
            Allergen & Dietary Guide
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[#6D6964] leading-relaxed">
            We are dedicated to accommodating your dietary lifestyle and health requirements. Please review our ingredient matrix below and always inform our baristas of any specific sensitivities.
          </p>
        </Reveal>

        {/* Advisory Box */}
        <div className="rounded-3xl border border-[#D07A60]/30 bg-[#F5EFE4] p-6 sm:p-8 mb-10 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D07A60] text-white shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-[#2C3E2E]">Kitchen Cross-Contamination Advisory</h3>
              <p className="text-xs text-[#6D6964]">
                While we use sanitized utensils and dedicated prep stations, all food is crafted in a busy kitchen environment where nuts, gluten, and dairy are present.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              filter === "all" ? "bg-[#2C3E2E] text-white" : "bg-white border border-[#E8DFD3] text-[#6D6964] hover:bg-[#F3EDE2]"
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setFilter("gf")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              filter === "gf" ? "bg-[#2C3E2E] text-white" : "bg-white border border-[#E8DFD3] text-[#6D6964] hover:bg-[#F3EDE2]"
            }`}
          >
            Gluten-Friendly Only
          </button>
          <button
            onClick={() => setFilter("df")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              filter === "df" ? "bg-[#2C3E2E] text-white" : "bg-white border border-[#E8DFD3] text-[#6D6964] hover:bg-[#F3EDE2]"
            }`}
          >
            Dairy-Free Only
          </button>
          <button
            onClick={() => setFilter("nf")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              filter === "nf" ? "bg-[#2C3E2E] text-white" : "bg-white border border-[#E8DFD3] text-[#6D6964] hover:bg-[#F3EDE2]"
            }`}
          >
            Nut-Free Only
          </button>
          <button
            onClick={() => setFilter("vegan")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              filter === "vegan" ? "bg-[#2C3E2E] text-white" : "bg-white border border-[#E8DFD3] text-[#6D6964] hover:bg-[#F3EDE2]"
            }`}
          >
            100% Plant-Based / Vegan
          </button>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto rounded-3xl border border-[#E8DFD3] bg-white shadow-sm">
          <table className="w-full text-left text-xs text-[#4A4642] border-collapse">
            <thead>
              <tr className="border-b border-[#E8DFD3] bg-[#F5EFE4] text-[#2C3E2E] font-bold">
                <th className="py-4 px-4 sm:px-6">Menu Item</th>
                <th className="py-4 px-3 text-center">Gluten</th>
                <th className="py-4 px-3 text-center">Dairy</th>
                <th className="py-4 px-3 text-center">Nuts</th>
                <th className="py-4 px-3 text-center">Eggs</th>
                <th className="py-4 px-3 text-center">Soy</th>
                <th className="py-4 px-4 hidden md:table-cell">Dietary Notes & Swaps</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE0]">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAF6EE]/80 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-display text-sm font-semibold text-[#2C3E2E]">
                    {item.name}
                    <span className="block text-[10px] font-normal text-[#9E9B95]">{item.category}</span>
                  </td>
                  
                  {/* Gluten */}
                  <td className="py-3.5 px-3 text-center">
                    {item.gluten ? (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-700 font-bold text-[10px]" title="Contains Gluten">
                        ✓
                      </span>
                    ) : (
                      <span className="text-[#9E9B95]">—</span>
                    )}
                  </td>

                  {/* Dairy */}
                  <td className="py-3.5 px-3 text-center">
                    {item.dairy ? (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold text-[10px]" title="Contains Dairy">
                        ✓
                      </span>
                    ) : (
                      <span className="text-[#9E9B95]">—</span>
                    )}
                  </td>

                  {/* Nuts */}
                  <td className="py-3.5 px-3 text-center">
                    {item.nuts ? (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-700 font-bold text-[10px]" title="Contains Tree Nuts / Peanuts">
                        ✓
                      </span>
                    ) : (
                      <span className="text-[#9E9B95]">—</span>
                    )}
                  </td>

                  {/* Eggs */}
                  <td className="py-3.5 px-3 text-center">
                    {item.eggs ? (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-100 text-yellow-800 font-bold text-[10px]" title="Contains Eggs">
                        ✓
                      </span>
                    ) : (
                      <span className="text-[#9E9B95]">—</span>
                    )}
                  </td>

                  {/* Soy */}
                  <td className="py-3.5 px-3 text-center">
                    {item.soy ? (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-[10px]" title="Contains Soy">
                        ✓
                      </span>
                    ) : (
                      <span className="text-[#9E9B95]">—</span>
                    )}
                  </td>

                  {/* Notes */}
                  <td className="py-3.5 px-4 text-xs text-[#6D6964] hidden md:table-cell">
                    {item.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
