import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination } from 'antd';
import styled from 'styled-components';
import { setPaginationPage, selectPagination } from '../../store/slices/songLibrarySlice';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  margin-bottom: 16px;
`;

const SongPagination: React.FC = () => {
  const dispatch = useDispatch();
  const { currentPage, itemsPerPage, totalItems } = useSelector(selectPagination);

  // Don't render if there's only one page or no items
  if (totalItems <= itemsPerPage) {
    return null;
  }

  // Handle page change
  const handlePageChange = (page: number): void => {
    dispatch(setPaginationPage(page));
    // Scroll to top of list
    window.scrollTo(0, 0);
  };

  return (
    <PaginationContainer>
      <Pagination
        current={currentPage}
        total={totalItems}
        pageSize={itemsPerPage}
        onChange={handlePageChange}
        showSizeChanger={false}
      />
    </PaginationContainer>
  );
};

export default SongPagination;
