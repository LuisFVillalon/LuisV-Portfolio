import Image from "next/image";

export default function SelfieSection() {

    return (
            <div className="mt-[5%] flex flex-col gap-2 justify-center items-center">
                                 <Image 
                                        src="/selfie.JPG"
                                        alt="A selfie."
                                        width={500}  // Specify the width and height for optimization
                                        height={500}
                                        className="rounded-lg"
                                    />   
                                    <p className="text-base text-[#333333] italic">&quot;Whatever the mind can conceive and believe, it can achieve.&quot;</p>
                                    <p className="text-lg text-[#0A0A23] dm-serif-text-regular">- Napoleon Hill</p>
            </div>
    );
}