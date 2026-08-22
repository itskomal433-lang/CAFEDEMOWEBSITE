import { createFileRoute } from "@tanstack/react-router";
import {
  Hero,
  ValuePropsBar,
  OurStorySection,
  SpecialtiesSection,
  LoyaltyBanner,
  AtmosphereQuote,
} from "@/components/site/Sections";
import { CoffeeQuiz } from "@/components/site/CoffeeQuiz";
import { cafe, fullAddress, hours } from "@/data/cafe";

export const Route = createFileRoute("/")({
  head: () => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "CafeOrCoffeeShop",
      name: cafe.name,
      description:
        "Bloom Café in Melbourne — Specialty coffee, all-day brunch, artisan bakery, and cozy ambiance. Good coffee, good food, Good Mood Everyday.",
      telephone: cafe.phone,
      email: cafe.email,
      priceRange: "$$",
      servesCuisine: ["Coffee", "Brunch", "Bakery", "Breakfast"],
      address: {
        "@type": "PostalAddress",
        streetAddress: cafe.address?.street || "123 Café Street",
        addressLocality: cafe.address?.city || "Melbourne",
        addressRegion: cafe.address?.state || "VIC",
        postalCode: cafe.address?.zip || "3000",
        addressCountry: "AU",
      },
      openingHoursSpecification: hours.map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.day,
        opens: "07:00",
        closes: "21:00",
      })),
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: cafe.rating,
        reviewCount: cafe.reviewCount,
      },
    };

    return {
      meta: [
        { title: "Bloom Café — Good coffee, good food, Good Mood Everyday | Melbourne" },
        {
          name: "description",
          content:
            "Bloom Café is a cozy sanctuary in Melbourne serving artisanal coffee, fluffy berry pancakes, avocado toast, and decadent cakes. Mon - Sun 7AM - 9PM.",
        },
        {
          property: "og:title",
          content: "Bloom Café — Coffee • Food • Good Times",
        },
        {
          property: "og:description",
          content:
            "Good coffee, good food, Good Mood Everyday. Handcrafted specialty coffee and fresh brunch on Café Street in Melbourne.",
        },
        { property: "og:type", content: "website" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(structuredData),
        },
      ],
    };
  },
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Value Proposition Floating Bar */}
      <ValuePropsBar />

      {/* 3. Our Story Section */}
      <OurStorySection />

      {/* 4. Specialties Section ("Made for You") */}
      <SpecialtiesSection />

      {/* 5. Interactive Coffee Taste Quiz */}
      <CoffeeQuiz />

      {/* 6. Bloom Rewards & Loyalty Club Banner */}
      <LoyaltyBanner />

      {/* 7. Atmosphere Quote Banner */}
      <AtmosphereQuote />
    </div>
  );
}
