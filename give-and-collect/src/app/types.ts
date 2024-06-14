// types.ts
export interface Ligne {
    categorie: string;
    taille: string;
    genre: string;
    quantite: string;
}

export interface FormData {
    ville: string;
    type: 'don' | 'collecte';
    adresse: string;
    lignes: Ligne[];
}
