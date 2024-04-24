import { Product } from '../../types/product';
import imageEmpty from '../../images/image-empty.jpg';
import { FaPlus, FaTrash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import { handleImageOnError, handleImageOnLoad } from '../../utils';
import { MdEditSquare } from "react-icons/md";
import { Version } from '../../types/version';

interface TableFiveProps {
    versionData: Version[],
    titleName: string,
    onClickAdd: () => void
    toggleAction: (versionId: number, actionType: string, version: Version) => void;
}

const TableFive: React.FC<TableFiveProps> = ({ versionData, titleName, onClickAdd, toggleAction }) => {

    return (
        <div className="rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="py-6 px-4 md:px-6 xl:px-7.5">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    {titleName}
                </h4>
            </div>

            <div className="grid grid-cols-4 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-6 md:px-6 2xl:px-7.5">
                <div className="col-span-3 flex items-center">
                    <p className="font-medium">Version</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Sold</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Stock</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Action</p>
                </div>
            </div>

            {versionData && versionData?.map((version, key) => (
                <div
                    className="grid grid-cols-4 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-6 md:px-6 2xl:px-7.5"
                    key={key}
                >
                    <div className="col-span-3 flex items-center">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div>
                                <img
                                    src={version.images?.length ? `${import.meta.env.VITE_API_URL}${version.images[0]}` : imageEmpty}
                                    alt="Version"
                                    className="h-30 w-30 object-cover rounded-md"
                                    onError={handleImageOnError}
                                    onLoad={handleImageOnLoad} // Thêm sự kiện onLoad nếu cần
                                />
                            </div>
                            <p className="text-sm text-black dark:text-white">
                                {version.style}
                            </p>
                        </div>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <p className="text-sm text-black dark:text-white">{version.sold}</p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <p className="text-sm text-black dark:text-white">{version.stock}</p>
                    </div>
                    <div className="col-span-1 flex items-center space-x-3.5">
                        <button
                            className="hover:text-primary cursor-pointer p-2"
                            onClick={() => toggleAction(version.id, 'edit', version)}

                        >
                            <MdEditSquare />
                        </button>
                        <button
                            className="hover:text-red-600 cursor-pointer p-2"
                            onClick={() => toggleAction(version.id, 'delete', version)}
                        >
                            <FaTrash />
                        </button>
                    </div>
                </div>
            ))}

            <div
                className="grid grid-cols-1 border-t border-stroke py-4.5 px-4 dark:border-strokedark  md:px-6 2xl:px-7.5"
            >
                <div
                    onClick={onClickAdd}
                    className="inline-flex  cursor-pointer items-center justify-center gap-2.5 rounded-md bg-black dark:bg-slate-300 py-4 px-6 text-center font-medium text-white dark:text-black hover:bg-opacity-90 dark:hover:bg-slate-200 lg:px-8 xl:px-10"
                >
                    <FaPlus size="20" />
                </div>
            </div>
        </div>
    );
};

export default TableFive;
