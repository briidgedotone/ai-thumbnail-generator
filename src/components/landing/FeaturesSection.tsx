"use client";

import { Card } from "@/components/ui/card";
// Removed CardContent and CardHeader imports as they are not explicitly used in the new structure
// import { cn } from "@/lib/utils"; // cn is not used

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-transparent dark:bg-transparent">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: For Creators */}
          <Card className="bg-white p-8 rounded-xl border-2 border-black flex flex-col shadow-none">
            <div className="mb-6">
              <span className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-md bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] shadow-[3px_3px_0px_0px_#18181B] border-2 border-black">
                FOR CREATORS
              </span>
            </div>
            <h3 className="text-3xl md:text-4xl font-semibold text-black mb-4 leading-tight">
              Focus on your video content, we'll help with the rest.
            </h3>
            <p className="text-gray-700 mb-8 text-base leading-relaxed">
              Spend less time fiddling with design tools or worrying about
              your thumbnails looking unprofessional. Our fine-tuned
              platform ensures every thumbnail grabs attention, so you
              can stay focused on creating great videos.
            </p>
            <div className="flex-grow bg-gray-200/50 border border-gray-300 rounded-lg p-6 flex items-center justify-center min-h-[300px]">
              <p className="text-gray-500">Thumbnail Customization UI Placeholder</p>
            </div>
          </Card>

          {/* Card 2: For Marketers */}
          <Card className="bg-white p-8 rounded-xl border-2 border-black flex flex-col shadow-none">
            <div className="mb-6">
              <span className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-md bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] shadow-[3px_3px_0px_0px_#18181B] border-2 border-black">
                FOR MARKETERS
              </span>
            </div>
            <h3 className="text-3xl md:text-4xl font-semibold text-black mb-4 leading-tight">
              Amplify your reach, effortlessly.
            </h3>
            <p className="text-gray-700 mb-8 text-base leading-relaxed">
              Craft compelling campaigns and track their performance. Our tools help you connect with your audience and grow your brand with data-driven insights.
            </p>
            <div className="flex-grow bg-gray-200/50 border border-gray-300 rounded-lg p-6 flex items-center justify-center min-h-[300px]">
              <p className="text-gray-500">Marketing Campaign UI Placeholder</p>
            </div>
          </Card>

          {/* Card 3: For Founders - Full Width, 60%ish height concept */}
          <Card className="md:col-span-2 bg-white p-8 rounded-xl border-2 border-black flex flex-col shadow-none h-[617px]">
            <div className="mb-6">
              <span className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-md bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] shadow-[3px_3px_0px_0px_#18181B] border-2 border-black">
                FOR FOUNDERS
              </span>
            </div>
            <div className="flex flex-col md:flex-row gap-8 flex-grow">
              {/* Text content on the left */}
              <div className="md:w-1/2 flex flex-col">
                <h3 className="text-3xl md:text-4xl font-semibold text-black mb-4 leading-tight">
                  Build your vision, backed by data.
                </h3>
                <p className="text-gray-700 text-base leading-relaxed mb-auto">
                  From concept to launch, get the insights and tools you need to build a successful brand. Streamline your workflow and focus on growth.
                </p>
              </div>
              {/* Image placeholder on the right */}
              <div className="md:w-1/2 flex-grow bg-gray-200/50 border border-gray-300 rounded-lg p-6 flex items-center justify-center min-h-[200px] md:min-h-full">
                <p className="text-gray-500">Founder Dashboard/Analytics UI Placeholder</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
} 