/** Semilla del equipo en /nosotros. El panel `/admin/equipo` puede sustituirla en este navegador. */

export const TEAM_ROLES = [
  "Gerente general",
  "Asesor",
  "Vendedor",
  "Equipo tienda",
  "Equipo TI",
  "Almacén",
  "Otro",
] as const;

export type TeamRole = (typeof TEAM_ROLES)[number];

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  hidden?: boolean;
};

export const defaultTeam: TeamMember[] = [
  {
    id: "tm_gerente",
    name: "Por definir",
    role: "Gerente general",
    photo: "/images/categorias/herramientas.jpg",
    bio: "Dirección comercial y operación mayorista.",
  },
  {
    id: "tm_asesor",
    name: "Por definir",
    role: "Asesor",
    photo: "/images/categorias/electricidad.jpg",
    bio: "Asesoría de línea, marcas y cotizaciones por volumen.",
  },
  {
    id: "tm_vendedor",
    name: "Por definir",
    role: "Vendedor",
    photo: "/images/categorias/ferreteria.jpg",
    bio: "Atención a ferreterías, distribuidores y obras.",
  },
  {
    id: "tm_tienda",
    name: "Equipo de tienda",
    role: "Equipo tienda",
    photo: "/images/categorias/hogar.jpg",
    bio: "Despacho, almacén y atención presencial en Lima.",
  },
];
