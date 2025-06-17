"use client";

import { useState, useMemo, useEffect } from 'react';
import user from "@publicImages/images/user.png"
import Image from 'next/image';
// import Link from "next/link"
import Link from 'next/link';
import { CirclePlus, CircleX, Smile, DoorOpen } from 'lucide-react';
import Progress from "@/ComponentsProgress"
import axios from 'axios'
import { useRouter } from 'next/navigation'

const DataTableAttendance = ({ userid }) => {

  const router = useRouter();

  // get username
  const username = localStorage.getItem("user");
  // Sample data
  const [data, setData] = useState([]);

  // hidden form
  const [open, setOpen] = useState(false);
  // loading
  const [isLoading, setIsLoading] = useState(true)

  // State for table functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Search functionality
  const filteredData = useMemo(() => {
    return data.filter(item =>
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sort functionality
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  useEffect(() => {
    if (!userid) return;

    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        const response = await axios.post(
          `http://localhost:1998/GMND/api/attendance/${userid}`,
          {}, // empty body (if you don't need to send anything in body)
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log(response.data.data);
        const dates = [];
        const attendance = response.data.data.attendance
        for (let i = 0; i < attendance.length; i++) {
          attendance[i].username = response.data.data.user[0].username
          dates.push(attendance[i].dateandtime)
        }
        setData(attendance)

        // console.log(dates);
        const currDate = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`

        const listSubmitDates = [];
        dates.map((list) => {
          const date = list.split("-")[0].trim()
          listSubmitDates.push(date)
        })

        const submitDates = listSubmitDates.find(date =>
          date === currDate.trim()
        );
        if (submitDates) {
          setOpen(!open)
        }

      } catch (err) {
        console.error("Error fetching attendance:", err);
      }
    };

    fetchData();
  }, [userid]);


  // Handle sort
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }

    return pageNumbers;
  };

  // Get sort icon
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return '↕️';
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // month
  const month = new Date().toLocaleString('default', { month: 'long' });
  // currDate
  const currDate = new Date().toLocaleString('default', {
    year: 'numeric', month
      : '2-digit', day: '2-digit'
  });
 async function handleEvent(type) {
    let action;
    if (type !== "present") {
      const reason = prompt("Reason ?");
      if (type === "absent") {
        action = {
          userid: userid,
          present: 0,
          absent: 1,
          weekend: 0,
          reason: reason.toUpperCase(),
          dateandtime: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()} - ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
          month: `${month} - ${new Date().getFullYear()}`
        }
        setIsLoading(false)
        setOpen(!open)
        setIsLoading(true)
        router.push(`/records/${userid}`);
        window.location.reload();

      } else if (type === "weekend") {
        action = {
          userid: userid,
          present: 0,
          absent: 0,
          weekend: 1,
          reason: reason.toUpperCase(),
          dateandtime: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()} - ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
          month: `${month} - ${new Date().getFullYear()}`
        }
        setIsLoading(false)
        setOpen(!open)
        setIsLoading(true)
        router.push(`/records/${userid}`);
        window.location.reload();

      }
    } else {
      action = {
        userid: userid,
        present: 1,
        absent: 0,
        weekend: 0,
        reason: "",
        dateandtime: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()} - ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
        month: `${month} - ${new Date().getFullYear()}`
      }
      setIsLoading(false)
      setOpen(!open)
      setIsLoading(true)
      router.push(`/records/${userid}`);
      window.location.reload();
    }

    await axios.post("http://localhost:1998/GMND/api/attendance/", action).then((res)=>{
      console.log(res.data)
    }).catch((err)=>{
      console.log(err)
      window.location.reload();
    })

  }
  return (
    <>
      <div className="w-56 mx-auto bg-sky-100 p-6 rounded-xl shadow-2xl shadow-sky-300" hidden={open}>
        <h3 className='text-center text-lime-400 font-bold text-xl'>Enter Attendance</h3>

        <div className="flex flex-col items-center justify-center gap-4 mt-4">
          <Image
            src={user}
            alt='user'
            width={50}
            height={50}
          />

          <p className="text-xl font-bold text-sky-800">{username}</p>

          <div className="flex gap-6">
            <button className='p-2 cursor-pointer hover:bg-lime-700 rounded-full bg-lime-500'><CirclePlus size={36} color="#ffffff" onClick={() => handleEvent("present")} /></button>
            <button className='p-2 cursor-pointer hover:bg-red-700 rounded-full bg-red-500'><CircleX size={36} color="#ffffff" onClick={() => handleEvent("absent")} /></button>
            <button className='p-2 cursor-pointer hover:bg-sky-700 rounded-full bg-sky-500'><Smile size={36} color="#ffffff" onClick={() => handleEvent("weekend")} /></button>
          </div>
        </div>

      </div>
      <div className="p-6 bg-sky-100 rounded-lg shadow-lg w-full h-lvh overflow-y-scroll" hidden={!open}>
        {/* table */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-6 text-sky-800">Daily Attendance {`- ${month}-${new Date().getFullYear()} - Date: ${currDate}`}</h2>
          <Link href="/" className='bg-sky-800 rounded-full p-3' onClick={() => setOpen(!open)}><DoorOpen size={28} color="#ffffff" /></Link>
        </div>
        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="search" className="text-sm font-medium text-sky-700">
              Search:
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="rowsPerPage" className="text-sm font-medium text-sky-700">
              Show:
            </label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="px-3 py-2 border border-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value={5}>5</option>
              <option value={25}>25</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-sky-700">entries</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-sky-700">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-sky-100 uppercase tracking-wider cursor-pointer hover:bg-gray-100 hover:text-sky-800"
                  onClick={() => handleSort('_id')}
                >
                  S.No {getSortIcon('_id')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-sky-100 uppercase tracking-wider cursor-pointer hover:bg-gray-100 hover:text-sky-800"
                  onClick={() => handleSort('username')}
                >
                  Name {getSortIcon('username')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-sky-100 uppercase tracking-wider cursor-pointer hover:bg-gray-100 hover:text-sky-800"
                  onClick={() => handleSort('month')}
                >
                  Month {getSortIcon('month')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-sky-100 uppercase tracking-wider cursor-pointer hover:bg-gray-100 hover:text-sky-800"
                  onClick={() => handleSort('present')}
                >
                  Present {getSortIcon('present')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-sky-100 uppercase tracking-wider cursor-pointer hover:bg-gray-100 hover:text-sky-800"
                  onClick={() => handleSort('absent')}
                >
                  Absent {getSortIcon('absent')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-sky-100 uppercase tracking-wider cursor-pointer hover:bg-gray-100 hover:text-sky-800"
                  onClick={() => handleSort('weekend')}
                >
                  Weekend {getSortIcon('weekend')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-sky-100 uppercase tracking-wider cursor-pointer hover:bg-gray-100 hover:text-sky-800"
                  onClick={() => handleSort('reason')}
                >
                  Reason {getSortIcon('reason')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-sky-100 uppercase tracking-wider cursor-pointer hover:bg-gray-100 hover:text-sky-800"
                  onClick={() => handleSort('dateandtime')}
                >
                  Date & Time {getSortIcon('dateandtime')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 [&>*:nth-child(odd)]:bg-sky-200 [&>*:nth-child(even)]:bg-sky-300">
              {currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <tr key={item._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.present}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.absent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.weekend}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.dateandtime}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
          <div className="text-sm text-sky-700">
            Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)} of {sortedData.length} entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === pageNumber
                  ? 'bg-sky-900 text-white border border-sky-100'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Progress progressHidden={isLoading} />
    </>
  );
};

export default DataTableAttendance;