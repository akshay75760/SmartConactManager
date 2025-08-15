import React, { useState, useEffect } from 'react';
import UserSidebar from '../../components/user/UserSidebar';
import MessageBox from '../../components/common/MessageBox';
import ContactModal from '../../components/user/ContactModal';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../api/axiosConfig';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ContactsPage = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: 10,
    sortBy: 'name',
    direction: 'asc',
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });
  const [searchForm, setSearchForm] = useState({ field: '', value: '' });
  const [message, setMessage] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchContacts = async (page = 0, size = 10, sortBy = 'name', direction = 'asc', field = '', value = '') => {
    try {
      let url = `/user/contacts?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;
      if (field && value) {
        url = `/user/contacts/search?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}&field=${field}&value=${value}`;
      }
      const response = await axios.get(url);
      setContacts(response.data.content);
      setPageInfo({
        page: response.data.number,
        size: response.data.size,
        sortBy: sortBy,
        direction: direction,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
        first: response.data.first,
        last: response.data.last,
      });
      setMessage(null); // Clear any previous messages
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setMessage({ content: 'Failed to load contacts. Please try again.', type: 'red' });
    }
  };

  useEffect(() => {
    if (user) {
      fetchContacts(pageInfo.page, pageInfo.size, pageInfo.sortBy, pageInfo.direction);
    }
  }, [user, pageInfo.page, pageInfo.size, pageInfo.sortBy, pageInfo.direction]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchForm({ ...searchForm, [name]: value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchContacts(0, pageInfo.size, pageInfo.sortBy, pageInfo.direction, searchForm.field, searchForm.value);
  };

  const handleDeleteContact = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Show loading toast
          const loadingToast = toast.info('Deleting contact...', {
            autoClose: false,
            hideProgressBar: false,
          });

          const response = await axios.delete(`/user/contacts/delete/${id}`);
          
          // Close loading toast
          toast.dismiss(loadingToast);
          
          // Show success message
          toast.success(response.data.content || 'Contact deleted successfully!');
          setMessage({ content: 'Contact deleted successfully!', type: 'green' });
          
          // Re-fetch contacts to update the list
          fetchContacts(pageInfo.page, pageInfo.size, pageInfo.sortBy, pageInfo.direction, searchForm.field, searchForm.value);
        } catch (error) {
          console.error('Error deleting contact:', error);
          
          // Close loading toast if it exists
          toast.dismiss();
          
          let errorMessage = 'Failed to delete contact. Please try again.';
          if (error.response?.data?.content) {
            errorMessage = error.response.data.content;
          } else if (error.response?.status === 404) {
            errorMessage = 'Contact not found.';
          } else if (error.response?.status === 403) {
            errorMessage = 'You do not have permission to delete this contact.';
          } else if (error.response?.status === 401) {
            errorMessage = 'Please log in to delete contacts.';
          }
          
          toast.error(errorMessage);
          setMessage({ content: errorMessage, type: 'red' });
        }
      }
    });
  };

  const openContactModal = async (id) => {
    try {
      const response = await axios.get(`/api/contacts/${id}`);
      setSelectedContact(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error loading contact data for modal:', error);
      setMessage({ content: 'Failed to load contact details.', type: 'red' });
    }
  };

  const closeContactModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  const handlePageChange = (newPage) => {
    fetchContacts(newPage, pageInfo.size, pageInfo.sortBy, pageInfo.direction, searchForm.field, searchForm.value);
  };

  const exportData = () => {
    // This functionality would typically be handled by a backend endpoint
    // or a client-side library that can parse the table.
    // For now, we'll just log a message.
    console.log("Export functionality needs a client-side library or backend endpoint.");
    Swal.fire('Export Feature', 'This feature is under development. You can implement client-side table export using libraries like `table-to-excel`.', 'info');
  };

  return (
    <div id="content">
      {user && <UserSidebar loggedInUser={user} />}
      <div className="sm:pl-64 pt-20">
        <div className="">
          <h1 className="text-5xl text-center">All Your Contacts</h1>
          <p className="text-center">List of all contacts...</p>

          <div className="contacts_container p-5">
            <div className="flex md:flex-row flex-col items-center px-4 justify-between bg-white dark:bg-gray-900">
              <form onSubmit={handleSearchSubmit}>
                <div className="flex space-x-3 p-5 items-center justify-start flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
                  <div>
                    <select
                      name="field"
                      value={searchForm.field}
                      onChange={handleSearchChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="">Select Field</option>
                      <option value="name">Name</option>
                      <option value="phone">Phone</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                  <label htmlFor="table-search" className="sr-only">Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="table-search-users"
                      name="value"
                      value={searchForm.value}
                      onChange={handleSearchChange}
                      className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Search for contacts"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-gray-800 text-white rounded"
                  >
                    Search
                  </button>
                </div>
              </form>

              <div>
                <button
                  type="button"
                  onClick={exportData}
                  className="px-3 py-2 bg-green-800 text-white rounded"
                >
                  Export
                </button>
              </div>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              {message && <MessageBox message={message} />}

              {pageInfo.totalElements > 0 ? (
                <table
                  id="contact-table"
                  className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                >
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">Name</th>
                      <th scope="col" className="px-6 py-3">Phone</th>
                      <th scope="col" className="px-6 py-3">Links</th>
                      <th scope="col" className="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((c) => (
                      <tr
                        key={c.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <th
                          scope="row"
                          className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          <img
                            onError={(e) => e.target.src = 'https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png'}
                            className="w-10 h-10 rounded-full"
                            src={c.picture}
                            alt={`${c.name} image`}
                          />
                          <div className="ps-3">
                            <div className="text-base font-semibold">{c.name}</div>
                            <div className="font-normal text-gray-500">{c.email}</div>
                          </div>
                        </th>
                        <td className="px-6 py-4">
                          <i className="fa-solid fa-phone w-4 h-4"></i>
                          <span>{c.phoneNumber}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {c.favorite && (
                              <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>
                            )}
                            {c.websiteLink && (
                              <a href={c.websiteLink} target="_blank" rel="noopener noreferrer">
                                <i className="fa-solid w-6 h-6 fa-link"></i>
                              </a>
                            )}
                            {c.linkedInLink && (
                              <a href={c.linkedInLink} target="_blank" rel="noopener noreferrer">
                                <i className="fa-brands w-6 h-6 fa-linkedin"></i>
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <button onClick={() => handleDeleteContact(c.id)}>
                              <i className="fa-solid w-6 h-6 fa-trash"></i>
                            </button>
                            <Link to={`/user/contacts/view/${c.id}`}>
                              <i className="fa-solid w-6 h-6 fa-pen"></i>
                            </Link>
                            <button onClick={() => openContactModal(c.id)}>
                              <i className="fa-solid fa-eye"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <h1 className="text-5xl text-center dark:bg-gray-800 dark:text-white bg-white p-4">
                  No result found
                </h1>
              )}

              {/* Pagination component */}
              {pageInfo.totalElements > 0 && (
                <div className="pagination_container bg-white dark:bg-gray-800 p-5 text-center">
                  <nav aria-label="Page navigation example">
                    <ul className="inline-flex -space-x-px text-base h-10">
                      {!pageInfo.first && (
                        <li>
                          <button
                            onClick={() => handlePageChange(pageInfo.page - 1)}
                            className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                          >
                            Previous
                          </button>
                        </li>
                      )}
                      {[...Array(pageInfo.totalPages).keys()].map((index) => (
                        <li key={index}>
                          <button
                            onClick={() => handlePageChange(index)}
                            className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                              index === pageInfo.page ? 'bg-blue-50 dark:bg-gray-600' : 'bg-white dark:bg-gray-800'
                            }`}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      {!pageInfo.last && (
                        <li>
                          <button
                            onClick={() => handlePageChange(pageInfo.page + 1)}
                            className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                          >
                            Next
                          </button>
                        </li>
                      )}
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
        {selectedContact && (
          <ContactModal contact={selectedContact} isOpen={isModalOpen} onClose={closeContactModal} />
        )}
      </div>
    </div>
  );
};

export default ContactsPage;
