export interface Ligne {
    categorie: string;
    taille: string;
    genre: string;
    quantite: string;
}

export interface FormData {
    city: string;
    type: string;
    postalCode: string;
    address: string;
    description: string;
    lignes: Ligne[];
}

export interface Category {
    id: number;
    name: string;
    type: string;
}

export interface ItemCategory {
    id: number;
    item: PostItem;
    category: Category;
}

export interface Role {
    id: number;
    name: string;
}

export interface PostItem {
    id: number;
    size: string;
    quantity: number;
    ItemCategory: ItemCategory[];
}

interface Author {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    roleId: number;
    role: {
        name: string;
    };
}

export interface Post {
    id: number;
    address: string;
    city: string;
    postalCode: string;
    description: string;
    creationDate: string;
    author: Author;
    postType: {
        name: string;
    };
    items: PostItem[];
}