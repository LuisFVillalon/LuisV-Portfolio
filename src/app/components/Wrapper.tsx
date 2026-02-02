import React from "react"; // ✅ Make sure this is present

interface WrapperProps {
  children: React.ReactNode;
}

function Wrapper({ children }: WrapperProps) {
  return (
    <div
      className="
        bg-[#FFFFFF]
        mx-auto
        w-full
        max-w-4xl
        px-6 sm:px-4
        overflow-hidden
      "
    >
      {children}
    </div>
  );
}

export default Wrapper;