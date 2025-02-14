import { CgFacebook } from "react-icons/cg";
import { BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const tags = [
    "News",
    "Politics",
    "Business",
    "Technology",
    "Sports",
    "Health",
    "Science",
    "Entertainment",
    "World",
    "Economy",
    "Climate",
    "Elections",
    "Website",
    "Travel",
    "Culture",
    "Football",
    "Real Madrid",
    "Barcelona",
    "Liverpool F.c",
    "Arsenal",
    "FIFA",
    "UEFA",
  ];

  const topViewedNews = [
    {
      date: "Feb 14, 2025",
      title: "Real Madrid Eyes Another UCL Title \n in 2024/25 Season",
    },
    {
      date: "Jan 28, 2025",
      title: "Mbappé Shines as New Signings \n Impact European Football",
    },
    {
      date: "Jan 15, 2025",
      title: "Premier League 24/25: Title Race \n Heats Up with Contenders",
    },
  ];

  return (
    <footer className="w-11/12 md:w-10/12 mx-auto max-w-screen-2xl p-6 md:p-9">
      <div className="border-t border-gray-200 pt-8 flex justify-between gap-[20px] flex-wrap w-full">
        {/* Top Viewed News */}
        <div>
          <h3 className="text-[1.2rem] font-semibold text-[#424242] mb-2">
            Top Viewed News
          </h3>
          <div className="">
            <div className="relative border-l pl-2 border-gray-300 w-full">
              {topViewedNews?.map((news, index) => (
                <div key={index} className="mb-8">
                  <h1 className="font-semibold">● {news.date}</h1>
                  <h3 className="ml-4 hover:underline whitespace-pre-line">
                    {news.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Popular Tags */}
        <div className="w-full md:w-4/12">
          <h3 className="md:text-center text-[1.2rem] font-semibold text-[#424242] mb-2">
            Popular Tags
          </h3>
          <div className="flex flex-wrap text-black md:justify-center gap-[4px]">
            {tags.map((tag, idx) => {
              return (
                <Button key={idx} variant="outline">
                  {tag}
                </Button>
              );
            })}
          </div>
        </div>
        {/* Join Newsletter & Download App */}
        <div className="flex flex-col gap-6">
          {/* Join Newsletter */}
          <div>
            <h3 className="text-xl text-[#424242] font-bold mb-2">
              Join Our Newsletter
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Stay updated with the latest news and insights. <br /> Subscribe
              now!
            </p>
            <div className="relative">
              <input
                type="email"
                className="w-full py-2 px-4 rounded-md border border-gray-400 outline-none text-black placeholder:text-gray-500"
                placeholder="Enter your email"
              />
              <button className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black text-white py-1.5 px-4 rounded-md hover:bg-gray-800 transition duration-300">
                Subscribe
              </button>
            </div>
          </div>
          {/* Download Mobile App */}
          <div>
            <h3 className="text-xl text-[#424242] font-bold mb-2">
              Download Mobile App
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Get the latest news anytime, anywhere. Stay <br /> informed on the
              go!
            </p>
            <div className="mt-2 flex items-center gap-4">
              <Image
                src={
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1024px-Google_Play_Store_badge_EN.svg.png"
                }
                alt="Play Store"
                height={120}
                width={120}
                className="hover:scale-105 cursor-pointer"
              />
              <Image
                src={
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png"
                }
                alt="Play Store"
                height={120}
                width={120}
                className="hover:scale-105 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Footer End */}
      <div className="border-t border-gray-200 pt-[20px] mt-[40px] flex items-center justify-between w-full flex-wrap gap-[20px]">
        <Link href={"/"} className="hover:scale-105">
          <Image
            src={"./logo.svg"}
            alt="Taza Khobor"
            width={100}
            height={100}
          />
        </Link>
        <p className="text-[0.9rem] text-gray-600">
          © 2025 Taza Khobor. All Rights Reserved.{" "}
        </p>
        <div className="flex items-center gap-[10px] text-[#424242]">
          <a className="text-[1.3rem] p-1.5 cursor-pointer rounded-full hover:text-white hover:bg-[#000] transition-all duration-300">
            <CgFacebook />
          </a>
          <a className="text-[1.2rem] p-1.5 cursor-pointer rounded-full hover:text-white hover:bg-[#000] transition-all duration-300">
            <BsTwitter />
          </a>
          <a className="text-[1.2rem] p-1.5 cursor-pointer rounded-full hover:text-white hover:bg-[#000] transition-all duration-300">
            <BsInstagram />
          </a>
          <a className="text-[1.2rem] p-1.5 cursor-pointer rounded-full hover:text-white hover:bg-[#000] transition-all duration-300">
            <BsLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
