import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { HiChevronUpDown } from "react-icons/hi2"
import { FaCheck } from "react-icons/fa6";

interface Person {
  id: number;
  name: string;
}

const people: Person[] = [
  { id: 1, name: 'S' },
  { id: 2, name: 'M' },
  { id: 3, name: 'L' },
  { id: 4, name: 'XL' },
  { id: 5, name: '2XL' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface SelectSizeProps {
  onSelect: (selected: string) => void; // Hàm callback để trả giá trị cho component cha
}

const SelectSize: React.FC<SelectSizeProps> = ({ onSelect }) => {
  // const [selected, setSelected] = useState(people[0])
  const [selected, setSelected] = useState<{ id: number, name: string }>({ id: 0, name: 'New' });

  useEffect(() => {
    onSelect(selected.name);
  }, [selected, onSelect]);

  return (
    <Listbox value={selected} onChange={(person) => {
      setSelected(person);
      onSelect(person.name);  // Chỉ gửi tên của kích thước
    }}>
      {({ open }) => (
        <>
          <div className="relative ">
            <Listbox.Button className="relative bg-blue-500 flex-shrink-0 flex items-center w-22 text-sm font-medium h-full text-white cursor-default rounded-l-md pl-3 pr-10 text-left text-gray-900 shadow-sm  sm:text-sm sm:leading-6">
              <span className="flex items-center">
                <span className="ml-3 block truncate">{selected && selected.name || "New"}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <HiChevronUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {people.map((person) => (
                  <Listbox.Option
                    key={person.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                          >
                            {person.name}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <FaCheck className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}

export default SelectSize;