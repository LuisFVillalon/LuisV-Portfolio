import React from "react"; // ✅ Make sure this is present

interface WrapperProps {
  children: React.ReactNode;
}

function Wrapper({ children }: WrapperProps) {
  return (
    <div
      className=
        "bg-[#FFFFFF] wrapper m-[0_auto] max-w-4xl px-6 sm:px-4"
      
    >
      {children}
    </div>
  );
}

export default Wrapper;