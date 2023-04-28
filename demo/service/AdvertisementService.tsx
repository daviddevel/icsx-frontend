import getConfig from 'next/config';
import { DTO } from '../../types/dto';

export class AdvertisementService {
    contextPath: string;

    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    getAdvertisements() {
        return fetch(this.contextPath + '/demo/data/advertisements.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as DTO.AdvertisementTable[]);
    }
}
