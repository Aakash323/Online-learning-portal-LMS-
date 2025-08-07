import React from "react";
import InstructorSidebar from "../components/Instructorsidebar";
import { Outlet} from "react-router-dom";


const InstructorLayout = () => {
 

  return (
    <div className="flex">
      <InstructorSidebar />
      <div className="flex-1 ml-20 md:ml-18 transition-all duration-300">
        <Outlet />
      </div>
    </div>
  );
};

export default InstructorLayout;
