"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { fetchTransfers } from "@/app/dashboard/(admin-dashboard)/manage-transfer-news/page";
import { IoCheckmark } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Tags } from "@/lib/tags";
import Swal from "sweetalert2";
import axios from "axios";

const AddTransferNewsForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [publisher, setPublisher] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Select Source");
  const [selectedSource, setSelectedSource] = useState({});

  // Outside click to off the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      let target = event.target;

      if (!target.closest(".dropdown")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get all source data -->
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/publishers`)
      .then((res) => res.json())
      .then((data) => setPublisher(data));
  }, []);

  const filteredItems = Tags.filter((item) =>
    item.toLowerCase().includes((searchValue || "").toLowerCase())
  );

  const isSelected = (item) => selectedTags.includes(item);

  const toggleSelectItem = (item) => {
    if (isSelected(item)) {
      setSelectedTags(
        selectedTags.filter((selectedItem) => selectedItem !== item)
      );
    } else {
      setSelectedTags([...selectedTags, item]);
    }
  };

  const removeItem = (option) => {
    setSelectedTags(
      selectedTags.filter((selectedItem) => selectedItem !== option)
    );
  };

  useEffect(() => {
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".custom-select")) {
        setIsOpenDropdown(false);
      }
    });
  }, [isOpenDropdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const title = form.title.value;
    const image = form.image.value;
    const description = form.description.value;
    const source = selectedSource.publisher_name;
    const source_image = selectedSource.publisher_image;
    const published_date = new Date();

    // Form Validation -->
    if (!source || !source_image) {
      setLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Source Is Required!",
      });
    }
    if (selectedTags.length === 0) {
      setLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Tags Are Required!",
      });
    }
    if (selectedTags.length < 5) {
      setLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Tags Must Be Atleast 5",
      });
    }

    const transfer_news = {
      title,
      image,
      description,
      source,
      source_image,
      published_date,
      tags: selectedTags,
      views: 0,
      likes: 0,
    };

    // Post data in db --->
    try {
      const { data } = await axios.post(
        `/api/add-transfer-news`,
        transfer_news
      );
      // Show Unauthorized or 500 status --->
      if (data?.status === 403 || data?.status === 500) {
        Swal.fire({
          icon: "error",
          title: `${data?.status} ${data?.error}`,
          text: data?.message,
          confirmButtonColor: "#d33",
          confirmButtonText: "Ok, Understood!",
        });
      }
      // Show confirmation toast --->
      if (data.data?.insertedId) {
        form.reset();
        router.refresh();
        fetchTransfers();
        router.push("/dashboard/manage-transfer-news");
        Swal.fire({
          icon: "success",
          title: data.message,
          confirmButtonColor: "#000",
          confirmButtonText: "Ok, Great!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong!",
        confirmButtonColor: "#d33",
        confirmButtonText: "Try Again!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-2 p-6 rounded space-y-4">
      {/* News Title */}
      <div className="w-full">
        <label
          htmlFor="title"
          className="flex items-center gap-2 text-[18px] text-text text-gray-700 font-[600]"
        >
          Transfer News Title
        </label>
        <input
          type="text"
          name="title"
          required
          placeholder="Enter News Title"
          className="border-border border rounded-md outline-none px-4 w-full mt-1 py-3 focus:border-[#a6a6a6] transition-colors duration-300"
        />
      </div>
      {/* News Image URL */}
      <div className="w-full">
        <label
          htmlFor="image"
          className="flex items-center gap-2 text-[18px] text-text text-gray-700 font-[600]"
        >
          Transfer News Image
        </label>
        <input
          type="text"
          name="image"
          required
          placeholder="Enter Image URL"
          className="border-border border rounded-md outline-none px-4 w-full mt-1 py-3 focus:border-[#a6a6a6] transition-colors duration-300"
        />
      </div>
      {/* News Description */}
      <div className="w-full">
        <label
          htmlFor="description"
          className="flex items-center gap-2 text-[18px] text-text text-gray-700 font-[600]"
        >
          Transfer News Description
        </label>
        <textarea
          id="description"
          required
          placeholder="Enter News Description"
          className="border-border border rounded-md outline-none mt-1 px-4 w-full py-3 min-h-[200px] focus:border-[#a6a6a6] transition-colors duration-300"
        />
      </div>
      {/* Select Source */}
      <div className="w-full">
        <div className="w-full">
          <label
            htmlFor="source"
            className="flex items-center gap-2 text-[18px] text-text text-gray-700 font-[600]"
          >
            Select Source
          </label>
          <button
            type="button"
            className="bg-[#fff] border border-[#d1d1d1] rounded w-full justify-between px-3 py-2 flex items-center gap-8  relative cursor-pointer dropdown mt-1"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedItem}
            <IoChevronDown
              className={`${
                isDropdownOpen ? "rotate-[180deg]" : " rotate-0"
              } transition-all duration-300 text-[1.2rem]`}
            />
            <div
              className={`${
                isDropdownOpen
                  ? "z-[1] opacity-100 scale-[1]"
                  : "z-[-1] opacity-0 scale-[0.8]"
              } w-full absolute bottom-12 left-0 right-0 z-40 bg-[#fff] rounded-md flex flex-wrap justify-center gap-4 overflow-hidden transition-all duration-300 ease-in-out`}
              style={{
                boxShadow: "0 15px 60px -15px rgba(0, 0, 0, 0.3)",
              }}
            >
              {publisher?.map((option, index) => (
                <div
                  className="py-2 px-4 hover:bg-[#ececec] transition-all duration-200 flex items-center gap-2"
                  key={index}
                  onClick={() => {
                    setSelectedItem(option.publisher_name);
                    setSelectedSource({
                      publisher_name: option.publisher_name,
                      publisher_image: option.image,
                    });
                  }}
                >
                  <Image
                    src={option.image}
                    alt={option.publisher_name}
                    width={1000}
                    height={100}
                    className="w-28 h-12 rounded"
                  />
                </div>
              ))}
            </div>
          </button>
        </div>
      </div>
      {/* Select Tags */}
      <div className="mb-4 flex flex-col gap-1">
        <label
          htmlFor="tags"
          className="flex items-center gap-2 text-[18px] text-text text-gray-700 font-[600]"
        >
          Select Tags
        </label>
        <div className="relative custom-select w-[100%]">
          {/* Input field with search functionality */}
          <input
            type="text"
            placeholder="Search Tags..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsOpenDropdown(true)}
            className={`w-full border border-[#d1d1d1] rounded-md px-3 py-2 focus:outline-none`}
          />

          <IoIosArrowDown
            className={`${
              isOpenDropdown ? "rotate-[180deg]" : "rotate-0"
            } transition-all duration-300 text-[1.3rem] absolute top-[10px] right-3 text-gray-500`}
          />

          {/* Dropdown menu */}
          {isOpenDropdown && (
            <div className="w-full mt-1 border border-gray-200 rounded-md bg-white shadow-lg z-20">
              <div className="w-full overflow-auto flex gap-4 items-center flex-wrap">
                {filteredItems.map((item, index) => (
                  <p
                    key={index}
                    onClick={() => toggleSelectItem(item)}
                    className="cursor-pointer px-3 py-2 flex items-center hover:bg-gray-200"
                  >
                    <IoCheckmark
                      className={`${
                        isSelected(item)
                          ? "scale-[1] opacity-100 bg-gray-200 rounded"
                          : "scale-[0.5] opacity-0"
                      } mr-2 transition-all text-[1.3rem] duration-300`}
                    />
                    {item}
                  </p>
                ))}

                {filteredItems?.length === 0 && (
                  <p className="text-center text-[0.9rem] text-[#424242] py-8">
                    No search found!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Selected items */}
          <div className="flex items-center gap-[5px] flex-wrap">
            {selectedTags?.map((item, index) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 text-sm rounded-full flex items-center mt-2"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeItem(item)}
                  className="ml-2 text-blue-800 text-[1.2rem]"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Submit Button */}
      <div className="w-full mt-2 mx-auto flex justify-center">
        <button disabled={loading} type="submit" className="w-full mt-2">
          <Button
            disabled={loading}
            className="w-2/3 mx-auto font-semibold text-[16px] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                <span className="mt-[2.5px]">Posting...</span>
              </>
            ) : (
              "Post Transfer News"
            )}
          </Button>
        </button>
      </div>
    </form>
  );
};

export default AddTransferNewsForm;
