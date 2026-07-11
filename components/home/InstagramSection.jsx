import Container from "@/components/common/Container";
import { fetchInstagramMedia } from "@/lib/instagram";
import InstagramGrid from "./InstagramGrid";

export default async function InstagramSection() {
  const posts = await fetchInstagramMedia();

  // Hide the section cleanly if no posts are returned (API failure, token issue, or no posts)
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 border-t border-gray-200 bg-[#EAE8E2]" aria-labelledby="instagram-section-heading">
      <Container>
        {/* Heading Section */}
        <div className="mb-12 text-center max-w-2xl mx-auto px-4">
          <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8C8375] mb-3">
            FOLLOW OUR JOURNEY
          </p>
          <h2 id="instagram-section-heading" className="font-display text-[22px] md:text-[28px] uppercase tracking-[4px] text-[#393938]">
            Follow Stoneza on Instagram
          </h2>
          <div className="mt-5 mx-auto h-[1px] w-12 bg-[#c98b4b]" />
          <p className="mt-5 font-display text-[14px] leading-relaxed text-[#6A655C] md:text-[15px] font-light max-w-xl mx-auto">
            Discover natural stone inspiration, completed projects, timeless surfaces, and the latest from Stoneza.
          </p>
        </div>

        {/* Responsive Grid & Modal */}
        <InstagramGrid posts={posts} />
      </Container>
    </section>
  );
}
