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