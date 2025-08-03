export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
}

export interface MenuCategory {
    id: string;
    name: string;
    items: MenuItem[];
}

export interface Menu {
    categories: MenuCategory[];
}

export interface Brand {
    id: string;
    name: string;
    description: string;
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    category: string;
    menu: Menu;
}

export interface BrandsData {
    brands: Brand[];
} 