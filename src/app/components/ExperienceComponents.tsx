import {professionalExperience, education, certificates, techTools} from '../lib/experience';


export function CurrentlyDoing() {
    return (
        <div>
            <p className="text-lg md:text-2xl font-extrabold mb-[5%] md:mb-[2%]">Currently Doing</p>
            <a className="text-[#006400] underline mb-[5%] md:mb-[0%] text-lg md:text-xl font-bold"
                href={professionalExperience[0].link} 
                target="_blank" 
                rel="noopener noreferrer"
            >{professionalExperience[0].company}</a>
            <div className="text-base md:text-lg flex justify-between mb-[2%] md:mb-[1%]">
                <p className="text-[#0A0A23] w-[60%] italic font-semibold">{professionalExperience[0].position}</p>
                <p className="text-end w-[40%]">{professionalExperience[0].time}</p>
            </div>
            <p className="text-base"> 
                {professionalExperience[0].description}
            </p>
            <p className="text-base mt-[3%] md:mt-[1%]"><strong>Tech:</strong> {professionalExperience[0].tech}</p>
        </div>
    );
}

export function ProfessionalExperience() {
    return (
        <div>
            <p className="text-lg md:text-2xl font-extrabold mb-[5%] md:mb-[2%]">Professional Experience</p>
            {professionalExperience.map((item, index) => (
                <div key={index}>
                            <a className="text-[#006400] underline mb-[5%] md:mb-[0%] text-lg md:text-xl font-bold"
                                href={item.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >{item.company}</a>
                            <div className="text-base md:text-lg flex justify-between mb-[2%] md:mb-[1%]">
                                <p className="text-[#0A0A23] w-[60%] italic font-semibold">{item.position}</p>
                                <p className="text-end w-[40%]">{item.time}</p>
                            </div>
                            <p className="text-base"> 
                                {item.description}
                            </p>
                            <p className="text-base mt-[3%] md:mt-[1%]"><strong>Tech:</strong> {item.tech}</p>
                            
                            <div className="my-[5%] md:my-[2%] border-b border-gray-250"></div>
                </div>
            ))}
        </div>
    );
}

export function Education() {
    return (
        <div>
            <p className="text-lg md:text-2xl font-extrabold mb-[5%]  md:mb-[2%]">Education</p>
            {education.map((item, index) => (
                <div key={index}>
                    <a className="text-[#006400] underline mb-[5%] md:mb-[0%] text-lg md:text-xl font-bold"
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >{item.institution}</a>
                    <div className="text-base md:text-lg flex justify-between mb-[2%] md:mb-[1%]">
                        <p className="text-[#0A0A23] w-[60%] italic font-semibold">{item.course}</p>
                        <p className="text-end w-[40%]">{item.time}</p>
                    </div>
                    <p className="text-base"> 
                        {item.description}
                    </p> 
                    <p className="text-base mt-[3%] md:mt-[1%]"><strong>Tech:</strong> {item.tech} </p>
                    
                    <div className="my-[5%] md:my-[1%] border-b border-gray-250"></div>
                </div>
            ))}
        </div>
    );
}

export function Certificates() {
    return (
        <div>
            <p className="text-lg md:text-2xl font-extrabold mb-[5%] md:mb-[2%]">Certificates</p>
 
            {certificates.map((item, index) => (
                <div key={index}>
                    <a className="text-[#006400] underline mb-[5%] md:mb-[0%] text-lg md:text-xl font-bold"
                        href={item.cert_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >{item.title}</a>
                    <div className="text-base md:text-lg flex justify-between mb-[2%] md:mb-[1%]">
                        <a className="text-[#006400] w-[60%] italic font-semibold underline" 
                            href={item.institution_link} 
                            target="_blank" 
                            rel="noopener noreferrer">
                                {item.institution}
                        </a>
                        <p className="text-end w-[40%]">{item.time}</p>
                    </div>
                    <p className="text-base"> 
                        {item.description}
                    </p>
                    <p className="text-base mt-[3%] md:mt-[1%]">
                        <strong>Tech:</strong> {item.tech}
                    </p>
                    
                    <div className="my-[5%] md:my-[1%] border-b border-gray-250"></div>
                </div>
            ))} 
                           
        </div>
    );
}

export function TechTools() {
    return (
        <div>
            <p className="text-lg md:text-2xl font-extrabold mb-[5%] md:mb-[2%]">Tech Tools</p>
            {techTools.map((item, index) => (
                <div key={index}>
                    <p className="mb-[0%] text-lg md:text-xl font-bold">{item.subject}:</p>
                    <div className="flex flex-wrap">
                        {item.tools.map((tech_item, link_index) => {
                            const isLast = link_index === item.tools.length - 1;
                            return (
                                <p key={link_index} className="text-base mt-[3%] md:mt-[1%] text-[#006400]">
                                    <a href={tech_item.link} className="underline" target="_blank" rel="noopener noreferrer">
                                        {tech_item.tool}
                                    </a>
                                    {!isLast && ',\u00A0'} {/* Only add a comma if it's NOT the last item */}
                                </p>
                            );
                        })}
                    </div>
                    <div className="my-[5%] md:my-[1%] border-b border-gray-250"></div>
                </div>
            ))} 
        </div>
    );
}

export function ExperienceBeyondTech() {
    return (
        <div>
            <p className="text-lg md:text-2xl font-extrabold mb-[5%] md:mb-[2%]">Experience Beyond Tech</p>

            <p className=" mb-[5%]  md:mb-[0%] text-lg md:text-xl font-bold">After School Enrichment Tutor</p>
            <div className="text-lg flex justify-between mb-[2%]  md:mb-[1%]">
                <p className="underline w-[60%] italic font-semibold text-[#006400]">
                    <a href="https://www.cusdk12.org/departments/educational-services/after-school-program/index.html"
                        target="_blank" rel="noopener noreferrer">SPARKS, Calexico Unified School District
                    </a>
                </p>
                <p className="text-end w-[40%]">Dec 2023 - May 2024</p>
            </div>
            <p className="text-base"> 
                Led engaging after-school enrichment classes on science, technology, engineering, art, and math (STEAM), 
                fostering curiosity and hands-on learning for students.
            </p>   
            <p className="text-base mt-[3%] md:mt-[1%]"><strong>Skills</strong>: Leadership, Creativity, Adaptability, Communication, 
                Problem-Solving, Organization, Engagement, Mentorship, Collaboration </p>              

            <div className="my-[5%] md:my-[2%] border-b border-gray-250"></div>    

            <p className="mb-[5%]  md:mb-[0%] text-lg md:text-xl font-bold">Sales</p>
            <div className="text-lg flex justify-between mb-[2%]  md:mb-[1%]">
                <p className="w-[60%] italic font-semibold">Retail Industry</p>
                <p className="text-end w-[40%]">1+ year</p>
            </div>
            <p className="text-base"> 
                Tracked sales performance and consistently met daily goals by engaging customers, driving purchases, and optimizing retail sales strategies.
            </p>   
            <p className="text-base mt-[3%] md:mt-[1%]">
                <strong>Employers</strong>: <a href="https://www.garlans.com/password"
                    target="_blank" rel="noopener noreferrer" className="underline text-[#006400]">
                    Garlan&apos;s
                </a>
                , <a href="https://www.aeropostale.com/?utm_source=google&utm_medium=cpc&utm_campaign=tin_aero_sem_ggl_cvr_dr_b_sem_usa_bau_core_na&utm_id=16420514073&utm_content=134663279460-core_unisex_prfm_kw_core&utm_term=aeropostale&gclsrc=aw.ds&&utm_source=google&utm_medium=cpc&utm_campaign=tin_aero_sem_ggl_cvr_dr_b_sem_usa_bau_core_na&utm_id=16420514073&utm_content=134663279460-core_unisex_prfm_kw_core&utm_term=aeropostale&gclid=Cj0KCQiAkoe9BhDYARIsAH85cDMloEgmb-fWzlsXRek7Ax64GpT6gPrVZnw87xiDSK0weqvvsVyV-LsaAhODEALw_wcB&gad_source=1"
                    target="_blank" rel="noopener noreferrer" className="underline text-[#006400]">
                    Aeropostale
                </a>
            </p>        

            <div className="my-[5%] md:my-[2%] border-b border-gray-250"></div>                  

            <p className="mb-[5%]  md:mb-[0%] text-lg md:text-xl font-bold">Emergency Medical Technician</p>
            <div className="text-lg flex justify-between mb-[2%]  md:mb-[1%]">
                <p className="underline w-[60%] italic font-semibold text-[#006400]">
                    <a href="https://www.amr.net/"
                        target="_blank" rel="noopener noreferrer">American Medical Response
                    </a>
                </p>
                <p className="text-end w-[40%]">Feb 2022 - Sept 2022</p>
            </div>
            <p className="text-base"> 
                Provided emergency medical care and basic life support during 911 calls and interfacility transports, 
                ensuring patient stability and safety.
            </p>   
            <p className="text-base mt-[3%] md:mt-[1%]"><strong>Skills</strong>: Emergency Response, Patient Care, First Aid, 
                Critical Thinking, Teamwork, Stress management, Assesstment</p>                          

            <div className="my-[5%] md:my-[2%] border-b border-gray-250"></div>      

            <p className="mb-[5%] md:mb-[0%] text-lg md:text-xl font-bold">Customer Service</p>
            <div className="text-base md:text-lg flex justify-between mb-[2%] md:mb-[1%]">
                <p className="w-[60%] italic font-semibold">Food Service Industry</p>
                <p className="text-end w-[40%]">3+ years</p>
            </div>
            <p className="text-base"> 
                Gained hands-on experience in fast-paced food service environments, providing customer service, 
                preparing food, and working efficiently as part of a team.
            </p>

            <p className="text-base mt-[3%] md:mt-[1%]">
                <strong>Employers</strong>: <a href="https://aftersicecream.com/"
                    target="_blank" rel="noopener noreferrer" className="underline text-[#006400]">
                    After&apos;s
                </a>
                , <a href="https://www.elfogonmexgrill.com/"
                    target="_blank" rel="noopener noreferrer" className="underline text-[#006400]">
                    El Fogon
                </a>
                , <a href="https://www.kfc.com/menu?utm_source=google&utm_medium=search&utm_campaign=natl_brand&utm_creative=CORE&utm_source=google&utm_medium=cpc&utm_campaign=&utm_term=kfc&utm_content=s_pcrid_673635137993_pkw_kfc_pmt_b_pdv_c_slid__pgrid_160205484424_ptaid_kwd-11625431_&gad_source=1&gclid=Cj0KCQiAkoe9BhDYARIsAH85cDMCIgCnMEY3xt5sH2dth0KXVc_IQivI14y9bSHq8wmJvvVeT79yWiIaAu-7EALw_wcB"
                    target="_blank" rel="noopener noreferrer" className="underline text-[#006400]">
                    KFC
                </a>
                , <a href="https://order.habitburger.com/store/666cc733-f94b-e911-822e-02838e5eb552/categories#cfcbb04a-c88e-e911-8259-020f3289bcb6"
                    target="_blank" rel="noopener noreferrer" className="underline text-[#006400]">
                    The Habit
                </a> 
            </p>           

        </div>
    );
}