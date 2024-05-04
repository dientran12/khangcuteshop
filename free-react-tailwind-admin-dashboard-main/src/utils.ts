// utils.ts

// Đường dẫn tới ảnh mặc định khi có lỗi
import imageEmpty from './images/image-empty.jpg';

// Hàm xử lý khi ảnh tải thành công nhưng có thể bị hỏng
export const handleImageOnLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const imgElement = event.currentTarget;
    if (!imgElement.naturalWidth || !imgElement.naturalHeight) {
        imgElement.src = imageEmpty;
    }
};

// Hàm xử lý khi ảnh không tải được
export const handleImageOnError = (event: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    event.currentTarget.src = imageEmpty;
};

import { toast } from 'react-toastify';

// Hàm hiển thị thông báo thành công
export const showSuccessToast = (message: string) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}

// Hàm hiển thị thông báo lỗi
export const showErrorToast = (message: string) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}

import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';
import { Locale } from 'date-fns';

// Sử dụng any để tạo một biến trung gian
const viAny: any = vi;

// Ép kiểu từ biến trung gian thành Locale
const viLocale: Locale = viAny;

export const formatCurrencyVND = (number: number) => {
    return number.toLocaleString('vi-VN');
};


export const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
        time: format(date, 'p', { locale: viLocale }),
        date: format(date, 'P', { locale: viLocale }),
        year: format(date, 'yyyy', { locale: viLocale })
    };
};


export const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'text-lime-500'; // Màu cam
        case 'paid':
            return 'text-blue-500'; // Màu xanh dương
        case 'fulfilled':
            return 'text-green-500'; // Màu xanh lá
        case 'cancelled':
            return 'text-red-500'; // Màu đỏ
        default:
            return 'text-gray-500'; // Một màu mặc định nếu không có trạng thái phù hợp
    }
}

