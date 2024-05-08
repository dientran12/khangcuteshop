import React, { useState } from 'react';
import { Order } from '../../types/order';
import { formatCurrencyVND, formatDateTime, getStatusColor, showErrorToast, showSuccessToast } from '../../utils';
import OrderItem from '../Card/OrderItem';
import { IoClose } from "react-icons/io5";
import ConfirmationDialog from '../Dialogs/ConfirmationDialog';
import * as Api from '../../ApiService';
import Loading from '../Loading/Loading';
import { useLoading } from '../../hooks/LoadingContext';

interface OrderModalProps {
    onEdit: () => void;
    onClose: () => void;
    order: Order;
}

const OrderModal: React.FC<OrderModalProps> = ({ onEdit, onClose, order }) => {
    const [showDialog, setShowDialog] = useState(false);
    const [animation, setAnimation] = useState('animate-fadeIn');
    const { showLoading, hideLoading } = useLoading();

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setAnimation('animate-fadeOut');
            // Đặt timeout để chờ animation hoàn tất trước khi tắt modal
            setTimeout(() => {
                onClose();
            }, 500);
        }
    };

    const [nameComfirm, setNameComfirm] = useState<string>("");

    const handleConfirmation = async (name: string) => {
        showLoading();
        try {
            if (name === 'Mark as Completed') {
                const response = await Api.updateOrderStatus(order.id, "fulfilled");
            }
            if (name === 'Cancel Order') {
                const response = await Api.updateOrderStatus(order.id, "cancelled");
            }
            setShowDialog(false); // Đóng dialog sau khi hoàn tất
            setTimeout(() => {
                onEdit(); // Chỉ gọi onEdit nếu API thành công
                hideLoading();
                showSuccessToast('Order status updated successfully');
            }, 1000);
        } catch (error) {
            console.error('Error updating order status:', error);
            setShowDialog(false);
            setTimeout(() => {
                showErrorToast('Error updating order status');
                hideLoading();
            }, 500);

        }
    }

    return (
        <div className="fixed inset-0 z-1 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center "
            onClick={handleOverlayClick}
        >
            <Loading />
            {showDialog && <ConfirmationDialog nameComponent={nameComfirm} onConfirm={handleConfirmation} onCancel={() => setShowDialog(false)} />}
            <div className={`relative mt-[5vh] mx-4 min-w-100 sm:min-w-203 rounded-md border border-stroke  dark:border-strokedark  h-fit duration-300 ease-in-out ${animation} shadow-default  bg-white  dark:bg-boxdark`}>
                <h1 className="text-3xl px-4 md:px-6 text-center self-start flex xl:px-9 font-semibold text-black border-b-2  dark:text-white py-5">
                    Order id "<p className="inline text-red-500">{order.id}</p>" on {formatDateTime(order.createdAt).date} <p className="inline text-sm text-red-500">{formatDateTime(order.createdAt).time}</p>
                </h1>
                <div
                    className='absolute top-5 right-5  hover:ring-4 duration-150 hover:ring-offset-2 hover:ring-red-500  rounded-full cursor-pointer'
                    onClick={onClose}
                >
                    <IoClose size={30} />
                </div>
                <div className="grid grid-cols-1 gap-2 p-6.5 ">
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/2">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Total prices:<p className="inline ml-10 mr-2 text-3xl font-semibold text-red-500">{formatCurrencyVND(order.totalAmount)}</p> vnđ</label>
                        </div>
                        <div className="w-full sm:w-1/2">
                            <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                            >
                                Status: <p className={`inline ml-10 mr-2 text-3xl font-semibold  ${getStatusColor(order.status)} capitalize`}>{order.status}</p>
                            </label>
                        </div>
                    </div>
                    <div className="h-80 overflow-y-auto">
                        {order && order?.items?.length > 0 && order.items.map((item, index) => (
                            <OrderItem key={index} dataCartItem={item} />
                        ))}
                    </div>
                    <div className=" pt-2 border-t flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/2">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Pay method:<p className="inline ml-4 mr-2 text-xl font-semibold ">{order.paymentMethod}</p> </label>
                        </div>
                        <div className="w-full sm:w-1/2">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Phone Number:<p className="inline ml-4 mr-2 text-xl font-semibold ">{order.phoneNumber}</p> </label>
                        </div>
                    </div>
                    <div className=" pt-2  flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/2">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Shipping address:<p className="inline ml-4 mr-2 text-xl font-semibold ">{order.shippingAddress}</p> </label>
                        </div>
                        <div className="w-full sm:w-1/2">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Recipient's name:<p className="inline ml-4 mr-2 text-xl font-semibold ">{order.userName}</p> </label>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-end ml-auto gap-5  px-6.5 pb-6.5">
                    <button
                        type="button"
                        disabled={order.status === 'fulfilled' || order.status === 'cancelled'}
                        className={`${(order.status === 'fulfilled' || order.status === 'cancelled') ? 'bg-slate-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-400'
                            } border border-transparent rounded-md py-2 px-8 duration-200 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-green-600`}
                        onClick={() => {
                            setShowDialog(true)
                            setNameComfirm('Mark as Completed')
                        }}
                    >
                        Mark as Completed
                    </button>
                    <button
                        type="button"
                        disabled={order.status === 'fulfilled' || order.status === 'cancelled'}
                        className={`${(order.status === 'fulfilled' || order.status === 'cancelled') ? 'bg-slate-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-300'
                            } border border-transparent rounded-md py-2 px-8 duration-200 justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-red-500`}
                        onClick={() => {
                            setShowDialog(true)
                            setNameComfirm('Cancel Order')
                        }}
                    >
                        Cancel Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderModal;
