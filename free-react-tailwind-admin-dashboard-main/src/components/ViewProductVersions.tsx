import { useEffect, useState } from 'react';
import TableFive from './Tables/TableFive';
import { Version } from '../types/version';
import AddVerionForm from './AddForm/AddVersionForm';
import * as Api from '../ApiService';
import DangerDialog from './Dialogs/DangerDialog';
import EditVerionForm from './EditVerionForm';
import { showErrorToast, showSuccessToast } from '../utils'; // Giả sử đường dẫn
import Loading from './Loading/Loading';
import { useLoading } from '../hooks/LoadingContext';


interface ViewProductVersionProps {
    productId: number;
}

const ViewProductVersion: React.FC<ViewProductVersionProps> = ({ productId }) => {
    const { showLoading, hideLoading } = useLoading();
    const [showAddForm, setShowAddForm] = useState(false);
    const [productVersions, setProductVersions] = useState<Version[]>([]);

    // Edit version
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedEditVersionId, setSelectedEditVersionId] = useState<number>(0);
    const [editVersionData, setEditVersionData] = useState<Version | undefined>(undefined);

    //Delete version 
    const [showDangerDialogDeleted, setShowDangerDialogDeleted] = useState(false);
    const [selectedDeleteVerisonStyle, setSelectedDeleteVersionStyle] = useState<string>("");
    const [selectedDeleteVersionId, setSelectedDeleteVersionId] = useState<number>(0);

    const fetchVersions = async (productId: number) => {
        try {
            const res = await Api.getAllVersionOfProduct(productId);
            setProductVersions(res.versions); // Cập nhật state với dữ liệu mới từ server
        } catch (err) {
            // Xử lý lỗi nếu cần
            console.error('Không thể tải dữ liệu sản phẩm');
        }
    };

    useEffect(() => {
        if (productId) {
            fetchVersions(productId);
        }
    }, [productId]); // Chỉ re-fetch khi productId thay đổi


    const handleAddVersion = async (versionData: Version) => {
        showLoading();
        try {
            await Api.addNewVersion(productId, versionData);
            fetchVersions(productId);
            showSuccessToast("Version added successfully!");
            setShowAddForm(false); // Optional: Close form on success
        } catch (error) {
            console.error("Error adding version:", error);
            showErrorToast("Failed to add version, please try again.");
        } finally {
            hideLoading;
        }
    };

    console.log("selectedEditVersionId", selectedEditVersionId)

    const toggleAction = (versionId: number, actionType: string, version: Version) => {
        console.log('toggleAction', versionId, actionType);
        if (actionType === 'delete') {
            setSelectedDeleteVersionId(versionId);
            setSelectedDeleteVersionStyle(version.style);
            setShowDangerDialogDeleted(true);
            return;
        } else if (actionType === 'edit') {
            setSelectedEditVersionId(versionId);
            setEditVersionData(version);
            setShowEditForm(true);
        }
    };

    const handleConfirmDelete = async () => {
        showLoading();
        try {
            await Api.deleteVersion(selectedDeleteVersionId);
            fetchVersions(productId);
            showSuccessToast("Version deleted successfully!");
            setShowDangerDialogDeleted(false);
        } catch (error) {
            console.error("Error deleting version:", error);
            showErrorToast("Failed to delete version, please try again.");
        } finally {
            hideLoading;
        }
    };

    const handleOnSubmitUpdate = async () => {
        fetchVersions(productId)
        // setEditVersionData(selectedEditVersionId);
        setShowEditForm(false);
    }


    return (
        <>
            {showDangerDialogDeleted && (
                <DangerDialog
                    nameComponent={selectedDeleteVerisonStyle}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowDangerDialogDeleted(false)}
                />
            )}
            <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                <div className={`col-span-12 rounded-sm  bg-white h-fit  shadow-default  dark:bg-boxdark  ${showEditForm ? "xl:col-span-7" : "xl:col-span-12"}`}>

                    {productVersions && (
                        <TableFive
                            titleName="Product Versions"
                            versionData={productVersions}
                            onClickAdd={() => setShowAddForm(true)}
                            toggleAction={toggleAction}
                        />
                    )}
                </div>

                {showEditForm && (
                    <EditVerionForm
                        versionId={selectedEditVersionId}
                        onSubmitEdit={handleOnSubmitUpdate}
                        initialVersionData={editVersionData}
                        onCancel={() => setShowAddForm(true)}

                    />
                )}
            </div>

            {showAddForm && (
                <AddVerionForm
                    onAdd={handleAddVersion}
                    onClose={() => setShowAddForm(false)}
                />
            )}


        </>
    );
};

export default ViewProductVersion;
