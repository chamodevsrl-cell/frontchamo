export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
};

export const productos: Producto[] = [
  {
    id: 1,
    nombre: "Audífonos Bluetooth Pro",
    precio: 49.99,
    imagen:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  },
  {
    id: 2,
    nombre: "Reloj inteligente Sport",
    precio: 89.5,
    imagen:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
  },
  {
    id: 3,
    nombre: "Cargador portátil 20000 mAh",
    precio: 32.0,
    imagen:
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80",
  },
  {
    id: 4,
    nombre: "Mouse gamer RGB",
    precio: 27.9,
    imagen:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
  },
  {
    id: 5,
    nombre: "Lámpara LED de escritorio",
    precio: 21.4,
    imagen:
      "https://images.unsplash.com/photo-1507473886605-4f7b75a2e3a0?w=800&q=80",
  },
  {
    id: 6,
    nombre: "Mini parlante inalámbrico",
    precio: 38.75,
    imagen:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
  },
];
