import getConfig from 'next/config';
import { DTO } from '../../types/dto';

export class OnlineUserService {
    contextPath: string;

    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    getOnlineUsers() {
        return fetch(this.contextPath + '/demo/data/onlineusers.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as DTO.OnlineUserTable[]);
    }   
}