import React, { useEffect, useState } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import { ImMenu } from "react-icons/im";
import { FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import * as Api from '../ApiService';
import AddCategoryForm from '../components/AddForm/AddCategoryForm';
import { Category } from '../types/category';
import { handleImageOnError, handleImageOnLoad } from '../utils';
import DangerDialog from '../components/Dialogs/DangerDialog';
import { Product } from '../types/product';
import { useCategories } from '../hooks/CategoryContext';
import TableCategory from '../components/Tables/TableCategory';

const Categories: React.FC = () => {

    const [showAddForm, setShowAddForm] = useState(false);
    const [responseData, setResponseData] = useState<Category[] | null>(null);
    const [showDangerDialog, setShowDangerDialog] = useState(false);
    const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
    const [selectedCategoryShowProduct, setSelectedCategoryShowProduct] = useState<string>("");
    // Dummy data for pagination
    const [showTableFour, setShowTableFour] = useState(false);
    const [productData, setProductData] = useState<Product[]>([]);  // Assuming you have some way to get this data
    const [totalPages, setTotalPages] = useState(0);  // Dummy data, adjust accordingly
    const [currentPage, setCurrentPage] = useState(1);  // Initial page
    const { addCategory, deleteCategory } = useCategories();

    const fetchCategories = async () => {
        try {
            const data = await Api.getAllCategory();
            setResponseData(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchCategories();
        console.log('responseData', responseData);
    }, []);

    const handleAddCategory = async (category: Category) => {
        console.log(category);
        const data = await Api.addNewCategory(category);
        addCategory(data);
        fetchCategories();
        setShowAddForm(false); // Đóng form sau khi thêm
    };

    // hendle delete category
    const handleDeleteCategory = async (categoryName: string) => {
        try {
            await Api.deleteCategory(categoryName);
            fetchCategories();
        } catch (err) {
            console.log(err);
        }
    };

    const handleConfirmDelete = async (categoryName: string) => {
        console.log(`Deleting category with ID: ${categoryName}`);
        // Thực hiện xóa category tại đây
        await handleDeleteCategory(categoryName);
        deleteCategory(categoryName)
        setShowDangerDialog(false);
    };

    const handleDeleteClick = (categoryName: string) => {
        setSelectedCategoryName(categoryName);
        setShowDangerDialog(true);
    };

    const handleViewClick = (categoryName: string) => {
        if (selectedCategoryShowProduct === categoryName) {
            setSelectedCategoryShowProduct("");
            setShowTableFour(false);
            return;
        }
        setSelectedCategoryShowProduct(categoryName);
        setShowTableFour(true);
        toggleTableFour(categoryName);
    };

    const toggleTableFour = async (categoryName: string) => {
        try {
            const data = await Api.getProductsByCategory(categoryName);
            setProductData(data.products);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <DefaultLayout>
            {showDangerDialog && (
                <DangerDialog
                    nameComponent={selectedCategoryName}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowDangerDialog(false)}
                />
            )}
            <div className="grid grid-cols-1 cursor-pointer gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-5 2xl:gap-7.5">
                <div
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex mb-6 items-center justify-center gap-2.5 rounded-md bg-black py-4 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                >
                    <FaPlus size="20" />
                    Create New
                </div>
            </div>
            {showTableFour && (
                <TableCategory
                    productData={productData}
                    totalPages={totalPages}
                    titleName={`Products  of ${selectedCategoryShowProduct}`}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            )}
            {showAddForm && (
                <AddCategoryForm
                    onAdd={handleAddCategory}
                    onClose={() => setShowAddForm(false)}
                />
            )}
            <div className="grid grid-cols-1 mt-6 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-5 2xl:gap-7.5">
                {responseData && responseData.map((category, index) => (
                    <div key={index} className="p-0 mx-10 sm:mx-30 md:mx-0 bg-gray-200 rounded-lg shadow-xl transition from-blue-600 to-purple-600 hover:from-orange-500 hover:to-orange-700 duration-300 ease-in-out">
                        <div className="bg-gradient-to-r py-2">
                            <h3 className="text-lg font-semibold text-center text-white">{category.name}</h3>
                        </div>
                        <div className="overflow-hidden aspect-w-1 aspect-h-1">
                            <img
                                src={`${import.meta.env.VITE_API_URL}${category.image}`}
                                alt={category.name}
                                onLoad={handleImageOnLoad}
                                onError={handleImageOnError}
                                className="w-full object-cover transition duration-300 ease-in-out hover:scale-110"
                            />
                        </div>
                        <div className="py-2">
                            <h3 className="flex justify-center text-center ">
                                <div
                                    className='p-1  px-3 mr-3 hover:text-primary cursor-pointer'
                                    onClick={() => handleViewClick(category.name)}>
                                    <ImMenu size="20" />
                                </div>
                                <div
                                    className='p-1 px-3 hover:text-red-500 cursor-pointer'
                                    onClick={() => handleDeleteClick(category.name)}
                                >
                                    <FaTrash size="20" />
                                </div>
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </DefaultLayout>
    );
};

export default Categories;