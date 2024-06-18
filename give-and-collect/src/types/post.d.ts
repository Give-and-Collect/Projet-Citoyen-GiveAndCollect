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
