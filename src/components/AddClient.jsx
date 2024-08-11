import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify';
import {
    ChartBarSquareIcon,
    GlobeAltIcon,
    ServerIcon,
    UsersIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { Bars3Icon, MagnifyingGlassIcon, PhotoIcon } from '@heroicons/react/20/solid'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: ServerIcon, current: false },
    { name: 'Clients', href: '/clients', icon: UsersIcon, current: false },
    { name: 'Send Approval', href: '/send-approval', icon: GlobeAltIcon, current: false },
    { name: 'Approvals', href: '/approvals', icon: ChartBarSquareIcon, current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const AddClient = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { logout } = useAuth()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        manager: '',
        directors_name: '',
        address: '',
        letter_head: null,
        signature: null
    })

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            logout();
            console.log('User not available in localStorage. Logging out...');
        }
    }, []);

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const handleInputChange = (e) => {
        const { name, value, files } = e.target
        setFormData(prevState => ({
            ...prevState,
            [name]: files ? files[0] : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formDataToSend = new FormData()

        // Append text fields
        formDataToSend.append('manager', formData.manager)
        formDataToSend.append('directors_name', formData.directors_name)
        formDataToSend.append('address', formData.address)

        // Append file fields
        if (formData.letter_head) {
            formDataToSend.append('letter_head', formData.letter_head)
        }
        if (formData.signature) {
            formDataToSend.append('signature', formData.signature)
        }

        try {
            const response = await axios.post('https://ajp.afreebmart.com/api/clients', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (response.status === 200) {
                toast.success('Client added successfully!')
                // Reset form
                setFormData({
                    manager: '',
                    directors_name: '',
                    address: '',
                    letter_head: null,
                    signature: null
                })
                navigate('/clients')
                window.location.reload()
            } else {
                // toast.error('Failed to add client. Please try again.')
                navigate('/clients')
                console.error('Error adding client:', response.data)
            }
        } catch (error) {
            // toast.error('Failed to add client. Please try again.')
            navigate('/clients')
            console.error('Error adding client:', error)
        }
    }

    return (
        <>
            <div className="bg-gray-900">
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-50 xl:hidden" onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-900/80"/>
                        </Transition.Child>

                        <div className="fixed inset-0 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1 bg-gray-900">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                            <button type="button" className="-m-2.5 p-2.5"
                                                    onClick={() => setSidebarOpen(false)}>
                                                <span className="sr-only">Close sidebar</span>
                                                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true"/>
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    {/* Sidebar component, swap this element with another sidebar if you like */}
                                    <div
                                        className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10">
                                        <div className="flex h-16 shrink-0 items-center">
                                            <img
                                                className="h-8 w-auto"
                                                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                                alt="Your Company"
                                            />
                                        </div>
                                        <nav className="flex flex-1 flex-col">
                                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                                <li>
                                                    <ul role="list" className="-mx-2 space-y-1">
                                                        {navigation.map((item) => (
                                                            <li key={item.name}>
                                                                <a
                                                                    href={item.href}
                                                                    className={classNames(
                                                                        item.current
                                                                            ? 'bg-gray-800 text-white'
                                                                            : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                                    )}
                                                                >
                                                                    <item.icon className="h-6 w-6 shrink-0"
                                                                               aria-hidden="true"/>
                                                                    {item.name}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>

                                                <li className="-mx-6 mt-auto">
                                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                                    >
                                        <span aria-hidden="true">Log Out</span>
                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* Static sidebar for desktop */}
                <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col bg-gray-900">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5">
                        <div className="flex h-16 shrink-0 items-center">
                            <img
                                className="h-8 w-auto"
                                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                alt="Your Company"
                            />
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map((item) => (
                                            <li key={item.name}>
                                                <Link
                                                    to={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? 'bg-gray-800 text-white'
                                                            : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                    )}
                                                >
                                                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true"/>
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>

                                <li className="-mx-6 mt-auto">
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                                    >
                                        <span aria-hidden="true">Log Out</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="xl:pl-72 bg-gray-900">
                    {/* Sticky search header */}
                    <div
                        className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">
                        <button type="button" className="-m-2.5 p-2.5 text-white xl:hidden"
                                onClick={() => setSidebarOpen(true)}>
                            <span className="sr-only">Open sidebar</span>
                            <Bars3Icon className="h-5 w-5" aria-hidden="true"/>
                        </button>

                        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                            <form className="flex flex-1" action="#" method="GET">
                                <label htmlFor="search-field" className="sr-only">
                                    Search
                                </label>
                                <div className="relative w-full">
                                    <MagnifyingGlassIcon
                                        className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-500"
                                        aria-hidden="true"
                                    />
                                    <input
                                        id="search-field"
                                        className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-white focus:ring-0 sm:text-sm"
                                        placeholder="Search..."
                                        type="search"
                                        name="search"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>

                    <main className="bg-gray-900">
                        <form onSubmit={handleSubmit}>
                            <div className="py-12 px-12">
                                <div className="border-b border-white/10 pb-12">
                                    <h2 className="text-base font-semibold leading-7 text-white">Add Client</h2>


                                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                        <div className="sm:col-span-3">
                                            <label htmlFor="manager"
                                                   className="block text-sm font-medium leading-6 text-white">
                                                Manager
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="manager"
                                                    id="manager"
                                                    value={formData.manager}
                                                    onChange={handleInputChange}
                                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="directors_name"
                                                   className="block text-sm font-medium leading-6 text-white">
                                                Directors Name
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="directors_name"
                                                    id="directors_name"
                                                    value={formData.directors_name}
                                                    onChange={handleInputChange}
                                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-4">
                                            <label htmlFor="address"
                                                   className="block text-sm font-medium leading-6 text-white">
                                                Address
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    id="address"
                                                    name="address"
                                                    type="text"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-span-full">
                                            <label htmlFor="letter_head"
                                                   className="block text-sm font-medium leading-6 text-white">
                                                Letter Head
                                            </label>
                                            <div
                                                className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                                                <div className="text-center">
                                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-500"
                                                               aria-hidden="true"/>
                                                    <div className="mt-4 flex text-sm leading-6 text-gray-400">
                                                        <label
                                                            htmlFor="letter_head"
                                                            className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
                                                        >
                                                            <span>Upload a file</span>
                                                            <input
                                                                type="file"
                                                                id="letter_head"
                                                                name="letter_head"
                                                                onChange={handleInputChange}
                                                                className="sr-only"
                                                            />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs leading-5 text-gray-400">
                                                        {formData.letter_head
                                                            ? `${formData.letter_head.name} - ${formatFileSize(formData.letter_head.size)}`
                                                            : 'Allowed types: PDF, DOC, DOCX, PNG, JPG, GIF up to 10MB'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-full">
                                            <label htmlFor="signature"
                                                   className="block text-sm font-medium leading-6 text-white">
                                                Signature
                                            </label>
                                            <div
                                                className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                                                <div className="text-center">
                                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-500"
                                                               aria-hidden="true"/>
                                                    <div className="mt-4 flex text-sm leading-6 text-gray-400">
                                                        <label
                                                            htmlFor="signature"
                                                            className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
                                                        >
                                                            <span>Upload a signature</span>
                                                            <input
                                                                id="signature"
                                                                name="signature"
                                                                type="file"
                                                                className="sr-only"
                                                                onChange={handleInputChange}
                                                            />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs leading-5 text-gray-400">
                                                        {formData.signature
                                                            ? `${formData.signature.name} - ${formatFileSize(formData.signature.size)}`
                                                            : 'PNG, JPG, GIF up to 10MB'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-end gap-x-6 ">
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </>
    )
}
