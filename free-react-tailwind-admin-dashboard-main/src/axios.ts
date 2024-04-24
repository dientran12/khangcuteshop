import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
    // Các cấu hình khác nếu cần
});

// Thêm response interceptor
apiClient.interceptors.response.use(
    response => {
        // Kiểm tra nếu response.data là đối tượng và có trường 'data'
        if (response.data && response.data.data) {
            return response.data;
        }
        // Trả về response không thay đổi nếu không tìm thấy trường 'data'
        return response;
    },
    error => {
        // Có thể xử lý lỗi hoặc chuyển tiếp lỗi
        return Promise.reject(error);
    }
);

export default apiClient;
