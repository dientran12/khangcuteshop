import React, { useState } from 'react';
import { Version } from '../../types/version';

interface AddVersionFormProps {
    onAdd: (version: Version) => void;
    onClose: () => void;
}

const AddVerionForm: React.FC<AddVersionFormProps> = ({ onAdd, onClose }) => {
    const [newVersion, setNewVersion] = useState<Version>({
        id: -1,
        fileImages: [],
        sold: 0,
        stock: 0,
        images: [],
        style: "",
        productId: 0,
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

        if (target.type === 'file' && target.files && target.name === "images") {
            const filesArray = Array.from(target.files).slice(0, 5);
            setNewVersion(prev => ({ ...prev, fileImages: filesArray }));

            // Create temporary URLs to display image previews
            const filePreviews = filesArray.map(file => URL.createObjectURL(file));
            setImagePreviews(filePreviews);
        } else {
            setNewVersion(prev => ({ ...prev, [target.name]: target.value }));
        }
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newVersion.fileImages && newVersion.fileImages.length > 0) {
            const base64Images = await handleFilesToBase64(newVersion.fileImages);
            const verionData: Version = {
                ...newVersion,
                images: base64Images
            };
            console.log("verionData", verionData);
            onAdd(verionData);
        } else {
            console.log("No images to convert.");
            // Xử lý trường hợp không có ảnh nào được chọn
        }
    };

    return (
        <div className="fixed inset-0 z-1 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center animate-fadeIn ">
            <div className=" mt-[80px] min-w-100 sm:min-w-132.5 rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Add New Version
                    </h3>
                </div>
                <form onSubmit={handleSubmit} >
                    <div className="flex flex-col gap-5.5 p-6.5 overflow-y-auto max-h-[70vh]">
                        <div>
                            <label className="mb-3 block text-black dark:text-white">Style:</label>
                            <input
                                type="text"
                                name="style"
                                value={newVersion.style}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
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
                    </div>

                    <div className="flex justify-end mx-4 my-2">
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Accept</button>
                        <button type="button" onClick={onClose} className="bg-slate-100 text-black px-3 ml-2 rounded border-[1.5px] border-stroke">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVerionForm;
