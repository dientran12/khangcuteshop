import { FaEye, FaAngleRight, FaAngleLeft, FaTrash } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import { formatCurrencyVND, formatDateTime, getStatusColor, handleImageOnError, handleImageOnLoad } from "../../utils";
import { Order } from "../../types/order";

interface TableOrderProps {
    orderData: Order[];
    titleName: string;
    totalPages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

const TableOrder: React.FC<TableOrderProps> = ({ orderData, totalPages, currentPage, titleName, setCurrentPage }) => {

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const renderPagination = () => (
        <div className="flex justify-end">
            <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-2 rounded-md disabled:text-gray-500 bg-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed"
            >
                <FaAngleLeft />
            </button>
            <span className="mx-2 flex items-center">{currentPage} / <span className="text-red-500">{totalPages}</span></span>
            <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-2 rounded-md disabled:text-gray-500 bg-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed"
            >
                <FaAngleRight />
            </button>
        </div>
    );

    return (
        <div className="rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="py-6 px-4 md:px-6 xl:px-7.5">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    {titleName}
                </h4>
            </div>

            <div className="grid grid-cols-12 border-t border-stroke py-4.5 px-4 dark:border-strokedark  md:px-6 2xl:px-7.5">
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">OrderID</p>
                </div>
                <div className="col-span-4 sm:col-span-3 flex items-center">
                    <p className="font-medium">User Name</p>
                </div>
                <div className="col-span-3 sm:col-span-2 flex items-center">
                    <p className="font-medium">Status</p>
                </div>
                <div className="col-span-2 hidden md:flex items-center">
                    <p className="font-medium">Method</p>
                </div>
                <div className="col-span-2 flex items-center">
                    <p className="font-medium">totalAmount</p>
                </div>
                <div className="col-span-2 flex items-center">
                    <p className="font-medium">Time Order</p>
                </div>
            </div>

            {orderData.map((order, key) => (
                <div
                    className={`grid grid-cols-12 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-12 md:px-6 2xl:px-7.5 ${key % 2 === 0 ? "bg-slate-200 dark:bg-slate-600" : "bg-white dark:bg-boxdark"}`}
                    key={key}
                >
                    <div className="col-span-1 flex items-center">
                        <p className="text-sm text-blue-600 dark:text-white">
                            {order.id}
                        </p>
                    </div>
                    <div className="col-span-3 flex items-center">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div>
                                <img
                                    src={`${import.meta.env.VITE_API_URL}${order.userImage}`}
                                    alt="Product"
                                    className="h-15 w-15 md:h-20 md:w-20 object-cover rounded-full"
                                    onError={handleImageOnError}
                                    onLoad={handleImageOnLoad} // Thêm sự kiện onLoad nếu cần
                                />
                            </div>
                            <p className="text-sm hidden sm:text-xl font-semibold sm:block text-black dark:text-white">
                                {order.userName}
                            </p>
                        </div>
                    </div>
                    <div className="col-span-4 sm:col-span-2 flex items-center">
                        <p className={`text-lg ${getStatusColor(order.status)} `}>
                            {order.status}
                        </p>
                    </div>
                    <div className="hidden sm:flex col-span-2  items-center">
                        <p className="text-sm text-black dark:text-white">
                            {order.paymentMethod}
                        </p>
                    </div>
                    <div className="col-span-2 flex items-center">
                        <p className="text-sm text-red-500 font-medium ">
                            {formatCurrencyVND(order.totalAmount)} vnd
                        </p>
                    </div>
                    <div className="col-span-2 flex flex-col justify-center">
                        <p className="text-sm text-black font-medium dark:text-white">
                            {formatDateTime(order.createdAt).date}
                        </p>
                        <p className="text-sm text-red-500 font-medium">
                            {formatDateTime(order.createdAt).time}
                        </p>
                    </div>

                </div>
            ))}
            <div className="py-4 px-4 md:px-6 xl:px-7.5 flex justify-end">
                {renderPagination()}
            </div>
        </div>
    );
};

export default TableOrder;
