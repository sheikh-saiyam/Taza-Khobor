import AdvertisementsCard from "@/components/cards/AdvertisementsCard";
import MainContainer from "@/components/container/MainContainer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";

const TransferDetails = async ({ params }) => {
  // Get Ranking_Details --->
  const { _id } = await params;
  const response = await fetch(`http://localhost:3000/api/transfers/${_id}`);
  const transfer_details = await response.json();

  // Get Latest News --->
  const transfers_response = await fetch("http://localhost:3000/api/transfers");
  const transfers = await transfers_response.json();

  return (
    <MainContainer>
      <div className="flex flex-col md:flex-row gap-6">
        {/* News Details Container */}
        <div className="w-full md:7/12 lg:w-9/12">
          <div>
            <Image
              src={transfer_details.image}
              alt={transfer_details.title}
              width={1000}
              height={400}
              className="max-h-[400px] w-full"
            />
          </div>
          <div className="mt-6">
            {/* Title & Description */}
            <h1 className="text-black tracking-wider text-2xl md:text-3xl lg:text-4xl font-semibold">
              {transfer_details.title}
            </h1>
            <h3 className="mt-4 text-[#444] tracking-wider text-xl whitespace-pre-line">
              {transfer_details.description}
            </h3>
            {/* Tags */}
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <h3 className="text-[#444] tracking-wider font-semibold text-xl">
                Tags:
              </h3>
              {transfer_details.tags.map((tag, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="text-[#444] tracking-wider font-semibold"
                >
                  #{tag}
                </Button>
              ))}
            </div>
            {/* Publisher Info And Like & Dislike */}
            <div className="mt-4">
              {/* Like & Dislike */}
              <div className="mb-4 pb-4 border-b flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <button>
                    <AiOutlineLike
                      className="text-[#000]"
                      size={35}
                      color="#444"
                    />
                  </button>
                  <h1 className="font-bold text-[#444] tracking-wide mt-1">
                    {transfer_details.likes}
                  </h1>
                </div>
                <div className="flex items-center gap-3">
                  <button>
                    <AiOutlineDislike
                      className="text-[#000]"
                      size={35}
                      color="#444"
                    />
                  </button>
                  <h1 className="font-bold text-[#444] tracking-wide mt-1">
                    28
                  </h1>
                </div>
              </div>
              {/* Publisher Info */}
              <div className="mt-4 flex items-center gap-2">
                <div>
                  <Image
                    src={transfer_details.publisher_image}
                    alt={transfer_details.publisher}
                    width={100}
                    height={100}
                    className="w-24 p-1 h-14 rounded border border-black"
                  />
                </div>
                <div>
                  <h1 className="font-bold text-[#444] tracking-wide">
                    {transfer_details.publisher}
                  </h1>
                  <h2 className="mt-[2px] text-sm font-medium tracking-wide text-[#444]">
                    {transfer_details.published_date.split("T")[0]}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Ads & Latest News Container */}
        <div className="w-full md:5/12 lg:w-3/12 h-fit">
          {/* Latest News */}
          <div className="border rounded px-4">
            <h1 className="text-black tracking-wider text-2xl mt-3 font-bold">
              TRANSFERS
            </h1>
            <div className="relative mt-3 w-full">
              {transfers?.map((news, index) => (
                <div key={index} className="pb-3 mb-4 border-b">
                  <Link
                    href={`/transfers/${news._id}`}
                    className="whitespace-pre-line hover:underline duration-300 cursor-pointer underline-offset-2"
                  >
                    {news.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          {/* Ads */}
          <AdvertisementsCard />
        </div>
      </div>
    </MainContainer>
  );
};

export default TransferDetails;
