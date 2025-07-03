const defaults = {
  phone: "0785478021",
  password: "Test@12345",
  userRole: "AGENT",
  organisation: 1,
};

const agents = [
  {
    username: "Walter Iradukunda",
    email: "walter.isingizwe@example.com",
    profile: 1,
  },
  {
    username: "Aline Mukamana",
    email: "aline.mukamana@example.com",
    profile: 2,
  },
  {
    username: "Jean Bosco Habimana",
    email: "jeanbosco.habimana@example.com",
    profile: 3,
  },
  {
    username: "Clarisse Uwase",
    email: "clarisse.uwase@example.com",
    profile: 4,
  },
  {
    username: "Patrick Mugisha",
    email: "patrick.mugisha@example.com",
    profile: 5,
  },
  {
    username: "Laetitia Umulisa",
    email: "laetitia.umulisa@example.com",
    profile: 6,
  },
  {
    username: "Eric Nshimiyimana",
    email: "eric.nshimiyimana@example.com",
    profile: 7,
  },
  {
    username: "Chantal Ingabire",
    email: "chantal.ingabire@example.com",
    profile: 8,
  },
  {
    username: "Cedric Mbarushimana",
    email: "cedric.mbarushimana@example.com",
    profile: 9,
  },
  {
    username: "Diane Akaliza",
    email: "diane.akaliza@example.com",
    profile: 10,
  },
];

export const userSeed = [
  [agents[0]].map((agent) => ({ ...defaults, ...agent })),
];
