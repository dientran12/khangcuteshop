import React, { useEffect, useRef, useState } from 'react';
import TableFour from '../components/Tables/TableFour';
import * as Api from '../ApiService';
import DefaultLayout from '../layout/DefaultLayout';
import AddProductForm from '../components/AddForm/AddProductForm';
import { Product } from '../types/product';
import { FaPlus } from 'react-icons/fa6';
import EditProductForm from '../components/EditProductForm';
import DangerDialog from '../components/Dialogs/DangerDialog';
import ViewProductVersion from '../components/ViewProductVersions';
import { Version } from '../types/version';
import Loading from '../components/Loading/Loading';
import { showErrorToast, showSuccessToast } from '../utils';
import { useLoading } from '../hooks/LoadingContext';

interface ApiResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
}

const Products: React.FC = () => {
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  // const [viewProductVersion, setViewProductVersion] = useState<Product | undefined>(undefined);

  const [openAction, setOpenAction] = useState({ productId: -1, actionType: '' });
  const [showEditForm, setShowEditForm] = useState(false);
  const editAndViewRef = useRef<HTMLDivElement>(null);

  const { showLoading, hideLoading } = useLoading();

  // Delete product
  const [showDangerDialogDeleted, setShowDangerDialogDeleted] = useState(false);
  const [selectedDeleteProductName, setSelectedDeleteProductName] = useState<string>("");
  const [selectedDeleteProductId, setSelectedDeleteProductId] = useState<number>(-1);

  const fetchProducts = async () => {
    try {
      const itemsPerPage = 8;
      showLoading();
      const data = await Api.getAllProduct({ search: '', limit: itemsPerPage, page: currentPage });
      hideLoading()
      setResponseData(data);
    } catch (err) {
      hideLoading()
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]); // Thêm currentPage vào mảng phụ thuộc

  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddProduct = async (productData: Product) => {
    showLoading(); // Enable loading state at the beginning of the operation
    try {
      await Api.addNewProduct(productData);
      showSuccessToast("Product added successfully!"); // Show success message
      await fetchProducts(); // Reload the products after adding
      setShowAddForm(false); // Optionally close the add form on success
    } catch (error) {
      console.error("Failed to add product:", error);
      showErrorToast("Failed to add product, please try again."); // Show error message
    } finally {
      hideLoading(); // Disable loading state at the end of the operation
    }
  };


  const closeAddForm = () => {
    // Bắt đầu animation ẩn
    setShowAddForm(false);
  };

  const toggleAction = (productId: number, actionType: string, product: Product) => {
    console.log('toggleAction', openAction.productId, productId, actionType);
    if (actionType === 'delete') {
      // Thiết lập thông tin sản phẩm được chọn để xóa
      setSelectedDeleteProductId(productId);
      setSelectedDeleteProductName(product.name);
      // Hiển thị dialog xác nhận xóa
      setShowDangerDialogDeleted(true);
      return;
    }
    if (openAction.productId === productId && openAction.actionType === actionType) {
      // Kích hoạt animation đóng
      setShowEditForm(false);
      setTimeout(() => {
        setOpenAction({ productId: -1, actionType: '' });
        setEditingProduct(undefined);
      }, 500); // Đợi cho animation hoàn thành
    } else {
      setOpenAction({ productId, actionType });
      if (actionType === 'edit') {
        setEditingProduct(product);
        setShowEditForm(true); // Ngay lập tức hiển thị form
      }
    }
  };

  useEffect(() => {
    if (openAction.productId > -1 && (openAction.actionType === 'edit' || openAction.actionType === 'view')) {
      setShowEditForm(true);
      editAndViewRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

  }, [openAction]);

  // handle delete product

  const handleConfirmDelete = async () => {
    try {
      showLoading();
      await Api.deleteProduct(selectedDeleteProductId);
      setShowDangerDialogDeleted(false);
      showSuccessToast("Sản phẩm đã được xóa thành công."); // Thông báo thành công
      await fetchProducts();
      hideLoading();
    } catch (err) {
      console.log(err);
      showErrorToast("Xóa sản phẩm thất bại, vui lòng thử lại."); // Thông báo lỗi
      hideLoading();
    }
  };


  return (
    <DefaultLayout>
      {showDangerDialogDeleted && (
        <DangerDialog
          nameComponent={selectedDeleteProductName}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDangerDialogDeleted(false)}
        />
      )}
      <div className="col-span-12 xl:col-span-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-5 2xl:gap-7.5">
          <div
            onClick={() => setShowAddForm(true)}
            className="inline-flex mb-6 cursor-pointer items-center justify-center gap-2.5 rounded-md bg-black py-4 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            <FaPlus size="20" />
            Create New
          </div>
        </div>
        {showAddForm && (
          <AddProductForm
            onAdd={handleAddProduct}
            onClose={closeAddForm}
          />
        )}
        {responseData && (
          <TableFour
            titleName="All Products"
            productData={responseData.products}
            totalPages={responseData.totalPages}
            currentPage={currentPage}
            setCurrentPage={(page: number) => {
              setCurrentPage(page);
            }}
            toggleAction={toggleAction}
          />
        )}
        <div
          ref={editAndViewRef}
          // className={`transition-opacity duration-500 mt-6 ease-in-out ${openAction.productId > -1 && openAction.actionType === 'edit' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          className={`mt-6 z-0 transition-opacity duration-500 ${showEditForm ? 'animate-fadeIn' : 'animate-fadeOut'}`}
          style={{ display: showEditForm || (openAction.productId > -1 && openAction.actionType === 'edit' || openAction.actionType === 'view') ? 'block' : 'none' }}
        >
          {openAction.productId > -1 && openAction.actionType === 'edit' && (

            <EditProductForm
              onSubmitEdit={async () => {
                fetchProducts()
              }}
              productId={openAction.productId}
              initialProductData={editingProduct}
              onCancel={() => setOpenAction({ productId: -1, actionType: '' })}
            />
          )}
          {openAction.productId > -1 && openAction.actionType === 'view' && (

            <ViewProductVersion
              productId={openAction.productId}
            />
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Products;
