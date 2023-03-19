import React, { useState } from "react";

import { HiOutlineXMark } from 'react-icons/hi2'
import { Rating } from "@smastrom/react-rating";

type ModalProps = {
    isOpen: boolean;
    isClose: React.MouseEventHandler;
    title?: string;
    children?: React.ReactNode;
    size?: string
    titleStyle?: string
};

const Modal: React.FC<ModalProps> = ({ isOpen, isClose, title, children, size, titleStyle }) => {
    return (
        <div
            className={`${isOpen ? "fixed" : "hidden"
                } inset-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50`}
        >

            <div className={`bg-base-100 ${size} rounded-lg p-6 overflow-auto`}>
                <a onClick={isClose} className="text-white text-4xl hover:text-accent cursor-pointer">
                    <HiOutlineXMark />
                </a>
                <div className="flex justify-center items-center mb-4">
                    <h1 className={`text-2xl font-semibold ${titleStyle}`}>
                        {title}
                    </h1>
                </div>
                <div>{children}</div>
                <Rating
                    value={3}
                    style={{ maxWidth: 180 }}
                    readOnly
                />
            </div>
        </div>
    );
};

export default Modal;