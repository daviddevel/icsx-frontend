/* eslint-disable @next/next/no-img-element */
import getConfig from 'next/config';
import Link from 'next/link';
import router from 'next/router';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '../types/types';
import { LayoutContext } from './context/layoutcontext';
import { useLogout } from "../src/hooks/auth/useLogout";
import { Menu } from 'primereact/menu';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { logout } = useLogout();
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const menu = useRef<Menu>(null);
    const toggleMenu: React.MouseEventHandler<HTMLButtonElement> | undefined = (event) => {
        menu.current?.toggle(event);
    };

    const overlayMenuItems = [
        {
            label: 'Profile',
            icon: 'pi pi-user-edit',
            command: () => router.push("/pages/profile")
        },
        {
            label: 'Logout',
            icon: 'pi pi-power-off',
            command: () => {
                        logout();
                        router.push("/login")
                    }
        }
    ];

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`${contextPath}/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.png`} alt="logo" />
                <span>&nbsp; &nbsp; ICSX Admin</span>
                
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                


                <Menu ref={menu} model={overlayMenuItems} popup />
                <button onClick={toggleMenu}
                    type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button>
                <Link href="/pages/users">
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-cog"></i>
                        <span>Settings</span>
                    </button>
                </Link>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
