import Image from "next/image";

export default function SelfieSection() {

    return (
            <div className="flex flex-col justify-center items-center">
                                 <Image
                                        src="/selfie.JPG"
                                        alt="A selfie."
                                        width={500}  // Specify the width and height for optimization
                                        height={500}
                                        className="rounded-lg"
                                    />   
                                    <p className="text-center text-base text-[#333333] italic">&quot;Whatever the mind can conceive and believe, it can achieve.&quot;</p>
                                    <p className="text-center text-lg text-[#0A0A23] font-sans">- Napoleon Hill</p>
            </div>
    );
}