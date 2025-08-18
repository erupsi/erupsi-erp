// src/pages/ecommerce/components/eMarket.jsx

import { useState, useEffect } from 'react';

function EMarket({ onEdit, onAddProduct, onOpenCart, onView, cartItemsCount }) {
  const [products, setProducts] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/internal/products/")
      .then((res) => res.json())
      .then((response) => {
        // Mengakses data dari response.data karena struktur API baru
        if (response.data) {
          setProducts(response.data);
        } else {
          console.error("No data field in response:", response);
          setProducts([]);
        }
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const toggleDropdown = (productId) => {
    setOpenDropdown(openDropdown === productId ? null : productId);
  };

  const handleEdit = (product) => {
    console.log('Edit product:', product);
    setOpenDropdown(null);
    // Call the parent's onEdit function to open the modal
    if (onEdit) {
      onEdit(product);
    }
  };

  const handleDelete = (productId) => {
    console.log('Delete product:', productId);
    setOpenDropdown(null);
    // Add your delete logic here
    // Example: setProducts(products.filter(p => p.id_pos !== productId));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div>
      {/* Header with buttons - moved from main component */}
      <div className="header">
        <button
          className='add-product-button'
          onClick={onAddProduct}
        >
          <svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <title>plus</title>
              <desc>Created with Sketch Beta.</desc>
              <defs> </defs>
              <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" sketch:type="MSPage">
                <g id="Icon-Set-Filled" sketch:type="MSLayerGroup" transform="translate(-362.000000, -1037.000000)">
                  <path d="M390,1049 L382,1049 L382,1041 C382,1038.79 380.209,1037 378,1037 C375.791,1037 374,1038.79 374,1041 L374,1049 L366,1049 C363.791,1049 362,1050.79 362,1053 C362,1055.21 363.791,1057 366,1057 L374,1057 L374,1065 C374,1067.21 375.791,1069 378,1069 C380.209,1069 382,1067.21 382,1065 L382,1057 L390,1057 C392.209,1057 394,1055.21 394,1053 C394,1050.79 392.209,1049 390,1049" id="plus" sketch:type="MSShapeGroup">
                  </path>
                </g>
              </g>
            </g>
          </svg>
          Tambah Produk
        </button>
        <button
          className='checkout-button'
          onClick={onOpenCart}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M7.2502 8.99999C7.2502 8.58578 7.58599 8.24999 8.0002 8.24999H11.0002C11.4144 8.24999 11.7502 8.58578 11.7502 8.99999C11.7502 9.4142 11.4144 9.74999 11.0002 9.74999H8.0002C7.58599 9.74999 7.2502 9.4142 7.2502 8.99999Z" fill="#241f31"></path>
              <path fillRule="evenodd" clipRule="evenodd" d="M1.28869 2.76282C1.41968 2.36986 1.84442 2.15749 2.23737 2.28848L2.54176 2.38994C3.16813 2.5987 3.69746 2.77513 4.1137 2.96876C4.55613 3.17459 4.94002 3.42968 5.23112 3.83355C5.52222 4.23743 5.64282 4.68229 5.69817 5.16711C5.70129 5.19437 5.70421 5.222 5.70696 5.24999L16.511 5.24999C17.4869 5.24995 18.3034 5.24992 18.9278 5.34236C19.5793 5.4388 20.2076 5.66048 20.6038 6.26138C21 6.86229 20.9563 7.5271 20.7883 8.16384C20.6273 8.77419 20.3057 9.52462 19.9212 10.4216L19.4544 11.5109C19.2778 11.923 19.1224 12.2855 18.961 12.5725C18.7862 12.8832 18.5728 13.1653 18.2497 13.3784C17.9266 13.5914 17.5832 13.6764 17.2288 13.7147C16.9014 13.75 16.507 13.75 16.0587 13.75H6.15378C6.22758 13.8839 6.31252 13.9943 6.40921 14.091C6.68598 14.3677 7.07455 14.5482 7.80832 14.6468C8.56367 14.7484 9.56479 14.75 11.0002 14.75H19.0002C19.4144 14.75 19.7502 15.0858 19.7502 15.5C19.7502 15.9142 19.4144 16.25 19.0002 16.25H10.9453C9.57776 16.25 8.47541 16.25 7.60845 16.1335C6.70834 16.0125 5.95047 15.7536 5.34855 15.1516C4.74664 14.5497 4.48774 13.7918 4.36673 12.8917C4.25017 12.0248 4.25018 10.9225 4.2502 9.55487L4.2502 6.88303C4.2502 6.17003 4.24907 5.69826 4.20785 5.33726C4.16883 4.99541 4.10068 4.83052 4.01426 4.71062C3.92784 4.59072 3.79296 4.47392 3.481 4.3288C3.15155 4.17554 2.70435 4.02527 2.02794 3.79981L1.76303 3.7115C1.37008 3.58052 1.15771 3.15578 1.28869 2.76282ZM5.80693 12.25H16.022C16.5179 12.25 16.8305 12.249 17.0678 12.2234C17.287 12.1997 17.3713 12.1608 17.424 12.1261C17.4766 12.0914 17.5455 12.0292 17.6537 11.8371C17.7707 11.629 17.8948 11.3421 18.0901 10.8863L18.5187 9.88631C18.9332 8.91911 19.2087 8.2713 19.3379 7.78124C19.4636 7.30501 19.3999 7.16048 19.3515 7.08712C19.3032 7.01376 19.1954 6.89831 18.7082 6.82619C18.2068 6.75196 17.5029 6.74999 16.4506 6.74999H5.7502C5.75021 6.78023 5.75021 6.81069 5.7502 6.84138L5.7502 9.49999C5.7502 10.672 5.75127 11.5544 5.80693 12.25Z" fill="#241f31"></path>
              <path fillRule="evenodd" clipRule="evenodd" d="M7.5002 21.75C6.25756 21.75 5.2502 20.7426 5.2502 19.5C5.2502 18.2573 6.25756 17.25 7.5002 17.25C8.74284 17.25 9.7502 18.2573 9.7502 19.5C9.7502 20.7426 8.74284 21.75 7.5002 21.75ZM6.7502 19.5C6.7502 19.9142 7.08599 20.25 7.5002 20.25C7.91442 20.25 8.2502 19.9142 8.2502 19.5C8.2502 19.0858 7.91442 18.75 7.5002 18.75C7.08599 18.75 6.7502 19.0858 6.7502 19.5Z" fill="#241f31"></path>
              <path fillRule="evenodd" clipRule="evenodd" d="M14.2502 19.5001C14.2502 20.7427 15.2576 21.7501 16.5002 21.7501C17.7428 21.7501 18.7502 20.7427 18.7502 19.5001C18.7502 18.2574 17.7428 17.2501 16.5002 17.2501C15.2576 17.2501 14.2502 18.2574 14.2502 19.5001ZM16.5002 20.2501C16.086 20.2501 15.7502 19.9143 15.7502 19.5001C15.7502 19.0859 16.086 18.7501 16.5002 18.7501C16.9144 18.7501 17.2502 19.0859 17.2502 19.5001C17.2502 19.9143 16.9144 20.2501 16.5002 20.2501Z" fill="#241f31"></path>
            </g>
          </svg>
          {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
        </button>
      </div>

      <div className="emarket_content">
        {products.map((product) => (
          <div key={product.id_pos} className="relative">
            <div 
              className="product-card cursor-pointer"
              onClick={() => onView && onView(product)}
            >
              <img src={`/ecommerce/eMarket/${product.productimage}`} alt="" />
              <div className="information">
                <div>
                  <h2>Product Name</h2> {/* Anda mungkin perlu menambahkan field name di API */}
                </div>
                <p>Rp {product.price}</p>
                <div className='review'>
                  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="misc / star_filled">
                      <path id="System Icon" d="M14.38 6.3054C14.2898 6.02136 14.1212 5.76862 13.8935 5.57634C13.6658 5.38406 13.3884 5.26009 13.0933 5.21873L10.6 4.87873L9.47998 2.61206C9.34906 2.3463 9.14635 2.1225 8.8948 1.966C8.64325 1.80951 8.35291 1.72656 8.05665 1.72656C7.76039 1.72656 7.47005 1.80951 7.2185 1.966C6.96695 2.1225 6.76423 2.3463 6.63331 2.61206L5.51331 4.87873L3.01331 5.23873C2.72428 5.28522 2.45364 5.41045 2.23111 5.60066C2.00858 5.79087 1.84275 6.03872 1.75183 6.31699C1.66091 6.59526 1.64841 6.8932 1.71571 7.17811C1.783 7.46302 1.92749 7.72388 2.13331 7.93206L3.93998 9.69206L3.51331 12.2121C3.47338 12.4404 3.48397 12.6747 3.54433 12.8986C3.6047 13.1224 3.71337 13.1303 3.86271 13.5076C4.01205 13.6849 4.19843 13.8273 4.40874 13.9248C4.61904 14.0223 4.84816 14.0726 5.07998 14.0721C5.33748 14.072 5.59121 14.0103 5.81998 13.8921L8.05331 12.7187L10.2866 13.8921C10.5574 14.0315 10.8622 14.0912 11.1656 14.064C11.4689 14.0369 11.7583 13.9241 12 13.7387C12.2289 13.5628 12.4053 13.3274 12.5099 13.0583C12.6145 12.7891 12.6434 12.4965 12.5933 12.2121L12.1666 9.7254L14 7.93206C14.2083 7.72308 14.3543 7.46014 14.4214 7.17279C14.4885 6.88543 14.4742 6.88505 14.38 6.3054Z" fill="#FFC400"/>
                    </g>
                  </svg>
                  <p>{product.avg_rating} | {product.total_sold} terjual</p>
                </div>
              </div>
            </div>
            <div className="dropdown-container relative">
              <button
                className="option"
                onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown(product.id_pos);
                }}
              >
                <svg
                  fill="#3d3846"
                  viewBox="0 0 32 32"
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S17.654,13,16,13z"></path>
                  <path d="M6,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S7.654,13,6,13z"></path>
                  <path d="M26,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S27.654,13,26,13z"></path>
                </svg>
              </button>

              {openDropdown === product.id_pos && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                  <button
                    onClick={() => handleEdit(product)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id_pos)}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EMarket;