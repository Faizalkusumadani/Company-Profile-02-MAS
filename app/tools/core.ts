export interface CoreItem {
  key: string;
  letter: string;
  title: string;
  color: string;
}

const core: CoreItem[] = [
  {
    key: "responsibility",
    letter: "R",
    title: "esponsibility",
    color: "text-red-700",
  },
  { key: "excellent", letter: "E", title: "xcellent", color: "text-red-700" },
  { key: "dedicated", letter: "D", title: "edicated", color: "text-red-700" },
  {
    key: "detailOriented",
    letter: "D",
    title: "etail Oriented",
    color: "text-red-700",
  },
  {
    key: "modernization",
    letter: "M",
    title: "odernization",
    color: "text-yellow-500",
  },
  { key: "agility", letter: "A", title: "gility", color: "text-yellow-500" },
  {
    key: "senseOfBelonging",
    letter: "S",
    title: "ense of Belonging",
    color: "text-yellow-500",
  },
];

export default core;
