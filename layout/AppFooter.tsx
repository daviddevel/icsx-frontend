/* eslint-disable @next/next/no-img-element */
import getConfig from 'next/config';
import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    return (
        <div className="layout-footer">
            <img src={`${contextPath}/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.png`} alt="Logo" height="30" className="mr-2" />
            
            <span className="font-medium ml-2">©2023 Cambodia Securities Exchange (CSX)
</span>
        </div>
    );
};

export default AppFooter;
