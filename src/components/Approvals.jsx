import {Fragment, useEffect, useState} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
    ChartBarSquareIcon,
    GlobeAltIcon,
    ServerIcon,
    UsersIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../AuthContext.jsx";

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: ServerIcon, current: false },
    { name: 'Clients', href: '/clients', icon: UsersIcon, current: false },
    { name: 'Send Approval', href: '/send-approval', icon: GlobeAltIcon, current: false },
    { name: 'Approvals', href: '/approvals', icon: ChartBarSquareIcon, current: true },
]

const people = [
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
    // More people...
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export const Approvals = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [approvals, setApprovals] = useState([])
    const { logout } = useAuth()
    const navigate = useNavigate()


    useEffect(() => {
        fetch('https://ajp.afreebmart.com/api/all-approvals')
            .then(response => response.json())
            .then(data => {
                setApprovals(data);
            })
            .catch(error => {
                console.error('Error fetching approval data:', error);
            });
    }, []);

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
                            <div className="fixed inset-0 bg-gray-900/80" />
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
                                            <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                                                <span className="sr-only">Close sidebar</span>
                                                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    {/* Sidebar component, swap this element with another sidebar if you like */}
                                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10">
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
                                                                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
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
                                                <a
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? 'bg-gray-800 text-white'
                                                            : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                    )}
                                                >
                                                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                                    {item.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>

                                <li className="-mx-6 mt-auto">
                                    <a
                                        href="#"
                                        className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                                    >
                                        <span aria-hidden="true">Log Out</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="xl:pl-72 bg-gray-900">
                    {/* Sticky search header */}
                    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">
                        <button type="button" className="-m-2.5 p-2.5 text-white xl:hidden" onClick={() => setSidebarOpen(true)}>
                            <span className="sr-only">Open sidebar</span>
                            <Bars3Icon className="h-5 w-5" aria-hidden="true" />
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
                        <header className="bg-gray-900">
                            {/* Heading */}
                            <div
                                className="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-900 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
                                <div>
                                    <div className="flex items-center gap-x-3">
                                        <h1 className="flex gap-x-3 text-base leading-7">
                                            <span className="font-semibold text-white">Approvals</span>
                                        </h1>
                                    </div>
                                </div>
                                <div
                                    className="order-first flex-none  px-2 py-1 text-xs font-medium text-indigo-400  sm:order-none"
                                >
                                    <Link
                                        to="/send-approval"
                                        className="block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                    >
                                        Make Approvals
                                    </Link>
                                </div>
                            </div>
                        </header>

                        {/* Activity list */}
                        <div className="border-t border-white/10 pt-11 bg-gray-900 h-full">
                            <h2 className="px-4 text-base font-semibold leading-7 text-white sm:px-6 lg:px-8">Latest
                                activity</h2>
                            <div className="bg-gray-900">
                                <div className="mx-auto max-w-7xl">
                                    <div className="bg-gray-900 py-10">
                                        <div className="px-4 sm:px-6 lg:px-8">
                                            <div className="mt-8 flow-root">
                                            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                                    <div
                                                        className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                                        <table className="min-w-full divide-y divide-gray-700">
                                                            <thead>
                                                            <tr>
                                                                <th scope="col"
                                                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">
                                                                    Id
                                                                </th>
                                                                <th scope="col"
                                                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">
                                                                    Client
                                                                </th>
                                                                <th scope="col"
                                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                                                                    Account Type
                                                                </th>
                                                                <th scope="col"
                                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                                                                    Account Number
                                                                </th>
                                                                <th scope="col"
                                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                                                                    Amount
                                                                </th>
                                                                <th scope="col"
                                                                    className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                                                    <span className="sr-only">Send</span>
                                                                </th>
                                                            </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-800">
                                                            {approvals.map((approval) => (
                                                                <tr key={approval.id}>
                                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                                                                        {approval.id}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                                                                        {approval.client && approval.client.manager ? approval.client.manager : 'N/A'}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{approval.account_type}</td>
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{approval.account_number}</td>
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{approval.amount}</td>
                                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                                        {approval.pdf_path ? (
                                                                            <a
                                                                                href={`/storage/${approval.pdf_path}`}
                                                                                download={`approval_${approval.id}.pdf`}
                                                                                className="text-indigo-400 hover:text-indigo-300"
                                                                            >
                                                                                Download<span
                                                                                className="sr-only">, {approval.id}</span>
                                                                            </a>
                                                                        ) : (
                                                                            <span className="text-gray-500">No PDF available</span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}
