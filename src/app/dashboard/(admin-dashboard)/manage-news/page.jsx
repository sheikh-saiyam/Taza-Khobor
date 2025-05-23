"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import DashboardPageHeader from "../../components/Dashboards/Header/DashboardPageHeader";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import useFetchPublishers from "@/hooks/useFetchPublishers";
import { IoNewspaperSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import NewsDetailsDialog from "./NewsDetailsDialog";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";
import ManagePagePagination from "../../components/Dashboards/Pagination/ManagePagePagination";

// Fetch Function For Get News
export const fetchNews = async ({ queryKey }) => {
  const [_, { search, category, publisher, sortBy, sortOrder, page, limit }] =
    queryKey;
  const params = new URLSearchParams({
    search,
    category,
    publisher,
    sortBy,
    sortOrder,
    page,
    limit,
  }).toString();

  const res = await fetch(`/api/news?${params}`);
  const data = await res.json();
  return data;
};

const ManageNews = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [publisher, setPublisher] = useState("");
  const [sortBy, setSortBy] = useState("published_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Use TanStack Query to fetch news
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "news",
      { search, category, publisher, sortBy, sortOrder, page, limit },
    ],
    queryFn: fetchNews,
    refetchInterval: 3000,
    refetchOnWindowFocus: true,
  });

  // Get all publishers --->
  const [publishers] = useFetchPublishers();

  useEffect(() => {
    refetch();
  }, [search, category, publisher, sortBy, sortOrder, page, refetch]);

  if (isError)
    return <div className="w-full h-full bg-[#e5eaf2] animate-pulse rounded" />;

  // Function for delete news
  const deleteNews = async (id) => {
    // return console.log(id)
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the news item!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "No, cancel",
      background: "#ffffff",
      color: "#000000",
      confirmButtonColor: "#000000",
      cancelButtonColor: "#808080",
    });
    if (result.isConfirmed) {
      try {
        const { data } = await axios.delete(`/api/news/${String(id)}`);
        if (data.deletedCount) {
          refetch();
          router.refresh();
          Swal.fire({
            title: "Deleted!",
            text: "News has been deleted successfully.",
            icon: "success",
            background: "#ffffff",
            color: "#000000",
            confirmButtonColor: "#000000",
            confirmButtonText: "Great, ok!",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text:
            error.message || "Something went wrong while deleting the news.",
          icon: "error",
          background: "#ffffff",
          color: "#000000",
          confirmButtonColor: "#000000",
        });
      }
    }
  };

  return (
    <div className="w-full mx-auto">
      <DashboardPageHeader
        title="Manage News"
        subtitle="Easily view, edit, delete, and organize news articles for your platform."
        icon={IoNewspaperSharp}
      />

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search By News Title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded mb-3 focus:outline-none focus:border-gray-400 cursor-pointer focus:border-[1px]"
      />

      {/* Filters */}
      <div className="flex gap-4 items-center mb-5">
        {/* Category Filter */}
        <select
          value={category}
          className="py-2 px-3 border rounded focus:outline-none focus:border-gray-400 cursor-pointer focus:border-[1px]"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="features">Features</option>
          <option value="banner-news">Banner News</option>
          <option value="premier-league">Premier League</option>
          <option value="la-liga">La Liga</option>
          <option value="bundesliga">Bundesliga</option>
          <option value="serie-a">Serie A</option>
          <option value="ligue-1">Ligue 1</option>
          <option value="uefa-champions-league">UEFA Champions League</option>
          <option value="uefa-europa-league">UEFA Europa League</option>
          <option value="uefa-europa-conference-league">
            UEFA Europa Conference League
          </option>
          <option value="fifa-world-cup">FIFA World Cup</option>
          <option value="uefa-euros">UEFA Euros</option>
          <option value="copa-america">Copa America</option>
          <option value="youth-football">Youth Football</option>
          <option value="women-football">Women Football</option>
        </select>
        {/* Publisher Filter */}
        <select
          value={publisher}
          className="py-2 px-3 border rounded focus:outline-none focus:border-gray-400 cursor-pointer focus:border-[1px]"
          onChange={(e) => setPublisher(e.target.value)}
        >
          <option value="">All Publishers</option>
          {publishers?.map((publisher, idx) => (
            <option value={publisher?.publisher_name} key={idx}>
              {publisher?.publisher_name}
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
            setCategory("");
            setPublisher("");
            setSortBy("published_date");
            setSortOrder("desc");
            setPage(1);
          }}
        >
          Reset Filters
        </Button>
      </div>

      {/* News Table */}
      <div className={`overflow-x-auto ${isLoading ? "shadow-lg" : ""}`}>
        <table className="overflow-x-auto w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="px-4 py-2 border text-gray-700 w-fit">Title</th>
              <th className="px-4 py-2 border text-gray-700">Category</th>
              <th className="px-4 py-2 border text-gray-700">Publisher</th>
              <th className="px-4 py-2 border text-gray-700">Published Date</th>
              <th className="px-4 py-2 border text-gray-700">Views</th>
              <th className="px-4 py-2 border text-gray-700">Likes</th>
              <th className="px-4 py-2 border text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-2">
                    <div className="h-5 w-40 bg-[#e5eaf2] animate-pulse rounded"></div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-5 w-24 bg-[#e5eaf2] animate-pulse rounded"></div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-5 w-32 bg-[#e5eaf2] animate-pulse rounded"></div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-5 w-28 bg-[#e5eaf2] animate-pulse rounded"></div>
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
            ) : data.news.length > 0 ? (
              data.news.map((item) => (
                <tr key={item._id} className="border hover:bg-gray-50">
                  <td className="px-4 py-2 w-fit">
                    {item.title.length > 40
                      ? item.title.slice(0, 40) + "..."
                      : item.title}
                  </td>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2">{item.publisher}</td>
                  <td className="px-4 py-2">
                    {new Date(item.published_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{item.views}</td>
                  <td className="px-4 py-2">{item.likes}</td>
                  <td className="px-4 py-2 ">
                    <div className="flex items-center gap-4">
                      {/* News Details Dialog */}
                      <NewsDetailsDialog news={item} />
                      <button className="flex items-center gap-1 text-gray-700 bg-gray-100 border rounded cursor-pointer hover:bg-gray-300 duration-300 p-2">
                        <MdOutlineEdit size={20} />
                      </button>
                      <button
                        onClick={() => deleteNews(item._id)}
                        className="flex items-center gap-1 text-gray-700 bg-gray-100 border cursor-pointer hover:bg-gray-300 duration-300 p-2 rounded"
                      >
                        <MdDeleteOutline size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center px-4 py-2 text-gray-500">
                  No News Found!
                </td>
              </tr>
            )}
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

export default ManageNews;
