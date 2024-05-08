import React, { useEffect, useRef, useState } from 'react';
import * as Api from '../ApiService';
import DefaultLayout from '../layout/DefaultLayout';
import { useLoading } from '../hooks/LoadingContext';
import TableOrder from '../components/Tables/TableOrder';
import { Order } from '../types/order';

interface ApiResponse {
    orders: Order[];
    totalPage: number;
    currentPage: number;
}

const OrderManagement: React.FC = () => {
    const [responseData, setResponseData] = useState<ApiResponse | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { showLoading, hideLoading } = useLoading();

    // Delete product

    const fetchOrders = async () => {
        try {
            const itemsPerPage = 4;
            showLoading();
            const data = await Api.getAllOrders(currentPage, itemsPerPage);
            console.log("hhahaha data at fetch order", data)
            hideLoading()
            setResponseData(data);
        } catch (err) {
            hideLoading()
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [currentPage]); // Thêm currentPage vào mảng phụ thuộc

    return (
        <DefaultLayout>
            <div className="col-span-12 xl:col-span-8">
                {responseData && (
                    <TableOrder
                        fetchData={fetchOrders}
                        titleName="All Users"
                        orderData={responseData.orders}
                        totalPages={responseData.totalPage}
                        currentPage={currentPage}
                        setCurrentPage={(page: number) => {
                            setCurrentPage(page);
                        }}
                    />
                )}
            </div>
        </DefaultLayout>
    );
};

export default OrderManagement;
