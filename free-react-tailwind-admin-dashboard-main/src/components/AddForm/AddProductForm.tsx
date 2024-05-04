import React, { useState } from 'react';
import { Product } from '../../types/product';

interface AddProductFormProps {
    onAdd: (product: Product) => void;
    onClose: () => void;
}


const AddProductForm: React.FC<AddProductFormProps> = ({ onAdd, onClose }) => {
    const [newProduct, setNewProduct] = useState<Product>({
        id: -1,
        name: '',
        price: 0,
        fileImages: [],
        category: [],
        description: '',
        brand: '',
        sold: 0,
        stock: 0,
        images: [],
        versions: [],
    });

    const [errors, setErrors] = useState({
        name: '',
        price: ''
    });

    const handleFilesToBase64 = (files: File[]) => {
        return Promise.all(files.slice(0, 5).map(file => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
                reader.readAsDataURL(file);
            });
        }));
    };

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement; // Cast safely first
        const { name, value } = target;
        if (name === 'price') {
            const numericValue = parseFloat(value); // Chuyển đổi giá trị nhập vào thành số
            setErrors(prev => ({ ...prev, price: numericValue > 0 ? '' : 'Price must be greater than 0' }));
        } else if (name === 'name') {
            setErrors(prev => ({ ...prev, name: value.trim() ? '' : 'Name is required' }));
        }

        if (target.type === 'file' && target.files && target.name === "images") {
            const filesArray = Array.from(target.files).slice(0, 5);
            setNewProduct(prev => ({ ...prev, fileImages: filesArray }));

            // Create temporary URLs to display image previews
            const filePreviews = filesArray.map(file => URL.createObjectURL(file));
            setImagePreviews(filePreviews);
        } else {
            setNewProduct(prev => ({ ...prev, [target.name]: target.value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Kiểm tra các trường bắt buộc
        if (!newProduct.name.trim()) {
            setErrors(prev => ({ ...prev, name: "Name is required" }));
            return;
        }

        if (newProduct.price <= 0 || !newProduct.price) {
            setErrors(prev => ({ ...prev, price: "Price must be greater than 0" }));
            return;
        }

        // Tiếp tục với xử lý nếu tất cả các trường đều hợp lệ
        try {
            if (newProduct.fileImages && newProduct.fileImages.length > 0) {
                const base64Images = await handleFilesToBase64(newProduct.fileImages);
                const productData: Product = {
                    ...newProduct,
                    images: base64Images
                };
                onAdd(productData);
            } else {
                onAdd(newProduct); // Xử lý khi không có ảnh
            }

        } catch (error) {
            console.error("Error submitting product:", error);
        }
    };


    return (
        <div className="fixed inset-0 z-1 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center animate-fadeIn ">
            <div className=" mt-[80px] min-w-100 sm:min-w-132.5 rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Create New Product
                    </h3>
                </div>
                <form onSubmit={handleSubmit} >
                    <div className="flex flex-col gap-5.5 p-6.5 overflow-y-auto max-h-[70vh]">
                        <div>
                            <label className="mb-3 block text-black dark:text-white">Project Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={newProduct.name}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.name && <p className="text-red-500">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">Price:</label>
                            <input
                                type="number"
                                name="price"
                                value={newProduct.price}
                                min="0"
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.price && <p className="text-red-500">{errors.price}</p>}

                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">Images:</label>
                            <input
                                type="file"
                                name="images"
                                onChange={handleChange}
                                accept="image/png, image/jpeg, image/gif"
                                multiple
                                className="w-full"
                            />
                            <div className="flex space-x-2 mt-2">
                                {imagePreviews.map((src, index) => (
                                    <img key={index} src={src} alt="Preview" className="h-20 w-20 object-cover rounded-md" />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">Brand:</label>
                            <input
                                type="text"
                                name="brand"
                                value={newProduct.brand}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Description:
                            </label>
                            <textarea
                                name="description"
                                value={newProduct.description}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex justify-end mx-4 my-2">
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create</button>
                        <button type="button" onClick={onClose} className="bg-slate-100 text-black px-3 ml-2 rounded border-[1.5px] border-stroke">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductForm;
