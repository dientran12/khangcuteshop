import Shop from '../../images/khangshop.jpg';

const DropdownUser = () => {

  return (
    <div className="relative">
      <div
        className="flex items-center gap-4"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            Shop Khang
          </span>
          <span className="block text-xs">Uy tins</span>
        </span>

        <span className="h-12 w-12 ">
          <img src={Shop} alt="User" className='rounded-full' />
        </span>
      </div>

    </div>
  );
};

export default DropdownUser;
