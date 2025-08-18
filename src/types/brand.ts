export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    imageIcon?: string;
}

export interface MenuCategory {
    id: string;
    name: string;
    items: MenuItem[];
}

export interface Menu {
    categories: MenuCategory[];
}

export interface ContactInfo {
    whatsapp?: string;
    whatsappMessage?: string;
    officialWebsite?: string;
    callWaiter?: boolean;
    instagramUrl?: string;
    instagramHandle?: string;
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
    contact: ContactInfo;
}

export interface BrandsData {
    brands: Brand[];
} 