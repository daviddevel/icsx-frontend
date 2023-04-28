import React from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '../types/types';

const AppMenu = () => {

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Holidays', icon: 'pi pi-fw pi-calendar', to: '/pages/holidays' }]
        },
        {
            label: 'Users and Groups',

            items: [
                { label: 'All Users', icon: 'pi pi-fw pi-user', to: '/pages/users' },
                { label: 'Groups', icon: 'pi pi-fw pi-users', to: '/pages/groups' },
                { label: 'Online Users', icon: 'pi pi-fw pi-user', to: '/pages/onlineusers' },]
        },
        {
            label: 'Firms and Securities',
            items: [
                {
                    label: 'Firms',
                    icon: 'pi pi-fw pi-briefcase',
                    to: '/pages/firms'
                },
                {
                    label: 'Stock',
                    icon: 'pi pi-fw pi-money-bill',
                    to: '/pages/issues'
                },
                {
                    label: 'Advertisements',
                    icon: 'pi pi-fw pi-megaphone',
                    to: '/pages/advertisements'
                }
            ]
        },
        {
            label: 'Resources',

            items: [
                { label: 'User Guide', icon: 'pi pi-fw pi-book', to: '/pages/userguide' },
                { label: 'Help', icon: 'pi pi-fw pi-bell', to: '/pages/groups' },
                { label: 'Change Log', icon: 'pi pi-fw pi-history', to: '/pages/onlineusers' },]
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}

                <Link href="https://www.primefaces.org/primeblocks-react" target="_blank" style={{ cursor: 'pointer' }}>

                </Link>
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
