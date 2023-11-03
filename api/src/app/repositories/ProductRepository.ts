import { Produto } from "../../domain/entities/produto";

export interface ProductRepository {
    findById(id: string): Promise<Produto | null>;
}