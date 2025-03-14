import AdvertisementsCard from "@/components/cards/AdvertisementsCard";
import { TransferTitle } from "@/components/cards/TitleNews";
import MainContainer from "@/components/container/MainContainer";
import { Button } from "@/components/ui/button";
import dbConnect, { collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import Image from "next/image";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";

const TransferDetails = async ({ params }) => {
  const { _id } = await params;
  const transfersCollection = await dbConnect(collections.transfersCollection);
  // Get transfers news from db --->
  const transfers = await transfersCollection
    .find()
    .sort({ published_date: -1 })
    .limit(6)
    .toArray();
  // Get transfer_details --->
  const transfer_details = await transfersCollection.findOne({
    _id: new ObjectId(_id),
  });

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
                    src={transfer_details.source_image}
                    alt={transfer_details.source}
                    width={100}
                    height={100}
                    className="w-24 p-1 h-14 rounded border border-black"
                  />
                </div>
                <div>
                  <h1 className="font-bold text-[#444] tracking-wide">
                    {transfer_details.source}
                  </h1>
                  <h2 className="mt-[2px] text-sm font-medium tracking-wide text-[#444]">
                    {transfer_details.published_date.split("T")[0]}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Ads & Transfer Container */}
        <div className="w-full md:5/12 lg:w-3/12 h-fit">
          {/* Transfers */}
          <TransferTitle heading={"TRANSFERS NEWS"} item={transfers} />
          {/* Ads */}
          <AdvertisementsCard />
        </div>
      </div>
    </MainContainer>
  );
};

export default TransferDetails;
