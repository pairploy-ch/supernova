import HeroSlider from "@/components/home/HeroSlider";
import TickerBanner from "@/components/home/TickerBanner";
import FeaturedNews from "@/components/home/FeaturedNews";
import NewsFeed from "@/components/home/NewsFeed";
import GamesBanner from "@/components/home/GamesBanner";
import CommunitySection from "@/components/community/CommunitySection";
import GuideTips from "@/components/home/GuideTips";
import { getLatestArticles } from "@/lib/supabase/queries/articles";
import { ARTICLE_CATEGORY_META } from "@/lib/articleCategory";

export default async function HomePage() {
  const heroArticles = await getLatestArticles(3);
  const slides = heroArticles.map((a) => ({
    slug: a.slug,
    badge: ARTICLE_CATEGORY_META[a.category].label,
    badgeColor: ARTICLE_CATEGORY_META[a.category].hex,
    title: a.title,
    desc: a.excerpt,
    bg: a.coverImageUrl,
  }));

  return (
    <>
      <HeroSlider slides={slides} />
      <TickerBanner />
      <FeaturedNews />
      <NewsFeed />
      <GamesBanner />
      <CommunitySection />
      <GuideTips />
    </>
  );
}
