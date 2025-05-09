"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import DashboardPageHeader from "../../components/Dashboards/Header/DashboardPageHeader";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import useFetchPublishers from "@/hooks/useFetchPublishers";
import RankingDetailsDialog from "./RankingDetailsDialog";
import { IoNewspaperSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { PiRankingFill } from "react-icons/pi";
import Swal from "sweetalert2";
import axios from "axios";
import ManagePagePagination from "../../components/Dashboards/Pagination/ManagePagePagination";

// Fetch Function For Get Rankings
export const fetchRankings = async ({ queryKey }) => {
  const [_, { search, publisher, sortBy, sortOrder, page, limit }] = queryKey;
  const params = new URLSearchParams({
    search,
    publisher,
    sortBy,
    sortOrder,
    page,
    limit,
  }).toString();

  const { data } = await axios(`/api/manage-rankings?${params}`);
  return data;
};

const ManagePowerRankings = () => {
  const [search, setSearch] = useState("");
  const [publisher, setPublisher] = useState("");
  const [sortBy, setSortBy] = useState("published_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const limit = 5;

  // Use TanStack Query to fetch rankings
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "rankings",
      { search, publisher, sortBy, sortOrder, page, limit },
    ],
    queryFn: fetchRankings,
    refetchInterval: 3000,
    refetchOnWindowFocus: true,
  });

  // Get all publishers --->
  const [publishers] = useFetchPublishers();

  useEffect(() => {
    refetch();
  }, [search, publisher, sortBy, sortOrder, page, refetch]);

  if (isError)
    return <div className="w-full h-full bg-[#e5eaf2] animate-pulse rounded" />;

  return (
    <div className="w-full mx-auto">
      <DashboardPageHeader
        title="Manage Power Rankings"
        subtitle="Easily view, edit, delete, and organize Power Rankings articles for your platform."
        icon={PiRankingFill}
      />

      {/* Filters */}
      <div className="flex flex-wrap lg:flex-nowrap gap-4 items-center mb-5">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search By News Title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-[6px] px-2 border rounded focus:outline-none focus:border-gray-400 cursor-pointer focus:border-[1px]"
        />

        {/* Source Filter */}
        <select
          value={publisher}
          className="py-2 px-3 border rounded focus:outline-none focus:border-gray-400 cursor-pointer focus:border-[1px]"
          onChange={(e) => setPublisher(e.target.value)}
        >
          <option value="">All Publishers</option>
          {publishers?.map((item, idx) => (
            <option value={item?.publisher_name} key={idx}>
              {item?.publisher_name}
            </option>
          ))}
        </select>
        {/* Sort by */}
        <select
          className="py-2 px-3 border rounded focus:outline-none focus:border-gray-400 cursor-pointer focus:border-[1px]"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="published_date">Sort by Date</option>
          <option value="views">Sort by Views</option>
          <option value="likes">Sort by Likes</option>
        </select>
        {/* Sort order */}
        <select
          className="py-2 px-3 border rounded focus:outline-none focus:border-gray-400 cursor-pointer focus:border-[1px]"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
        {/* Reset Button */}
        <Button
          onClick={() => {
            setSearch("");
            setPublisher("");
            setSortBy("published_date");
            setSortOrder("desc");
            setPage(1);
          }}
        >
          Reset Filters
        </Button>
      </div>

      {/* Rankings Table */}
      <div className={`overflow-x-auto ${isLoading ? "shadow-lg" : ""}`}>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="px-4 py-2 border text-gray-700">Title</th>
              <th className="px-4 py-2 border text-gray-700">Rankings</th>
              <th className="px-4 py-2 border text-gray-700">Publisher</th>
              <th className="px-4 py-2 border text-gray-700">Published Date</th>
              <th className="px-4 py-2 border text-gray-700">Views</th>
              <th className="px-4 py-2 border text-gray-700">Likes</th>
              <th className="px-4 py-2 border text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">
                      <div className="h-5 w-64 bg-[#e5eaf2] animate-pulse rounded"></div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="h-5 w-16 bg-[#e5eaf2] animate-pulse rounded"></div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="h-5 w-16 bg-[#e5eaf2] animate-pulse rounded"></div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="h-5 w-16 bg-[#e5eaf2] animate-pulse rounded"></div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="h-5 w-16 bg-[#e5eaf2] animate-pulse rounded"></div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="h-5 w-16 bg-[#e5eaf2] animate-pulse rounded"></div>
                    </td>
                    <td className="px-4 py-2 flex items-center gap-4">
                      <div className="h-10 w-10 bg-[#e5eaf2] animate-pulse rounded"></div>
                      <div className="h-10 w-10 bg-[#e5eaf2] animate-pulse rounded"></div>
                      <div className="h-10 w-10 bg-[#e5eaf2] animate-pulse rounded"></div>
                    </td>
                  </tr>
                ))
              : data?.rankings?.map((item) => (
                  <tr key={item._id} className="border hover:bg-gray-50">
                    <td className="px-4 py-2 w-fit">
                      {item.title.length > 60
                        ? item.title.slice(0, 60) + "..."
                        : item.title}
                    </td>
                    <td className="px-4 py-2">
                      {item.rankings.length} <sub>(Total)</sub>
                    </td>
                    <td className="px-4 py-2">{item.publisher}</td>
                    <td className="px-4 py-2">
                      {new Date(item.published_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{item.views}</td>
                    <td className="px-4 py-2">{item.likes}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-4">
                        {/* RankingDetailsDialog */}
                        <RankingDetailsDialog ranking={item} />
                        <button className="flex items-center gap-1 text-gray-700 bg-gray-100 border rounded cursor-pointer hover:bg-gray-300 duration-300 p-2">
                          <MdOutlineEdit size={20} />
                        </button>
                        <button
                          // onClick={() => deleteNews(item._id)}
                          className="flex items-center gap-1 text-gray-700 bg-gray-100 border cursor-pointer hover:bg-gray-300 duration-300 p-2 rounded"
                        >
                          <MdDeleteOutline size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <ManagePagePagination
        isLoading={isLoading}
        data={data}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

export default ManagePowerRankings;
