import getConfig from 'next/config';
import { DTO } from '../../types/dto';

export class SecurityService {
    contextPath: string;

    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    getSecurities() {
        return fetch(this.contextPath + '/demo/data/securities.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as DTO.SecurityTable[]);
    }
}
