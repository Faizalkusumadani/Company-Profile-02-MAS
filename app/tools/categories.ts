export type ProductCategoryKey = "name_1" | "name_2" | "name_3";
export type CategoryId = "all" | ProductCategoryKey;

export interface CategoryDef {
  id: CategoryId;
  label: string;
  icon: string;
}

const getCategories = (t: (key: string) => string): CategoryDef[] => [
  {
    id: "all",
    label: t("Products.name_0"),
    icon: "GiHamburgerMenu",
  },
  {
    id: "name_1",
    label: t("Products.name_1"),
    icon: "GiWheelbarrow",
  },
  {
    id: "name_2",
    label: t("Products.name_2"),
    icon: "GiBathtub",
  },
  {
    id: "name_3",
    label: t("Products.name_3"),
    icon: "GiFireExtinguisher",
  },
];

export default getCategories;
