import React, { useEffect, useRef, useState } from 'react';
import { Product } from '../types/product';
import { handleImageOnError, handleImageOnLoad } from '../utils';
import imageEmpty from '../images/image-empty.jpg';
import MultiSelectCate from './Forms/MultiSelectCate';
import { useCategories } from '../hooks/CategoryContext';
import { IoCloseSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import * as Api from '../ApiService';
import { showErrorToast, showSuccessToast } from '../utils';
import Loading from './Loading/Loading';
import { useLoading } from '../hooks/LoadingContext';


interface EditProductFormProps {
    productId: number;
    initialProductData?: Product; // Bạn có thể truyền dữ liệu sản phẩm ban đầu nếu cần
    onSubmitEdit: () => void;
    onCancel: () => void;
}
const EditProductForm: React.FC<EditProductFormProps> = ({ productId, initialProductData, onSubmitEdit, onCancel }) => {
    // console.log('initialProductData', initialProductData)

    const [product, setProduct] = useState<Product>(initialProductData || {
        id: -1,
        name: '',
        price: 0,
        description: '',
        category: [],
        brand: '',
        sold: 0,
        stock: 0,
        images: [],
        fileImages: [],
        versions: []
    });

    const { categories } = useCategories();
    const [optionsDefault, setOptionsDefault] = useState<string[]>([]);
    const { showLoading, hideLoading } = useLoading();


    useEffect(() => {
        const newOptions = categories.map((category) => {
            return category.name;
        });
        setOptionsDefault(newOptions);
    }, [categories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProduct(prevProduct => ({
            ...prevProduct,
            [name]: name === 'price' || name === 'sold' || name === 'stock' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        showLoading(); // Set loading to true at the start of the operation

        try {
            let productData: any = product;
            if (product.fileImages && product.fileImages.length > 0) {
                const base64Images = await handleFilesToBase64(product.fileImages);
                productData = {
                    ...product,
                    imageNews: base64Images
                };
            }

            const change = getUpdatedFields(productData, initialProductData as Product);
            await Api.updateProduct(productId, change);
            showSuccessToast("Khang đẹp trai tài giỏi quá, dị cũng làm đúng!"); // Show success toast
            onSubmitEdit(); // Execute additional logic after successful edit
        } catch (error) {
            console.error("Error updating product:", error);
            showErrorToast("Failed to update product, please try again."); // Show error toast
        } finally {
            hideLoading(); // Set loading to false at the end of the operation
        }
    };


    const handleSelectionChange = (selected: string[]) => {
        setProduct(prevProduct => ({
            ...prevProduct,
            category: selected
        }));
    };

    const handleRemoveImage = (indexToRemove: number, isFileImage: boolean) => {
        setProduct(prevProduct => {
            if (isFileImage) {
                const fileImageURL = prevProduct.fileImages && URL.createObjectURL(prevProduct.fileImages[indexToRemove]);
                // Chỉ thu hồi URL nếu fileImageURL không phải là undefined
                if (fileImageURL) {
                    URL.revokeObjectURL(fileImageURL);
                }
                const newFileImages = prevProduct.fileImages && prevProduct.fileImages.filter((_, index) => index !== indexToRemove);
                return { ...prevProduct, fileImages: newFileImages };
            } else {
                const newImages = prevProduct.images && prevProduct.images.filter((_, index) => index !== indexToRemove);
                return { ...prevProduct, images: newImages };
            }
        });
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddImageClick = () => {
        // Mở file picker khi nút thêm ảnh được nhấn
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setProduct(prevProduct => ({
                ...prevProduct,
                fileImages: prevProduct.fileImages && [...prevProduct.fileImages, file] // Lưu trữ đối tượng File thay vì URL
            }));
        }
    };

    const handleFilesToBase64 = (files: File[]) => {
        return Promise.all(files.map(file => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
                reader.readAsDataURL(file);
            });
        }));
    };

    const getUpdatedFields = (newData: Product, originalData: Product): Partial<Product> => {
        const changes: Partial<Product> = {};
        Object.keys(newData).forEach(key => {
            const field = key as keyof Product;
            const newValue = newData[field];
            const oldValue = originalData[field];

            if (Array.isArray(newValue) && Array.isArray(oldValue)) {
                if (newValue.toString() !== oldValue.toString()) {
                    changes[field] = newValue as any;
                }
            } else if (newValue !== oldValue) {
                changes[field] = newValue as any;
            }
        });
        return changes;
    };

    useEffect(() => {
        if (initialProductData) {
            setProduct({ ...initialProductData, fileImages: [] });
        }
    }, [productId]);

    return (
        <div className="rounded-md  border shadow-default border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    Edit Product "<span className="text-red-600 dark:text-cyan-500">{product.name}</span>"
                </h4>
            </div>
            {product && <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5.5 p-6.5 sm:grid-cols-2">
                <div>
                    <div>
                        <label className="mb-3 block text-black dark:text-white">Product Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="mb-3 block text-black dark:text-white">Price:</label>
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="mb-3 block text-black dark:text-white">Brand:</label>
                        <input
                            type="text"
                            name="brand"
                            value={product.brand}
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
                            value={product.description}
                            onChange={handleChange}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        ></textarea>
                    </div>
                </div>
                <div className="flex flex-col justify-between ">
                    <div className=''>
                        <MultiSelectCate
                            id={`category ${productId}`}
                            optionsDefault={optionsDefault}
                            selectedDefault={initialProductData?.category || []}
                            onSelectionChange={handleSelectionChange}
                        />
                    </div>

                    <div className='flex justify-start gap-5.5 mt-1'>
                        {product?.images && product.images.map((image, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={`${import.meta.env.VITE_API_URL}${image}` || imageEmpty}
                                    alt="Product"
                                    className=" h-20 w-20 object-cover rounded-md"
                                    onError={handleImageOnError}
                                    onLoad={handleImageOnLoad}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index, false)}
                                    className="absolute -top-3 -right-4  text-black dark:text-white p-0 rounded-full"
                                    aria-label="Remove image"
                                >
                                    <IoCloseSharp size="24px" />
                                </button>
                            </div>
                        ))}
                        {product?.fileImages && product.fileImages.map((file, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={URL.createObjectURL(file) || imageEmpty}
                                    alt="Product"
                                    className=" h-20 w-20 object-cover rounded-md"
                                    onError={handleImageOnError}
                                    onLoad={handleImageOnLoad}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index, true)}
                                    className="absolute -top-3 -right-4  text-black dark:text-white p-0 rounded-full"
                                    aria-label="Remove image"
                                >
                                    <IoCloseSharp size="24px" />
                                </button>
                            </div>
                        ))}
                        {product?.images && product?.fileImages && product.images.length + product.fileImages.length < 5 && (
                            <div className=" h-20 w-20">
                                <button
                                    type="button"
                                    onClick={handleAddImageClick}
                                    className="h-20 w-20 rounded-md border shadow-default dark:border-stone-50 border-dashed  flex justify-center items-center"
                                    aria-label="Add image"
                                >
                                    <FaPlus size="18px" />
                                </button>
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/png, image/jpeg, image/gif"
                        style={{ display: 'none' }}
                    />
                    <div className="flex justify-end mt-auto">
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Accept</button>
                        <button type="button" onClick={onCancel} className="bg-slate-100 text-black px-3 ml-2 rounded border-[1.5px] border-stroke">Cancel</button>
                    </div>
                </div>

            </form>}
        </div>
    );
};

export default EditProductForm;
