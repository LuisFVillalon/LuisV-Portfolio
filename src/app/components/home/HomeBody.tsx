import Wrapper from '../Wrapper';
import HeroSection from './HeroSection';
import TechSection from './TechSection';
import ProjectCardsSection from './ProjectCardsSection';
import CTASection from './CTASection';

export default function Homebody() {
    return (
        <Wrapper>
            <HeroSection/>
            <TechSection/>
            <ProjectCardsSection/>
            <CTASection/>
        </Wrapper>
    );
}