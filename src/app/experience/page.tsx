import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { ContactTile } from '../components/home/InfoTiles';
import {
    ExperienceHeader,
    GlanceStrip,
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
                {/* Header and at-a-glance strip span the page; below them the sidebar (Education, Certificates, Skills)
                    sits beside the timelines on lg. DOM order is the phone order: the strip already summarizes the sidebar,
                    so the timelines come before the full sidebar tiles. */}
                <section className="flex flex-col gap-3 py-4 md:gap-4 md:py-6">
                    <ExperienceHeader />
                    <GlanceStrip />
                    <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
                        <div className="flex min-w-0 flex-col gap-3 md:gap-4 lg:col-start-2 lg:row-start-1">
                            <ProfessionalTimeline />
                            <AlongsideTimeline />
                            <BeyondTech />
                            <ContactTile />
                        </div>

                        <div className="flex min-w-0 flex-col gap-3 md:gap-4 lg:col-start-1 lg:row-start-1 lg:self-start">
                            <EducationTile />
                            <CertificatesTile />
                            <SkillsTile />
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}
