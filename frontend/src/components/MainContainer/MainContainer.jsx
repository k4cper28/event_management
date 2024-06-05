import React from 'react';
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

const MainContainer = ({ children, type = "default", description = "" }) => {
    return (
        <div className="flex flex-col items-start min-h-screen">
            <Navbar/>
            <div className='absolute left-0 right-0 top-0 -z-10 h-52 bg-gradient-to-b from-primary/10 from-10% ' />
            <main className="w-full flex flex-col justify-center items-center">
                {children}
                <Footer />
            </main>
        </div>
        
    );
}

export default MainContainer;
