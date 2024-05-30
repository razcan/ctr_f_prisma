/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <>
        </>
        // <div className="layout-footer">
        //     <img src={`/layout/images/image.svg`} width="57.22px" height={'45px'} alt="logo" />
        //     by
        //     <span className="font-medium ml-2">@SHB</span>
        // </div>
    );
};

export default AppFooter;
