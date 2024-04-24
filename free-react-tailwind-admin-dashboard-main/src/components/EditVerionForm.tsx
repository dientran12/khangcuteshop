import React, { useEffect, useRef, useState } from 'react';
import _, { set } from 'lodash';
import { Product } from '../types/product';
import { handleImageOnError, handleImageOnLoad } from '../utils';
import imageEmpty from '../images/image-empty.jpg';
import MultiSelectCate from './Forms/MultiSelectCate';
import { useCategories } from '../hooks/CategoryContext';
import { IoCloseSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import * as Api from '../ApiService';
import { Size as SizeType, Version } from '../types/version';
import Size from './Size';
import Loading from './Loading/Loading';
import { useLoading } from '../hooks/LoadingContext';


interface EditVerionFormProps {
    versionId: number;
    initialVersionData?: Version; // Bạn có thể truyền dữ liệu sản phẩm ban đầu nếu cần
    onSubmitEdit: () => void;
    onCancel: () => void;
}
const EditVerionForm: React.FC<EditVerionFormProps> = ({ versionId, initialVersionData, onSubmitEdit, onCancel }) => {
    const { showLoading, hideLoading } = useLoading();
    const [version, setVersion] = useState<Version>(initialVersionData || {
        id: 0,
        productId: 0,
        style: '',
        sold: 0,
        stock: 0,
        sizes: [],
        images: [],
        fileImages: []
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setVersion(prevVersion => ({
            ...prevVersion,
            [name]: name === 'price' || name === 'sold' || name === 'stock' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        showLoading();
        let versionData: any = version;
        if (version.fileImages && version.fileImages.length > 0) {
            const base64Images = await handleFilesToBase64(version.fileImages);
            versionData = {
                ...version,
                imageNews: base64Images
            };
        } else {
            console.log("No images to convert.");
        }
        const changes = getUpdatedFields(versionData, initialVersionData as Version);
        const sizeChanges = getUpdatedSizes(versionData.sizes, initialVersionData?.sizes || []);
        console.log("change", changes);
        console.log("Size changes", sizeChanges);

        const updateData = {
            ...changes,
            sizes: sizeChanges
        };

        try {
            await Api.updateVersion(versionId, updateData);
            onSubmitEdit();
            hideLoading();  // Kết thúc loading khi hoàn tất
        } catch (error) {
            console.error("Error updating version:", error);
            hideLoading();  // Kết thúc loading nếu có lỗi
        }

    };

    const handleRemoveImage = (indexToRemove: number, isFileImage: boolean) => {
        setVersion(prevVersion => {
            if (isFileImage) {
                const fileImageURL = prevVersion.fileImages && URL.createObjectURL(prevVersion.fileImages[indexToRemove]);
                // Chỉ thu hồi URL nếu fileImageURL không phải là undefined
                if (fileImageURL) {
                    URL.revokeObjectURL(fileImageURL);
                }
                const newFileImages = prevVersion.fileImages && prevVersion.fileImages.filter((_, index) => index !== indexToRemove);
                return { ...prevVersion, fileImages: newFileImages };
            } else {
                const newImages = prevVersion.images && prevVersion.images.filter((_, index) => index !== indexToRemove);
                return { ...prevVersion, images: newImages };
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
            setVersion(prevVersion => ({
                ...prevVersion,
                fileImages: prevVersion.fileImages && [...prevVersion.fileImages, file] // Lưu trữ đối tượng File thay vì URL
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

    const getUpdatedFields = (newData: Version, originalData: Version): Partial<Version> => {
        const changes: Partial<Version> = {};
        Object.keys(newData).forEach(key => {
            const field = key as keyof Version;
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

    const getUpdatedSizes = (newSizes: SizeType[], originalSizes: SizeType[]) => {
        const changes = {
            added: [] as SizeType[],
            updated: [] as SizeType[],
            removed: [] as SizeType[]
        };

        // Tạo map từ sizes ban đầu để dễ dàng kiểm tra sự tồn tại
        const originalSizesMap = new Map(originalSizes.map(size => [size.size, size]));

        // Phát hiện thêm mới và cập nhật
        newSizes.forEach(size => {
            const originalSize = originalSizesMap.get(size.size);
            if (originalSize) {
                // Kiểm tra sự khác biệt để xác định cập nhật
                if (!_.isEqual(size, originalSize)) {
                    changes.updated.push(size);
                }
                originalSizesMap.delete(size.size);
            } else {
                changes.added.push(size);
            }
        });

        // Những size không còn trong mảng mới được coi là đã xóa
        originalSizesMap.forEach((value, key) => {
            changes.removed.push(value);
        });

        return changes;
    };


    const handleSizeChange = (newSizes: SizeType[]) => {
        setVersion(prevVersion => ({
            ...prevVersion,
            sizes: newSizes
        }));
    };

    useEffect(() => {
        if (initialVersionData) {
            setVersion({ ...initialVersionData, fileImages: [] });
        }
    }, [versionId]);

    return (
        <div
            className="rounded-md h-fit duration-300 ease-in-out border shadow-default border-stroke bg-white dark:border-strokedark dark:bg-boxdark col-span-12 xl:col-span-5"
        >

            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    Edit Version "<span className="text-red-600 dark:text-cyan-500">{version.style}</span>"
                </h4>
            </div>
            {version &&
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5.5 p-6.5 ">
                    <div className=" ">
                        <div className='grid grid-cols-1'>
                            <div>
                                <label className="mb-3 block text-black dark:text-white">Version style:</label>
                                <input
                                    type="text"
                                    name="style"
                                    value={version.style}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>
                        </div>
                        <div className='flex flex-col mt-1'>
                            <label className="mb-3 block text-black dark:text-white">Images:</label>
                            <div className='flex justify-start gap-5.5 '>
                                {version?.images && version.images.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}${image}` || imageEmpty}
                                            alt="Version"
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
                                {version?.fileImages && version.fileImages.map((file, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(file) || imageEmpty}
                                            alt="Version"
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
                                {version?.images && version?.fileImages && version.images.length + version.fileImages.length < 5 && (
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
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/png, image/jpeg, image/gif"
                            style={{ display: 'none' }}
                        />
                    </div>
                    <Size
                        versionId={versionId}
                        initialSizeData={initialVersionData?.sizes || []}
                        onSizeChange={handleSizeChange}
                    />
                    <div className="flex justify-end mt-auto">
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Accept</button>
                    </div>

                </form>}
        </div>
    );
};

export default EditVerionForm;
