import { Star } from "lucide-react";

export default function ProductReviews({ reviews }) {
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) /
    reviews.length;

  return (
    <section className="py-20 border-t border-[#ece8e3]">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Heading */}
        <div className="mb-12">
          <p className="text-sm tracking-[3px] uppercase text-[#8c857d] mb-3">
            Customer Experiences
          </p>

          <h2 className="font-display text-4xl text-[#2c2c2c] mb-4">
            Reviews
          </h2>

          <div className="flex items-center gap-3">
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  size={18}
                  fill={
                    index < Math.round(averageRating)
                      ? "#665b54"
                      : "none"
                  }
                  className="text-[#665b54]"
                />
              ))}
            </div>

            <span className="text-[#6f6f6f]">
              {averageRating.toFixed(1)} ({reviews.length} Reviews)
            </span>
          </div>
        </div>

        {/* Reviews */}
        <div className="space-y-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-[#ece8e3] pb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-lg">
                  {review.name}
                </h3>

                <span className="text-sm text-[#8c857d]">
                  {review.date}
                </span>
              </div>

              <div className="flex mb-4">
                {[...Array(review.rating)].map((_, index) => (
                  <Star
                    key={index}
                    size={16}
                    fill="#665b54"
                    className="text-[#665b54]"
                  />
                ))}
              </div>

              <p className="text-[#6f6f6f] leading-8">
                {review.review}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}