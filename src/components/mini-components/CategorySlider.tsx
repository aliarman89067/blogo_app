"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { categories } from "@/utils/data";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CategorySliderProps {
  categoryName: string;
}

export const CategorySlider = ({ categoryName }: CategorySliderProps) => {
  const router = useRouter();
  return (
    <Swiper
      navigation={true}
      slidesPerView={8}
      spaceBetween={10}
      grabCursor={true}
      pagination={{ clickable: true }}
      className="mySwiper"
      preventClicks={false}
      preventClicksPropagation={false}
    >
      <SwiperSlide
        className={cn(
          "category-slider-item",
          categoryName === "All" ? "active-category" : "inactive-category"
        )}
        onClick={() => router.push(`/category/All`)}
      >
        All
      </SwiperSlide>
      {categories.map((category, index: number) => (
        <SwiperSlide
          key={index}
          onClick={() => router.push(`/category/${category.nameForDatabase}`)}
          className={cn(
            "category-slider-item",
            categoryName === category.nameForDatabase
              ? "active-category"
              : "inactive-category"
          )}
        >
          {category.name}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
