export type TestimoniData = {
  id: string;
  imageSrc: string;
  rating: number;
  name: string;
};

const testimoniData: TestimoniData[] = [
  {
    id: "01",
    name: "Budi Saputra",
    imageSrc: "/pelanggan/pelanggan-01.jpg",
    rating: 5,
  },
  {
    id: "02",
    name: "Rina Sulastri",
    imageSrc: "/pelanggan/pelanggan-04.jpeg",
    rating: 5,
  },
  {
    id: "03",
    name: "Fahri Pratama",
    imageSrc: "/pelanggan/pelanggan-02.jpeg",
    rating: 5,
  },
  {
    id: "04",
    name: "Dedi Sudrajad",
    imageSrc: "/pelanggan/pelanggan-03.jpg",
    rating: 5,
  },
  {
    id: "05",
    name: "Siska Ananda",
    imageSrc: "/pelanggan/pelanggan-06.jpeg",
    rating: 5,
  },
  {
    id: "06",
    name: "Riana Winata",
    imageSrc: "/pelanggan/pelanggan-05.jpeg",
    rating: 5,
  },
];

export default testimoniData;
