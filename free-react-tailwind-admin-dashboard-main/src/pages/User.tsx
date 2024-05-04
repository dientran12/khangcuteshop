import React, { useEffect, useRef, useState } from 'react';
import TableUser from '../components/Tables/TableUser';
import * as Api from '../ApiService';
import DefaultLayout from '../layout/DefaultLayout';
import Loading from '../components/Loading/Loading';
import { showErrorToast, showSuccessToast } from '../utils';
import { useLoading } from '../hooks/LoadingContext';
import DangerDialog from '../components/Dialogs/DangerDialog';
import { User } from '../types/user';

interface ApiResponse {
    users: User[];
    totalPages: number;
    currentPage: number;
}

const UserManagement: React.FC = () => {
    const [responseData, setResponseData] = useState<ApiResponse | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [showDangerDialogDeleted, setShowDangerDialogDeleted] = useState(false);
    const [selectedDeleteUserName, setSelectedDeleteUserName] = useState<string>("");
    const [selectedDeleteUserId, setSelectedDeleteUserId] = useState<number>(-1);

    const { showLoading, hideLoading } = useLoading();

    const fetchUsers = async () => {
        try {
            showLoading();
            const limit = 10;
            const data = await Api.getAllUser(currentPage, limit); // Giả sử Api.getAllUser có tham số currentPage
            setResponseData(data);
            hideLoading();
        } catch (err) {
            hideLoading();
            showErrorToast("Failed to fetch users, please try again.");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const handleConfirmDelete = async () => {
        try {
            showLoading();
            await Api.deleteUser(selectedDeleteUserId);
            showSuccessToast(`User ${selectedDeleteUserName} has been successfully deleted.`);
            setShowDangerDialogDeleted(false);
            await fetchUsers();
            hideLoading();
        } catch (err) {
            showErrorToast("Failed to delete user, please try again.");
            hideLoading();
        }
    };

    const handleDelete = (user: User) => {
        setShowDangerDialogDeleted(true)
        setSelectedDeleteUserId(user.id)
        setSelectedDeleteUserName(user.name)
    }

    return (
        <DefaultLayout>
            {showDangerDialogDeleted && (
                <DangerDialog
                    nameComponent={selectedDeleteUserName}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowDangerDialogDeleted(false)}
                />
            )}
            <div className="col-span-12 xl:col-span-8">
                {responseData && (
                    <TableUser
                        titleName="All Users"
                        userData={responseData.users}
                        totalPages={responseData.totalPages}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        onDeletedUser={handleDelete}
                    />
                )}
            </div>
        </DefaultLayout>
    );
};

export default UserManagement;
