import getConfig from 'next/config';
import { apiService } from '../../src/services';
import { DTO } from '../../types/dto';

export class GroupService {

    contextPath: string;

    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }
    
    getGroups() {
        return fetch(this.contextPath + '/demo/data/groups.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as DTO.GroupTable[]);
    }
}
