import React from 'react';
import VerificationProgressTracker from "../components/Home/VerificationProgressTracker";
import VerificationSection from "../components/Home/VerificationSection";
import PageTemplate from "../components/PageTemplate";
import Header from "../components/Home/Header";

function Home(props: any) {
    return (
        <PageTemplate>
            <div className="grid columns-12">
                <div className="col-start-1 col-end-12 bg-[#FAFBFD] text-center">
                    <Header/>
                </div>
                <div
                    className="col-start-1 col-end-12 md:col-start-1 md:col-span-6 md:bg-[#FAFBFD] xs:w-[100vw] md:max-w-[50vw]">
                    <VerificationProgressTracker/>
                </div>
                <div className="col-start-1 col-end-12 md:col-start-7 md:col-end-12 xs:[100vw] md:w-[50vw]">
                    <VerificationSection/>
                </div>
            </div>
        </PageTemplate>
    );
}

export default Home;
