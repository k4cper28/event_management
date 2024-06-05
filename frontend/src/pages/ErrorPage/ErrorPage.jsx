import React from "react";
import MainContainer from "@/components/MainContainer/MainContainer";

function ErrorPage() {
    return (
        <MainContainer type="default">
            <div className="flex justify-center items-center w-full h-[100vh]">
                <h1 className="font-bold ">404 - Not Found</h1>
            </div>
        </MainContainer>
    );
}

export default ErrorPage;