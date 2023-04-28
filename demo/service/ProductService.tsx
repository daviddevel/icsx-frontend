import getConfig from 'next/config';
import { Demo } from '../../types/types';

export class ProductService {
    contextPath: string;

    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    getProductsSmall() {
        return fetch(this.contextPath + '/demo/data/products-small.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    }

    getUsers() {
        return fetch(this.contextPath + '/demo/data/users.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.UserTable[]);
    }

    getProductsWithOrdersSmall() {
        return fetch(this.contextPath + '/demo/data/products-orders-small.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    }
}
