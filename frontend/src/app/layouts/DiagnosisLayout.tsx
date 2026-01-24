import { Outlet } from "react-router-dom";

import { DiagnosisHeader } from "@/shared";

const DiagnosisLayout = () => {
    return (
        <div>
            <DiagnosisHeader />
            <Outlet />
        </div>
    );
};

export default DiagnosisLayout;