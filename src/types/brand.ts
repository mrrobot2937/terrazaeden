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

export interface RaffleConfig {
    enabled?: boolean;
    prizeAmount?: number;
    prizeTitle?: string;
    closingDate?: string; // ISO date string
    winner?: {
        decided: boolean;
        name?: string;
        instagram?: string;
    };
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
    raffle?: RaffleConfig;
}

export interface BrandsData {
    brands: Brand[];
} 