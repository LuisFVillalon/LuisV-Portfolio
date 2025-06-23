import {Star} from 'lucide-react'
import Link from 'next/link';

interface ReviewCardProps {
    quote: string;
    name: string;
    job_title: string;
    company: string;
    fullQuote: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ 
    quote,
    name,
    job_title,
    company,
    fullQuote
}) => {
    
    return (
        <>
            {fullQuote ? 
                <div className="p-4 bg-[#0A0A23] rounded-2xl shadow-2xl overflow-hidden text-[#FFFFFF] my-[5%] md:my-[1%] max-w-6xl w-full border rounded-lg relative">         
                    <div className="flex gap-3 flex-col p-4 p-[5%]">
                <p className="text-base break-words">&quot;{quote}&quot;</p>

                <div className='flex items-center justify-between'>
                    <Star className="w-5 h-5 text-[#FFD700]" style={{ fill: '#FFD700' }} />
                    <Star className="w-5 h-5 text-[#FFD700]" style={{ fill: '#FFD700' }} />
                    <Star className="w-5 h-5 text-[#FFD700]" style={{ fill: '#FFD700' }} />
                    <Star className="w-5 h-5 text-[#FFD700]" style={{ fill: '#FFD700' }} />
                    <Star className="w-5 h-5 text-[#FFD700]" style={{ fill: '#FFD700' }} />
                </div>
                <div className='flex flex-col justify-center items-end '>
                    <p className="text-sm break-words dm-serif-text-regular">- {name}</p>
                    <p className="text-sm break-words font-bold">{job_title}</p>
                    <p className="text-sm break-words italic">{company}</p>
                </div>
                    </div>
                </div>
            :
                <Link href="/testimonials">
                    <div className="cursor-pointer transform transition duration-300 ease-in-out 
                      hover:scale-105 hover:-translate-y-1 
                      hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-500 
                      bg-[#0A0A23] rounded-2xl 
                      overflow-hidden text-[#FFFFFF] mx-auto 
                       border rounded-lg p-4 md:w-[300px]">         
                        <div className=" flex gap-3 flex-col p-4 p-[5%]">
                            <p className="text-base break-words">
                                &quot;{quote.split(' ').slice(0, 15).join(' ')}{quote.split(' ').length > 10 ? '...' : ''}&quot;
                            </p>

                            <div className='flex items-center justify-between'>
                                <Star className="w-5 h-5 text-[#FFD700]" style={{ fill: '#FFD700' }} />
                                <Star className="w-5 h-5 text-[#FFD700]" style={{ fill: '#FFD700' }} />
                                <Star className="w-5 h-5 text-[#FFD700]" style={{ fill: '#FFD700' }} />
                                <Star className="w-5 h-5 text-[#FFD700]" style={{ fill: '#FFD700' }} />
                                <Star className="w-5 h-5 text-[#FFD700]" style={{ fill: '#FFD700' }} />
                            </div>
                            <div className='flex flex-col justify-center items-end '>
                                <p className="text-end text-sm break-words dm-serif-text-regular text-regular">- {name}</p>
                                <p className="text-end text-sm break-words font-bold">{job_title}</p>
                                <p className="text-end text-sm break-words italic">{company}</p>
                            </div>
                        </div>
                    </div>
                </Link>        
        }
        </>
    );
};

export default ReviewCard;