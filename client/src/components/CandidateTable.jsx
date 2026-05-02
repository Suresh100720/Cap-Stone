import React, { forwardRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Tag, Button, Dropdown, Avatar, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined, DownloadOutlined, ThunderboltOutlined } from '@ant-design/icons';

const CandidateTable = forwardRef(({ rowData, onEdit, onDelete, onSelectionChanged, type = 'candidate', isStatTable = false }, ref) => {

  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const isJobType = type === 'job';

  // Standard Column Definitions to match the image exactly
  let colDefs = isJobType ? [
    {
      field: 'title',
      headerName: 'JOB TITLE',
      flex: 1.5,
      fontWeight: 700
    },
    { field: 'department', headerName: 'DEPARTMENT', flex: 1 },
    { field: 'location', headerName: 'LOCATION', flex: 1 },
    {
      field: 'status',
      headerName: 'STATUS',
      flex: 1,
      cellRenderer: (p) => {
        const colors = { Open: 'success', Closed: 'error', 'On Hold': 'warning' };
        return <Tag color={colors[p.value] || 'blue'} style={{ borderRadius: '6px', fontWeight: 600 }}>{p.value}</Tag>;
      }
    },
    {
      headerName: 'ACTIONS',
      field: 'actions',
      width: 60,
      pinned: 'right',
      lockPinned: true,
      headerClass: 'ag-center-aligned-header',
      cellClass: 'd-flex align-items-center justify-content-center',
      cellRenderer: (params) => {
        const items = [
          { key: 'edit', label: 'Edit', icon: <EditOutlined />, onClick: () => onEdit(params.data) },
          { key: 'delete', label: 'Delete', danger: true, icon: <DeleteOutlined />, onClick: () => onDelete(params.data._id) }
        ];
        return (
          <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined style={{ color: '#94a3b8' }} />} onClick={(e) => e.stopPropagation()} />
          </Dropdown>
        );
      }
    }
  ] : [
    {
      headerName: '',
      field: 'checkbox',
      width: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left',
      lockPinned: true,
      suppressMenu: true,
      suppressMovable: true,
    },
    {
      field: 'name',
      headerName: 'NAME',
      flex: 1.5,
      cellRenderer: (p) => (
        <Space className="d-flex align-items-center h-100">
          <Avatar
            size={28}
            style={{
              backgroundColor: p.node.rowIndex % 2 === 0 ? '#7c3aed' : '#ec4899',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {getInitials(p.value)}
          </Avatar>
          <span style={{ fontWeight: 500, color: '#1e293b', marginLeft: '8px' }}>{p.value}</span>
        </Space>
      )
    },
    { field: 'email', headerName: 'EMAIL', flex: 1.8 },
    { field: 'phone', headerName: 'PHONE', flex: 1.2 },
    {
      field: 'skills',
      headerName: 'SKILLS',
      flex: 1.5,
      cellRenderer: (p) => (
        <div className="d-flex flex-wrap gap-1 align-items-center">
          {(p.value || []).slice(0, 3).map(skill => (
            <Tag key={skill} color="blue" style={{ fontSize: '10px', borderRadius: '4px', margin: 0 }}>
              {skill}
            </Tag>
          ))}
          {(p.value || []).length > 3 && (
            <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>
              +{p.value.length - 3}
            </span>
          )}
        </div>
      )
    },
    { field: 'role', headerName: 'ROLE', flex: 1.5 },
    {
      field: 'status',
      headerName: 'STATUS',
      flex: 1.2,
      cellRenderer: (p) => {
        const colors = {
          Applied: 'blue',
          Interview: 'purple',
          Rejected: 'error',
          Hired: 'success',
          Screening: 'warning'
        };
        const status = p.value || 'Applied';
        const color = colors[status] || 'blue';
        return (
          <Tag
            color={color}
            style={{
              borderRadius: '20px',
              fontWeight: 600,
              fontSize: '12px',
              padding: '0 12px'
            }}
          >
            {status}
          </Tag>
        );
      }
    },
    {
      headerName: 'ACTIONS',
      field: 'actions',
      width: 100,
      pinned: 'right',
      lockPinned: true,
      headerClass: 'ag-center-aligned-header',
      cellClass: 'd-flex align-items-center justify-content-center',
      cellRenderer: (params) => {
        const items = [
          { key: 'edit', label: 'Edit', icon: <EditOutlined />, onClick: () => onEdit(params.data) },
          { key: 'delete', label: 'Delete', danger: true, icon: <DeleteOutlined />, onClick: () => onDelete(params.data._id) }
        ];
        return (
          <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined style={{ color: '#94a3b8' }} />} onClick={(e) => e.stopPropagation()} />
          </Dropdown>
        );
      }
    }
  ];

  // Handle isStatTable: keep checkbox for export, but remove management actions
  if (isStatTable) {
    colDefs = colDefs.filter(col => col.field !== 'actions');
  }

  return (
    <div className="ag-theme-alpine w-100">
      <AgGridReact
        ref={ref}
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={{
          cellStyle: { textAlign: 'left', display: 'flex', alignItems: 'center' },
          headerClass: 'ag-left-aligned-header',
          sortable: true,
          filter: false,
          resizable: true,
          suppressMenu: true,
          suppressHeaderMenuButton: true,
          minWidth: 50
        }}
        pagination={true}
        paginationPageSize={15}
        domLayout='autoHeight'
        rowHeight={56}
        headerHeight={48}
        onGridReady={(params) => params.api.sizeColumnsToFit()}
        onSelectionChanged={onSelectionChanged}
        rowSelection='multiple'
        suppressRowClickSelection={true}
        sideBar={{
          toolPanels: [
            {
              id: 'columns',
              labelDefault: 'Columns',
              labelKey: 'columns',
              iconKey: 'columns',
              toolPanel: 'agColumnsToolPanel',
              toolPanelParams: {
                suppressRowGroups: true,
                suppressValues: true,
                suppressPivots: true,
                suppressPivotMode: true
              }
            }
          ]
        }}
      />
      <style>{`
        .ag-theme-alpine {
          --ag-header-background-color: #f8fafc;
          --ag-header-foreground-color: #64748b;
          --ag-border-color: #f1f5f9;
          --ag-row-hover-color: #f8fafc;
          --ag-selected-row-background-color: #f1f5f9;
          --ag-font-size: 13px;
          --ag-font-family: 'Plus Jakarta Sans', sans-serif;
          --ag-header-column-separator-display: block;
          --ag-header-column-separator-height: 40%;
          --ag-header-column-separator-color: #e2e8f0;
        }
        .ag-header-cell-label {
          font-weight: 800 !important;
          font-size: 11px !important;
          letter-spacing: 0.5px;
          color: #64748b;
        }
        .ag-theme-alpine .ag-root-wrapper {
          border: none !important;
        }
        .ag-theme-alpine .ag-header {
          border-bottom: 1px solid #e2e8f0 !important;
        }
        .ag-theme-alpine .ag-row {
          border-bottom: 1px solid #f1f5f9 !important;
        }
        .ag-left-aligned-header .ag-header-cell-label {
          justify-content: flex-start !important;
        }
        .ag-center-aligned-header .ag-header-cell-label {
          justify-content: center !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        .ag-center-aligned-header .ag-header-select-all {
          margin-right: 0 !important;
          display: flex !important;
          justify-content: center !important;
          width: 100% !important;
        }
        .ag-header-cell-comp-wrapper {
          justify-content: center !important;
        }
        /* Pagination Styling */
        .ag-paging-panel {
          height: 48px !important;
          border-top: 1px solid #f1f5f9 !important;
          color: #64748b !important;
          font-weight: 600 !important;
          font-size: 12px !important;
          padding: 0 24px !important;
        }
        .ag-paging-button {
          color: #94a3b8 !important;
        }
        .ag-paging-button:hover {
          color: #7c3aed !important;
        }
      `}</style>
    </div>
  );
});

export default CandidateTable;
