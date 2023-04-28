import getConfig from 'next/config';
import { DTO } from '../../types/dto';

export class FirmService {
    contextPath: string;

    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    getFirms() {
        return fetch(this.contextPath + '/demo/data/firms.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as DTO.FirmTable[]);
    }
}
