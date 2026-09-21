import raw from './products.json';

export interface Product {
  name: string;
  img_url: string | null;
  price: string | null;
  unit: string;
  moq: string | null;
  details: Record<string, string>;
  desc: string;
  category: string;
  anchor: string;
  slug: string;
  img: string | null;
}

export interface Category {
  name: string;
  anchor: string;
  products: Product[];
}

export const PRODUCTS = raw as unknown as Product[];

export const CATEGORIES: Category[] = (() => {
  const order: [string, string][] = [
    ['Men Sanganeri Shirt', 'sanganeri'],
    ['Men Jaipuri Shirt', 'jaipuri'],
    ['Hand Block Print Shirt', 'hand-block'],
    ['Men Rajasthani Shirt', 'rajasthani'],
    ['Men Ajrakh Printed Shirt', 'ajrakh'],
    ['Men Udaipuri Printed Shirt', 'udaipuri'],
    ['Cambric Shirt', 'cambric'],
    ['Mens Linen Shirts', 'linen'],
    ['Men Shirts', 'men-shirts'],
    ['Cotton Fabric', 'cotton-fabric'],
  ];
  return order
    .map(([name, anchor]) => ({
      name,
      anchor,
      products: PRODUCTS.filter((p) => p.anchor === anchor),
    }))
    .filter((c) => c.products.length > 0);
})();

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export const relatedProducts = (p: Product, n = 8) =>
  PRODUCTS.filter((q) => q.anchor === p.anchor && q.slug !== p.slug).slice(0, n);

export const productImg = (p: Product) => (p.img ? `/${p.img}` : '');

export const CATEGORY_LABEL: Record<string, string> = {
  sanganeri: 'Sanganeri',
  jaipuri: 'Jaipuri',
  'hand-block': 'Hand Block',
  rajasthani: 'Rajasthani',
  ajrakh: 'Ajrakh',
  udaipuri: 'Udaipuri',
  cambric: 'Cambric',
  linen: 'Linen',
  'men-shirts': 'Men Shirts',
  'cotton-fabric': 'Cotton Fabric',
};
