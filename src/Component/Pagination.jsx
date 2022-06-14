import React, {useState, useEffect} from 'react';

import ReactPaginate from 'react-paginate';
import { numberWithCommas } from '../numberFormatter';

// styles
import './Pagination.scss';

const Pagination = ({itemsPerPage, paginationData}) => {
    // items to print in response to pagination
    const Items = ({currentItems }) => {
        return (
        <ul className='list_container'>
        {currentItems &&
            currentItems.map((item) => (
            <li className='list_item' key={currentItems.indexOf(item)}>
            <h4>{currentItems.indexOf(item) + 1}. {item.name}</h4>
            <span className="separator"></span>
            <p>{numberWithCommas(item.steps)}</p>
            </li>
        ))}
        </ul>
        )
    }

    // We start with an empty list of items.
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
        // Fetch items from another resources.
        const endOffset = itemOffset + itemsPerPage;
        
        setCurrentItems(paginationData.slice(itemOffset, endOffset));

        setPageCount(Math.ceil(paginationData.length / itemsPerPage));
        
    }, [itemOffset, itemsPerPage, paginationData]);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {

        const newOffset = (event.selected * itemsPerPage) % paginationData.length;
        
        setItemOffset(newOffset);
    };

    return (
        <>
        <Items currentItems={currentItems} />
        <ReactPaginate
            breakLabel="..."
            breakClassName = "pagination_items"
            breakLinkClassName = "pagination_links"
            className = "pagination"
            nextLabel= ""
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel=""
            renderOnZeroPageCount={null}
        />
        </>
    );
}
export default Pagination;

