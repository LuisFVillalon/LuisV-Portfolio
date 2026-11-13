import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { ContactTile } from '../components/home/InfoTiles';
import {
    ExperienceHeader,
    ProfessionalTimeline,
    AlongsideTimeline,
    BeyondTech,
    EducationTile,
    SkillsTile,
    CertificatesTile,
} from '../components/experience/ExperienceComponents';

export default function ExperiencePage() {
    return (
        <div className="flex min-h-screen flex-col items-center bg-[#F5F5F7] font-[Monospace]">
            <Navbar />
            <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
                {/* DOM order is the phone order: header, the timelines and contact, then the sidebar tiles.
                    On lg the header and sidebar tiles share the left column beside the timeline. */}
                <section className="grid grid-cols-1 gap-3 py-4 md:gap-4 md:py-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:grid-rows-[auto_1fr]">
                    <ExperienceHeader className="lg:col-start-1 lg:row-start-1" />

                    <div className="flex min-w-0 flex-col gap-3 md:gap-4 lg:col-start-2 lg:row-span-2 lg:row-start-1">
                        <ProfessionalTimeline />
                        <AlongsideTimeline />
                        <BeyondTech />
                        <ContactTile />
                    </div>

                    <div className="flex min-w-0 flex-col gap-3 md:gap-4 lg:col-start-1 lg:row-start-2 lg:self-start">
                        <EducationTile />
                        <SkillsTile />
                        <CertificatesTile />
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}
