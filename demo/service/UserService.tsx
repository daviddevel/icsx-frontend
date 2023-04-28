import getConfig from 'next/config';
import { DTO } from '../../types/dto';


export class UserService {
    contextPath: string;

    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    getUsers() {
        return fetch(this.contextPath + '/demo/data/users.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as DTO.UserTable[]);
    }
    
}
