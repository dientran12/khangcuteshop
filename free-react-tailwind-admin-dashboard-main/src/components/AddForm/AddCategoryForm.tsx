import React, { useState } from 'react';
import { Category } from '../../types/category';

interface AddCategoryFormProps {
    onAdd: (category: Category) => void;
    onClose: () => void;
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({ onAdd, onClose }) => {
    const [newCategory, setNewCategory] = useState<Category>({
        name: '',
        fileImage: undefined,
    });

    const handleFilesToBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const [imagePreview, setImagePreview] = useState<string>();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.name === "image") {
            const file = e.target.files[0];
            setNewCategory(prev => ({ ...prev, fileImage: file }));

            // Tạo URL hình ảnh tạm thời để hiển thị
            const filePreview = URL.createObjectURL(file);
            setImagePreview(filePreview);
        } else {
            setNewCategory(prev => ({ ...prev, [e.target.name]: e.target.value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newCategory.fileImage) {
            const base64Image = await handleFilesToBase64(newCategory.fileImage);
            const productData: Category = {
                ...newCategory,
                image: base64Image
            };
            console.log("productData", productData);
            onAdd(productData);
        } else {
            console.log("No image to convert.");
            // Xử lý trường hợp không có ảnh nào được chọn
        }
    };

    return (
        <div className="fixed inset-0 z-1 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center ">
            <div className=" mt-[5vh] min-w-100 sm:min-w-132.5 rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Create New Category
                    </h3>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5.5 p-6.5 ">
                    <div>
                        <label className="mb-3 block text-black dark:text-white">Category Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={newCategory.name}
                            onChange={handleChange}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="mb-3 block text-black dark:text-white">Image:</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleChange}
                            accept="image/png, image/jpeg, image/gif"
                            className="w-full"
                        />
                        {imagePreview && <div className="flex space-x-2 mt-2">
                            <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-md" />
                        </div>}
                    </div>
                    <div className="flex justify-end ">
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Accept</button>
                        <button type="button" onClick={onClose} className="bg-slate-100 text-black px-3 ml-2 rounded border-[1.5px] border-stroke">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategoryForm;
