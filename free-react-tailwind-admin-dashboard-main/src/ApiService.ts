import apiClient from "./axios"

// apt product
export const getAllProduct = async ({ search = '', limit = 8, page = 1 }) => {
    try {
        const res = await apiClient.get(`/product/get/?page=${page}&limit=${limit}&search=${search}`);
        // console.log('data all product', res.data);
        return res.data;
    } catch (error) {
        console.error('Error fetching products', error);
        throw error;
    }
};

export const addNewProduct = async (productData: any) => {
    try {
        // Sử dụng fetch, axios, hoặc một thư viện HTTP khác để gửi yêu cầu POST đến server
        const response = await apiClient.post('/product/create', productData);
        return response.data; // Trả về dữ liệu sản phẩm mới hoặc một phản hồi phù hợp
    } catch (error) {
        console.error('Error adding new product', error);
        throw error;
    }
};

export const updateProduct = async (productId: number, productData: any) => {
    try {
        const { fileImages, ...updateData } = productData;
        // Sử dụng fetch, axios, hoặc một thư viện HTTP khác để gửi yêu cầu POST đến server
        const response = await apiClient.put(`/product/update/${productId}`, updateData);
        return response.data; // Trả về dữ liệu sản phẩm mới hoặc một phản hồi phù hợp
    } catch (error) {
        console.error('Error updating product', error);
        throw error;
    }
};

export const deleteProduct = async (productId: number) => {
    try {
        const res = await apiClient.delete(`/product/delete/${productId}`);
        console.log('Product deleted successfully');
        return res.data;
    } catch (error) {
        console.error('Error deleting product', error);
        throw error;
    }
};

// Api Product Version

export const addNewVersion = async (productId: number, versionData: any) => {
    try {
        const response = await apiClient.post(`/version/create?productId=${productId}`, versionData);
        return response.data; // Trả về dữ liệu phiên bản mới hoặc một phản hồi phù hợp
    } catch (error) {
        console.error('Error adding new version', error);
        throw error;
    }
}

export const updateVersion = async (versionId: number, versionData: any) => {
    try {
        const { fileImages, ...updateData } = versionData;
        const response = await apiClient.put(`/version/update/${versionId}`, updateData);
        return response.data; // Trả về dữ liệu phiên bản mới hoặc một phản hồi phù hợp
    } catch (error) {
        console.error('Error updating version', error);
        throw error;
    }
}

export const getVersionById = async (versionId: number) => {
    try {
        const res = await apiClient.get(`/version/get/${versionId}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching version', error);
        throw error;
    }
}

export const getAllVersionOfProduct = async (productId: number) => {
    try {
        const res = await apiClient.get(`/version/get-all-version-of-product?productId=${productId}`);
        console.log('res version', res.data)
        return res.data;
    } catch (error) {
        console.error('Error fetching versions', error);
        throw error;
    }
}

export const deleteVersion = async (versionId: number) => {
    try {
        const res = await apiClient.delete(`/version/delete/${versionId}`);
        console.log('Version deleted successfully');
        return res.data;
    } catch (error) {
        console.error('Error deleting version', error);
        throw error;
    }
}

// Api Size
export const addNewSize = async (sizeData: any) => {
    try {
        const response = await apiClient.post('/size/create', sizeData);
        return response.data; // Trả về dữ liệu size mới hoặc một phản hồi phù hợp
    } catch (error) {
        console.error('Error adding new size', error);
        throw error;
    }
}

export const updateSize = async (sizeId: number, sizeData: any) => {
    try {
        const response = await apiClient.put(`/size/update/${sizeId}`, sizeData);
        return response.data; // Trả về dữ liệu size mới hoặc một phản hồi phù hợp
    } catch (error) {
        console.error('Error updating size', error);
        throw error;
    }
}

export const getAllSizesOfVersion = async (versionId: number) => {
    try {
        const res = await apiClient.get('/size/get-all');
        return res.data;
    } catch (error) {
        console.error('Error fetching sizes', error);
        throw error;
    }
}

// Api category
export const deleteCategory = async (categoryName: string) => {
    try {
        const res = await apiClient.delete(`/category/delete/${categoryName}`);
        console.log('Category deleted successfully');
        return res.data;
    } catch (error) {
        console.error('Error deleting category', error);
        throw error;
    }
};

export const getAllCategory = async () => {
    try {
        const res = await apiClient.get('/category/get-all');
        return res.data;
    } catch (error) {
        console.error('Error fetching categories', error);
        throw error;
    }
};

export const getProductsByCategory = async (categoryName: string) => {
    try {
        const res = await apiClient.get(`/category/get-product-of-category?categoryName=${categoryName}`);
        console.log('data product by category', res.data);
        return res.data;
    } catch (error) {
        console.error('Error fetching products by category', error);
        throw error;
    }
};

export const addNewCategory = async (categoryData: any) => {
    const response = await apiClient.post('/category/create', categoryData);
    return response.data; // Trả về dữ liệu danh mục mới hoặc một phản hồi phù hợp
};
