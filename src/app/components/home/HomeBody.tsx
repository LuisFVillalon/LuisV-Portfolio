import Wrapper from '../Wrapper';
import HeroSection from './HeroSection';
import TechSection from './TechSection';
import ProjectCardsSection from './ProjectCardsSection';
import TestimonialSection from './TestimonialSection';
import SelfieSection from './SelfieSection';
import CTASection from './CTASection';

export default function Homebody() {
    return (
        <Wrapper>
            <HeroSection/>
            {/* <TestimonialSection/> */}
            <TechSection/>
            <ProjectCardsSection/>
            <SelfieSection/>
            <CTASection/>
        </Wrapper>
    );
}