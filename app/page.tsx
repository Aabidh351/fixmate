import FeaturedServices from "@/components/home/FeaturedServices";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import PopularCategories from "@/components/home/PopularCategories";
import WhyChooseUs from "@/components/home/WhyChooseUs";


export default function Home() {
  return (
    <div>
      <Hero/>
      <FeaturedServices/>
      <HowItWorks/>
      <PopularCategories/>
      <WhyChooseUs/>
    </div>
  );
}
