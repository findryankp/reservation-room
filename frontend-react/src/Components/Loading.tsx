import React from 'react'

const Loading = () => {
    return (
        <div className="fixed top-100 left-50 mt-96">
            <div className="flex items-center w-screen h-screen justify-center content-center">
                <div
                    className="inline-block h-20 w-20 animate-spin rounded-full border-8 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status">
                    <span
                    className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                    >Loading...</span>
                </div>
            </div>
        </div>
    )
}

export default Loading