export interface BeanStory {
  farmer: string;
  farm: string;
  harvest: string;
  headline: string;
  story: string[];
  quote: string;
}

// Fictional farmers and farms, written as placeholder brand storytelling.
// Keyed by product slug so stories stay easy to edit or replace.
export const beanStories: Record<string, BeanStory> = {
  "house-blend": {
    farmer: "Thabi & our partner growers",
    farm: "Cooperatives across Africa",
    harvest: "Year-round, blended monthly",
    headline: "The blend that started at the kitchen table",
    story: [
      "Before there was a shop, there was a kitchen table, a hand grinder and a lot of very strong opinions. Thabi and a few friends spent months tasting single lots, arguing about which one deserved to be the everyday cup.",
      "No single coffee won, so they blended. A little chocolate from one hillside, some caramel from another, and a nutty backbone to hold it together. The recipe has barely changed since.",
      "Every bag of House Blend still carries our motto: people, places, better coffee. It is the cup we pour first for anyone who walks in.",
    ],
    quote: "A good blend is a good conversation. Everyone gets a turn.",
  },
  "dark-roast": {
    farmer: "Grace Uwimana",
    farm: "Nyamasheke Hills Cooperative",
    harvest: "March – June",
    headline: "Bold on purpose, sweet underneath",
    story: [
      "Grace's cooperative sits on steep hillsides above Lake Kivu, where mornings start in cloud and coffee cherries ripen slowly. That patience is what lets us roast dark without losing the sugar.",
      "Her team sorts every lot by hand three times before it leaves the washing station. Anything less than perfect goes to the local market, not to us.",
      "We roast it deep, to the edge of first crack's cousin, and stop. The result is dark chocolate and spice, full-bodied and smooth. Deep flavours for brighter tomorrows.",
    ],
    quote: "Dark should mean rich, not burnt. That is the whole job.",
  },
  "brazil-santos": {
    farmer: "Carlos Menezes",
    farm: "Fazenda Sol Nascente",
    harvest: "May – September",
    headline: "A farm that faces the sunrise, on purpose",
    story: [
      "Carlos's grandfather planted the first rows facing east so the cherries caught the early sun and dried gently through the day. Three generations later the farm is still called Sol Nascente, the rising sun.",
      "The beans are dried whole inside the fruit, turned by hand on sunlit patios. It is slow and unglamorous, and it gives the caramel and nut sweetness that Santos is loved for.",
      "Sun-kissed beans. A naturally brighter cup.",
    ],
    quote: "We do not add sweetness. We just do not get in the sun's way.",
  },
  "kenya-aa": {
    farmer: "Wanjiru Kamau",
    farm: "Mt. Kenya AA Farmers' Society",
    harvest: "October – December",
    headline: "The biggest beans on the mountain",
    story: [
      "In Kenya, AA is not a brand, it is a grade: the largest, densest beans, screened one by one. Wanjiru's society has been winning that grade for almost thirty years.",
      "Her members deliver cherries the same day they are picked, and every lot is sold at open auction. Farmers see exactly what the market thinks of their work.",
      "We roast light so the blackcurrant and citrus stay loud. Bright flavours from high-altitude beans, and a richer tomorrow for the people who grew them.",
    ],
    quote: "Altitude gives the flavour. The auction gives the farmer a voice.",
  },
  "kenya-nyeri": {
    farmer: "Peter Mwangi",
    farm: "Nyeri Hills Wet Mill",
    harvest: "October – December",
    headline: "Jasmine on the nose, berries at the finish",
    story: [
      "Peter runs a small wet mill in the hills of Nyeri where the red volcanic soil turns coffee into something floral and unmistakable. The first time he brewed a cup of his own lot, he says, he thought someone had added tea.",
      "The cherries are fermented overnight in cool mountain water, then dried on raised beds under shade cloth so they never rush.",
      "Berry, floral and vibrant. It is the coffee we hand to people who say they do not like coffee.",
    ],
    quote: "Some coffees shout. This one sings.",
  },
  "arabic-blend": {
    farmer: "Amina Al-Sayed",
    farm: "Partner roasting collective",
    harvest: "Blended twice a year",
    headline: "The first cup is always for the guest",
    story: [
      "In many homes, the first cup of coffee does not belong to the host. It belongs to whoever just walked through the door. Amina grew up watching her mother pour it slowly, with both hands.",
      "She built this blend for that moment: rich enough to feel like an occasion, balanced enough to keep going back for a second cup, and distinctive enough that people ask what it is.",
      "Rich, balanced, distinctive. Pour it for someone you are glad to see.",
    ],
    quote: "Coffee tastes better when it is offered, not just poured.",
  },
};

export function getBeanStory(slug: string): BeanStory | undefined {
  return beanStories[slug];
}
