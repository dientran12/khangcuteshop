import React, { useEffect, useRef, useState } from "react";
import { BsFillPencilFill } from "react-icons/bs";
import { PiBroomFill } from "react-icons/pi"; // Lưu ý: Kiểm tra lại xem bạn có icon PiBroomFill hay không, có thể bạn cần dùng GiBroom.
import * as Api from '../ApiService';
import { Size as SizeType } from "../types/version";
import SelectSize from "./Forms/SelectSize";
import { FaPlus } from "react-icons/fa6";

interface SizeProps {
    name: string;
    bgColor: string;
}

const projects: SizeProps[] = [
    { name: 'S', bgColor: 'bg-orange-500' },
    { name: 'M', bgColor: 'bg-pink-600' },
    { name: 'L', bgColor: 'bg-purple-600' },
    { name: 'XL', bgColor: 'bg-yellow-500' },
    { name: '2XL', bgColor: 'bg-green-500' },
];

interface SizeFormProps {
    versionId: number;
    initialSizeData: SizeType[];
    onSizeChange: (sizeData: SizeType[]) => void;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const SizeComponent: React.FC<SizeFormProps> = ({ versionId, initialSizeData, onSizeChange }) => {
    const [versionSizes, setVersionSizes] = useState<SizeType[]>(initialSizeData);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [quantity, setQuantity] = useState(0);

    const orderedSizeNames = projects.map(project => project.name); // Tạo mảng chứa tên theo thứ tự mong muốn
    const sortedVersionSizes = versionSizes.sort((a, b) => {
        return orderedSizeNames.indexOf(a.size) - orderedSizeNames.indexOf(b.size);
    });
    const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    useEffect(() => {
        setVersionSizes(initialSizeData);
    }, [versionId, initialSizeData]);

    useEffect(() => {
        onSizeChange(versionSizes);
    }, [versionSizes]);

    const handleQuantityChange = (size: string, newQuantity: number) => {
        setVersionSizes(prevSizes =>
            prevSizes.map(item =>
                item.size === size ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const handleEditClick = (size: string) => {
        // Đảm bảo ref tồn tại và là một element DOM trước khi gọi focus
        const ref = inputRefs.current[size];
        if (ref && ref.focus) {
            ref.focus();
        }
    };

    const handleResetQuantity = (size: string) => {
        setVersionSizes(prevSizes =>
            prevSizes.map(item =>
                item.size === size ? { ...item, quantity: 0 } : item
            )
        );
    };

    const handleOnClickAddSize = () => {
        if (!selectedSize || quantity <= 0) {
            alert("Please select a size and enter a valid quantity.");
            return;
        }

        const newSizeEntry = {
            size: selectedSize,
            quantity: quantity,
        };

        setVersionSizes(prevSizes => {
            // Kiểm tra xem kích thước đã tồn tại trong mảng hay chưa
            const existingSizeIndex = prevSizes.findIndex(size => size.size === selectedSize);
            if (existingSizeIndex >= 0) {
                // Cập nhật số lượng cho kích thước hiện tại
                const newSizes = [...prevSizes];
                newSizes[existingSizeIndex] = {
                    ...newSizes[existingSizeIndex],
                    quantity: newSizes[existingSizeIndex].quantity + quantity
                };
                return newSizes;
            } else {
                // Thêm kích thước mới vào mảng
                return [...prevSizes, newSizeEntry];
            }
        });

        // Reset giá trị đã nhập
        setQuantity(0);
    };

    return (
        <div>
            <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">Pinned Projects</h2>
            <ul role="list" className="mt-3 grid grid-cols-1 gap-5">
                {sortedVersionSizes.map((sizeData) => {
                    const project = projects.find(p => p.name.toUpperCase() === sizeData.size.toUpperCase()) || { bgColor: 'bg-gray-400' };
                    return (
                        <li key={sizeData.size} className="col-span-1 flex shadow-sm rounded-md">
                            <div
                                className={classNames(
                                    project.bgColor,
                                    'flex-shrink-0 flex items-center justify-center w-22 text-white text-sm font-medium rounded-l-md'
                                )}
                            >
                                {sizeData.size}
                            </div>
                            <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                                <div className="flex-1 px-4 py-3 text-sm truncate">
                                    <div className="flex ">  {/* Thêm 'flex' và 'items-center' để căn ngang các thẻ con */}
                                        <div className="text-gray-900 font-medium hover:text-gray-600">
                                            Quantity:
                                        </div>
                                        <input
                                            ref={el => inputRefs.current[sizeData.size] = el}
                                            type="number"
                                            value={sizeData.quantity}
                                            onChange={(e) => handleQuantityChange(sizeData.size, parseInt(e.target.value))}
                                            className="ml-4 w-20 text-red-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex-shrink-0 flex gap-1 pr-2">
                                    <button
                                        type="button"
                                        onClick={() => handleEditClick(sizeData.size)}
                                        className="w-8 h-8  bg-white inline-flex items-center justify-center text-black rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <BsFillPencilFill aria-hidden="true" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleResetQuantity(sizeData.size)}
                                        className="w-8 h-8  bg-white inline-flex items-center justify-center text-indigo-800 font-bold rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <PiBroomFill aria-hidden="true" size="22" /> {/* Chỉnh sửa nếu có icon phù hợp hơn */}
                                    </button>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
            <div className=" mt-5 col-span-1 flex shadow-sm rounded-md">
                <SelectSize onSelect={(size) => setSelectedSize(size)} />
                <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md ">
                    <div className="flex-1 px-4 py-3 text-sm truncate">
                        <div className="flex ">
                            <div className="text-gray-900 font-medium hover:text-gray-600">
                                Quantity:
                            </div>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                className="ml-4 w-20 text-red-500"
                                placeholder="Enter quantity"
                            />
                        </div>
                    </div>
                    <div className="flex-shrink-0 flex gap-1 pr-2  ">
                        <button
                            type="button"
                            onClick={handleOnClickAddSize}
                            className="w-8 h-8  bg-white inline-flex items-center justify-center text-stone-700 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <FaPlus aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SizeComponent;
