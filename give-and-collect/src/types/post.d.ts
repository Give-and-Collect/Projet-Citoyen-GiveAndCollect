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

export interface Role {
    id: number;
    name: string;
}

export interface PostItem {
    size: string;
    quantity: number;
    categories: { id: number; itemId: number; categoryId: number }[];
}

interface Author {
    firstname: string;
    lastname: string;
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
    author: {
        firstname: string;
        lastname: string;
        roleId: number;
    };
    postType: {
        name: string;
    };
    items: PostItem[];
}