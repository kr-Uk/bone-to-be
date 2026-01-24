import { DiagnosisHeader } from "@/shared";
import { Outlet } from "react-router-dom";

const DiagnosisLayout = () => {
    return (
        <div>
            <DiagnosisHeader />
            <Outlet />
        </div>
    );
};

export default DiagnosisLayout;