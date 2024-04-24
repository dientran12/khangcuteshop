import { FaPlus } from 'react-icons/fa6';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import { useState } from 'react';

const Version = () => {
    const [showAddForm, setShowAddForm] = useState(false);

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Product Versions" />

            {/* <!-- ====== Calendar Section Start ====== --> */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-5 2xl:gap-7.5">
                <div
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex mb-6 cursor-pointer items-center justify-center gap-2.5 rounded-md bg-black py-4 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                >
                    <FaPlus size="20" />
                    Create New
                </div>
            </div>
            <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            </div>
            {/* <!-- ====== Calendar Section End ====== --> */}
        </DefaultLayout>
    );
};

export default Version;
