import Header from "@/components/Shared/Section/Header";
import dbConnect, { collections } from "@/lib/dbConnect";
import Image from "next/image";
import Link from "next/link";

const TransferNews = async () => {
  // Get transfers news from db --->
  const transfersCollection = await dbConnect(collections.transfersCollection);
  const transfers = await transfersCollection.find().toArray();

  return (
    <div>
      <Header heading={"Transfers News"} />
      {/* Transfers News Container */}
      <div className="flex flex-col gap-4">
        {transfers.map((news) => (
          <Link href={`/transfers/${news._id}`} key={news._id} prefetch={true}>
            <div className="flex flex-col lg:flex-row items-center gap-x-4 border-2 hover:border-black duration-300">
              {/* Image Container */}
              <div className="lg:w-6/12">
                <Image
                  src={news.image}
                  alt={news.title}
                  width={600}
                  height={200}
                  className="min-h-[240px] max-h-full w-full"
                />
              </div>
              {/* Text Container */}
              <div className="w-full p-4">
                <div>
                  <h3 className="text-lg font-medium text-[#444]">
                    {news.published_date}
                  </h3>
                  <h1 className="mt-2 text-2xl md:text-3xl font-medium tracking-wider">
                    {news.title}
                  </h1>
                </div>
                <div className="mt-3">
                  <Image
                    src={news.source_image}
                    alt={news.source}
                    width={600}
                    height={20}
                    className="rounded w-24 h-10"
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TransferNews;
