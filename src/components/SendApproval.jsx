import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';

import {
    ChartBarSquareIcon,
    GlobeAltIcon,
    ServerIcon,
    UsersIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: ServerIcon, current: false },
    { name: 'Clients', href: '/clients', icon: UsersIcon, current: false },
    { name: 'Send Approval', href: '/send-approval', icon: GlobeAltIcon, current: true },
    { name: 'Approvals', href: '/approvals', icon: ChartBarSquareIcon, current: false },
];

const accountTypes = [
    { value: 'Collateral', label: 'Collateral' },
    { value: 'Settlement', label: 'Settlement' },
    { value: 'Operational', label: 'Operational' },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export const SendApproval = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [accountType, setAccountType] = useState(null);
    const [accountNumber, setAccountNumber] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            logout();
            console.log('User not available in localStorage. Logging out...');
        }
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await axios.get('https://ajp.afreebmart.com/api/all-clients');
            setClients(response.data.map(client => ({ value: client.id, label: client.manager })));
            console.log('Clients fetched successfully:', response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
            toast.error('Failed to fetch clients');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://ajp.afreebmart.com/api/approvals', {
                client_id: selectedClient.value,
                account_number: accountNumber,
                account_type: accountType.value,
                amount: parseFloat(amount),
            });

            toast.success('Approval saved successfully');

            // Generate and download PDF
            try {
                const pdfResponse = await axios.get(`https://ajp.afreebmart.com/api/approvals/${response.data.id}/pdf`, {
                    responseType: 'blob',
                });

                // Check if the response is actually a PDF
                if (pdfResponse.headers['content-type'] === 'application/pdf') {
                    const url = window.URL.createObjectURL(new Blob([pdfResponse.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'approval_document.pdf');
                    document.body.appendChild(link);
                    link.click();
                    link.remove();

                    // After successful download, prompt user to edit and upload
                    promptForPdfUpload(response.data.id);
                } else {
                    // If it's not a PDF, it's likely an error message
                    const reader = new FileReader();
                    reader.onload = function() {
                        const errorMessage = JSON.parse(reader.result);
                        toast.error(`Failed to generate PDF: ${errorMessage.message || 'Unknown error'}`);
                    };
                    reader.readAsText(pdfResponse.data);
                }
            } catch (pdfError) {
                console.error('Error generating PDF:', pdfError);
                toast.error('Failed to generate PDF');
            }

        } catch (error) {
            console.error('Error saving approval:', error);
            toast.error('Failed to save approval');
        }
    };

    const promptForPdfUpload = (approvalId) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'application/pdf';
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                uploadEditedPdf(approvalId, file);
            }
        };
        fileInput.click();
    };

    const uploadEditedPdf = async (approvalId, file) => {
        const formData = new FormData();
        formData.append('pdf', file);

        try {
            await axios.post(`https://ajp.afreebmart.com/api/approvals/${approvalId}/upload-pdf`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Edited PDF uploaded successfully');
        } catch (error) {
            console.error('Error uploading edited PDF:', error);
            // toast.error('Failed to upload edited PDF');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
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
                        <form onSubmit={handleSubmit}>
                            <div className="py-12 px-12">
                                <div className="border-b border-white/10 pb-12">
                                    <h2 className="text-base font-semibold leading-7 text-white">Select Client and Send
                                        Approval</h2>

                                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                        <div className="sm:col-span-3">
                                            <label htmlFor="client"
                                                   className="block text-sm font-medium leading-6 text-white">
                                                Client
                                            </label>
                                            <div className="mt-2 text-black">
                                                <Select
                                                    options={clients}
                                                    value={selectedClient}
                                                    onChange={setSelectedClient}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="account_type"
                                                   className="block text-sm font-medium leading-6 text-white">
                                                Account Type
                                            </label>
                                            <div className="mt-2">
                                                <Select
                                                    options={accountTypes}
                                                    value={accountType}
                                                    onChange={setAccountType}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="account_number"
                                                   className="block text-sm font-medium leading-6 text-white">
                                                Account Number
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="account_number"
                                                    id="account_number"
                                                    value={accountNumber}
                                                    onChange={(e) => setAccountNumber(e.target.value)}
                                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="amount"
                                                   className="block text-sm font-medium leading-6 text-white">
                                                Amount
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="number"
                                                    name="amount"
                                                    id="amount"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-end gap-x-6">
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                    >
                                        Save and Generate PDF
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
