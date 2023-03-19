import React, { FC } from "react";

interface Props {
    children: React.ReactNode
}

const Layout: FC<Props> = ({ children }) => {
    {
        return <div className="flex flex-col justify-center items-center w-full h-full bg-base-100 text-white">
            {children}
        </div>;
    }
};

export default Layout;