import React, { useEffect, useRef } from 'react';
import { Modal } from 'flowbite'; // Import Modal from flowbite

const ContactModal = ({ contact, isOpen, onClose }) => {
  const modalRef = useRef(null);
  const flowbiteModalInstance = useRef(null);

  useEffect(() => {
    if (modalRef.current) {
      const options = {
        placement: 'bottom-right',
        backdrop: 'dynamic',
        backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
        closable: true,
        onHide: () => {
          console.log('modal is hidden');
          onClose(); // Call parent's onClose when modal hides
        },
        onShow: () => {
          console.log('modal is shown');
        },
        onToggle: () => {
          console.log('modal has been toggled');
        },
      };

      const instanceOptions = {
        id: 'view_contact_modal',
        override: true,
      };

      flowbiteModalInstance.current = new Modal(modalRef.current, options, instanceOptions);
    }

    return () => {
      if (flowbiteModalInstance.current) {
        flowbiteModalInstance.current.destroy();
        flowbiteModalInstance.current = null;
      }
    };
  }, [onClose]);

  useEffect(() => {
    if (flowbiteModalInstance.current) {
      if (isOpen) {
        flowbiteModalInstance.current.show();
      } else {
        flowbiteModalInstance.current.hide();
      }
    }
  }, [isOpen]);

  if (!contact) {
    return null;
  }

  return (
    <div
      id="view_contact_modal"
      tabIndex="-1"
      aria-hidden="true"
      ref={modalRef}
      className="hidden transition-all overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* Modal header */}
          <div className="flex justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <div className=""></div>
            <div className="p-5 flex flex-col justify-center items-center space-y-2">
              <img
                onError={(e) => e.target.src = 'https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png'}
                id="contact_image"
                className="w-32 h-32 rounded-full object-cover"
                src={contact.picture}
                alt={`${contact.name} profile`}
              />
              <h3 id="contact_name" className="text-xl font-semibold text-gray-900 dark:text-white">
                {contact.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300" id="contact_email">
                {contact.email}
              </p>
              <p className="text-gray-600 dark:text-gray-300" id="contact_phone">
                {contact.phoneNumber}
              </p>
            </div>

            <button
              type="button"
              className="text-gray-400 border bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 flex justify-center items-center h-8 ms-auto dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={onClose}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* Modal body */}
          <div className="p-4 md:p-5 space-y-4">
            {/* Other contact information */}
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
                <tbody>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <i className="fa-solid fa-location-dot w-6 h-6"></i>
                    </th>
                    <td className="px-6 py-4">
                      <span id="contact_address">{contact.address}</span>
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <i className="fa-solid fa-user w-6 h-6"></i>
                    </th>
                    <td className="px-6 py-4">
                      <span id="contact_about">{contact.description}</span>
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <i className="fa-regular fa-heart w-6 h-6"></i>
                    </th>
                    <td className="px-6 py-4">
                      <span id="contact_favorite">
                        {contact.favorite ? (
                          <>
                            <i className='fas fa-star text-yellow-400'></i>
                            <i className='fas fa-star text-yellow-400'></i>
                            <i className='fas fa-star text-yellow-400'></i>
                            <i className='fas fa-star text-yellow-400'></i>
                            <i className='fas fa-star text-yellow-400'></i>
                          </>
                        ) : (
                          'Not Favorite Contact'
                        )}
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <i className="fa-solid fa-earth-americas w-6 h-6"></i>
                    </th>
                    <td className="px-6 py-4">
                      <a id="contact_website" href={contact.websiteLink} target="_blank" rel="noopener noreferrer">
                        {contact.websiteLink}
                      </a>
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <i className="fa-brands fa-linkedin-in w-6 h-6"></i>
                    </th>
                    <td className="px-6 py-4">
                      <a id="contact_linkedIn" href={contact.linkedInLink} target="_blank" rel="noopener noreferrer">
                        {contact.linkedInLink}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Modal footer */}
          <div className="flex items-center justify-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              onClick={onClose}
              type="button"
              className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
