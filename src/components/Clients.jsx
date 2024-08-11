import {Fragment, useEffect, useState} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import {
    ChartBarSquareIcon,
    GlobeAltIcon,
    ServerIcon,
    UsersIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import axios from "axios";

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: ServerIcon, current: false },
    { name: 'Clients', href: '/clients', icon: UsersIcon, current: true },
    { name: 'Send Approval', href: '/send-approval', icon: GlobeAltIcon, current: false },
    { name: 'Approvals', href: '/approvals', icon: ChartBarSquareIcon, current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export const Clients = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { logout } = useAuth()
    const navigate = useNavigate()
    const [clientCount, setClientCount] = useState(0);
    const [approvalCount, setApprovalCount] = useState(0);
    const [clients, setClients] = useState([]);

    const stats = [
        { name: 'Number Clients', value: clientCount.toString() },
        // { name: 'Average deploy time', value: '3.65', unit: 'mins' },
        { name: 'Number Approvals', value: approvalCount.toString() },
        // { name: 'Success rate', value: '98.5%' },
    ]




    useEffect(() => {
        fetch('https://ajp.afreebmart.com/api/all-clients')
            .then(response => response.json())
            .then(data => {
                setClients(data);
            })
            .catch(error => {
                console.error('Error fetching client data:', error);
            });
    }, []);

    console.log(clients)


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

    useEffect(() => {
        // Fetch data from the external API
        fetch('https://ajp.afreebmart.com/api/all-clients')
            .then(response => response.json())
            .then(data => {
                // Update the client count value
                setClientCount(data.length);
            })
            .catch(error => {
                console.error('Error fetching client data:', error);
            });
    }, []);

    useEffect(() => {
        // Fetch data from the external API
        fetch('https://ajp.afreebmart.com/api/all-approvals')
            .then(response => response.json())
            .then(data => {
                // Update the client count value
                setApprovalCount(data.length);
            })
            .catch(error => {
                console.error('Error fetching client data:', error);
            });
    }, []);

    const handleDelete = async (clientId) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            try {
                await axios.delete(`https://ajp.afreebmart.com/api/clients/${clientId}`);
                // Update the clients state to remove the deleted client
                setClients(clients.filter(client => client.id !== clientId));
                // Update the client count
                setClientCount(prevCount => prevCount - 1);
            } catch (error) {
                console.error('Delete failed:', error);
                alert('Failed to delete the client. Please try again.');
            }
        }
    };

    const handleDownload = async (type, clientId, fileName) => {
        try {
            const response = await axios.get(`https://ajp.afreebmart.com/api/download/${type}/${clientId}`, {
                responseType: 'blob', // Important for handling file downloads
            });

            // Create a blob from the response data
            const blob = new Blob([response.data], { type: response.headers['content-type'] });

            // Create a link element and trigger the download
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();

            // Clean up
            window.URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Download failed:', error);
            // Handle error (e.g., show an error message to the user)
        }
    };


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
                        <header className="bg-gray-900">
                            {/* Heading */}
                            <div
                                className="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-900 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
                                <div>
                                    <div className="flex items-center gap-x-3">
                                        <h1 className="flex gap-x-3 text-base leading-7">
                                            <span className="font-semibold text-white">Clients</span>
                                        </h1>
                                    </div>
                                </div>
                                <div
                                    className="order-first flex-none  px-2 py-1 text-xs font-medium text-indigo-400  sm:order-none"
                                >
                                    <Link
                                        to="/add-client"
                                        className="block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                    >
                                        Add Client
                                    </Link>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-1 bg-gray-900 sm:grid-cols-2 lg:grid-cols-4">
                                {stats.map((stat, statIdx) => (
                                    <div
                                        key={stat.name}
                                        className={classNames(
                                            statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '',
                                            'border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8'
                                        )}
                                    >
                                        <p className="text-sm font-medium leading-6 text-gray-400">{stat.name}</p>
                                        <p className="mt-2 flex items-baseline gap-x-2">
                                            <span
                                                className="text-4xl font-semibold tracking-tight text-white">{stat.value}</span>
                                            {stat.unit ?
                                                <span className="text-sm text-gray-400">{stat.unit}</span> : null}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </header>

                        {/* Activity list */}
                        <div className="border-t border-white/10 pt-11 bg-gray-900 h-full">
                            <h2 className="px-4 text-base font-semibold leading-7 text-white sm:px-6 lg:px-8">Latest
                                Clients</h2>
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
                                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                                                                    Manager
                                                                </th>
                                                                <th scope="col"
                                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                                                                    Address
                                                                </th>
                                                                <th scope="col"
                                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                                                                    Director
                                                                </th>
                                                                {/*<th scope="col"*/}
                                                                {/*    className="px-3 py-3.5 text-left text-sm font-semibold text-white">*/}
                                                                {/*    Letter Head*/}
                                                                {/*</th>*/}
                                                                {/*<th scope="col"*/}
                                                                {/*    className="px-3 py-3.5 text-left text-sm font-semibold text-white">*/}
                                                                {/*    Signature*/}
                                                                {/*</th>*/}
                                                                <th scope="col"
                                                                    className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                                                    <span className="sr-only">Letter Head</span>
                                                                </th>
                                                            </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-800">
                                                            {clients.map((client) => (
                                                                <tr key={client.id}>
                                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                                                                        {client.id}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{client.manager}</td>
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{client.address}</td>
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{client.directors_name}</td>

                                                                    {/*<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">*/}
                                                                    {/*    <a*/}
                                                                    {/*        href={`https://ajp.afreebmart.com/api/download/${client.letter_head_path}`}*/}
                                                                    {/*        className="text-blue-500 hover:underline"*/}
                                                                    {/*    >*/}
                                                                    {/*        Download Letterhead*/}
                                                                    {/*    </a>*/}
                                                                    {/*</td>*/}
                                                                    {/*<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">*/}
                                                                    {/*    <button*/}
                                                                    {/*        onClick={() => handleDownload('signature', client.id, `signature_${client.id}.png`)}*/}
                                                                    {/*        className="text-blue-500 hover:underline"*/}
                                                                    {/*    >*/}
                                                                    {/*        Download Signature*/}
                                                                    {/*    </button>*/}
                                                                    {/*</td>*/}

                                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                                        <button
                                                                            onClick={() => handleDelete(client.id)}
                                                                            className="text-red-600 hover:text-red-400"
                                                                        >
                                                                            Delete<span
                                                                            className="sr-only">, {client.id}</span>
                                                                        </button>
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
