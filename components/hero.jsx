"use client";

import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

//the tilting of front banner mechanism
const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;

    const handleScroll = () => {
      if (window.scrollY > 100) {
        imageElement.classList.add("hero-image-scrolled");
      } else {
        imageElement.classList.remove("hero-image-scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full pt-36 md:pt-48 pb-10">
      <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto">
          <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title">
            Your AI Career Coach For
            <br />
            Professional Success
          </h1>

          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            Advance your career with personalized guidance, interview preparation
            and AI-powered tools for job success.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>

          <Link href="https://www.youtube.com/watch?v=O7oQP00X1ns">
            <Button size="lg" variant="outline" className="px-8">
              Watch Trailer
            </Button>
          </Link>
        </div>

        {/* Hero Image */}
        <div className="hero-image-wrapper mt-8">
          <div ref={imageRef} className="hero-image">
            <Image
              src="/stranger_things_resume.png"
              width={1280}
              height={720}
              alt="Banner Sens-AI"
              className="rounded-lg shadow-2xl border mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
